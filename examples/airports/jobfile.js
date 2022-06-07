import { hooks } from '../../lib/index.js'
import path from 'path'
import fs from 'fs-extra'
import sift from 'sift'
import _ from 'lodash'
import makeDebug from 'debug'
import { fileURLToPath } from 'url'
import spec from './spec.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const debug = makeDebug('krawler:examples')
const earthRadius = 6356752.31424518
const runways = fs.readJsonSync(path.join(__dirname, './runways.json')).features
const airports = fs.readJsonSync(path.join(__dirname, './airports.json')).features

let generateTask = (id, feature, params) => {
  const longitude = feature.geometry.coordinates[0]
  const latitude = feature.geometry.coordinates[1]
  // Convert resolution/width from meters to degrees and
  // compute corresponding delta latitude/longitude at given latitude
  const convergenceFactor = Math.cos(latitude * Math.PI / 180)
  const dLatitude = 360 * params.resolution / (2 * Math.PI * earthRadius)
  const dLongitude = dLatitude * convergenceFactor
  const halfWidthLatitude = 360 * params.halfWidth / (2 * Math.PI * earthRadius)
  const halfWidthLongitude = halfWidthLatitude * convergenceFactor
  return {
    id,
    feature,
    resolution: spec.resolution,
    layer: params.layer,
    dLongitude, dLatitude,
    minLongitude: longitude - halfWidthLongitude,
    maxLongitude: longitude + halfWidthLongitude,
    minLatitude: latitude - halfWidthLatitude,
    maxLatitude: latitude + halfWidthLatitude,
    type: 'noop'
  }
}

// Create a custom hook to generate tasks
let generateTasks = (options) => {
  return (hook) => {
    let tasks = []
    options.runways.list.forEach(value => {
      // Find runway
      const icao = value.substr(0,4)
      const id = value.substr(4,3)
      const results = sift({
        'properties.Airport': { $regex: `^${icao}` },
        'properties.Ident': { $regex: `${id}$` }
      }, runways)
      if (results.length === 0) {
        console.error('Could not found runway', icao, id)
        return
      }
      console.log('Adding runway to queue', icao, id)
      const runway = results[0]
      tasks.push(generateTask(value, runway, options.runways.params))
    })
    options.airports.list.forEach(value => {
      // Find airport
      const results = sift({
        'properties.ICAO': value
      }, airports)
      if (results.length === 0) {
        console.error('Could not found airport', value)
        return
      }
      console.log('Adding airport to queue', value)
      const airport = results[0]
      tasks.push(generateTask(value, airport, options.airports.params))
    })
    debug('Generated download tasks', tasks)
    hook.data.tasks = tasks
    return hook
  }
}
hooks.registerHook('generateTasks', generateTasks)

export default {
  id: 'airports-download',
  options: {
    workersLimit: 4
  },
  hooks: {
    tasks: {
      before: {
      },
      after: {
        runCommand: {
          command: 'gdal_translate -of GTiff -co "TILED=YES" \
          -projwin <%= minLongitude %> <%= maxLatitude %> <%= maxLongitude %> <%= minLatitude %> \
          -tr <%= dLongitude %> <%= dLatitude %> \
          -r lanczos <%= env.GDAL_SERVICES_PATH %>/<%= layer %> <%= env.KRAWLER_OUTPUT_PATH %>\\<%= id %>.tif'
        }
      }
    },
    jobs: {
      before: {
        generateTasks: {
          runways: spec.runways || [],
          airports: spec.airports || []
        }
      },
      after: {
      }
    }
  }
}
