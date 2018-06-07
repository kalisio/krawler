const krawler = require('../../lib')
const hooks = krawler.hooks
const sift = require('sift')
const makeDebug = require('debug')
const _ = require('lodash')
const runways = require('./runways').features
const airports = require('./airports').features
const spec = require('./spec')

const debug = makeDebug('krawler:examples')
const earthRadius = 6356752.31424518

let generateTask = (id, feature) => {
  const longitude = feature.geometry.coordinates[0]
  const latitude = feature.geometry.coordinates[1]
  // Convert resolution/width from meters to degrees and
  // compute corresponding delta latitude/longitude at given latitude
  const convergenceFactor = Math.cos(latitude * Math.PI / 180)
  const dLatitude = 360 * spec.resolution / (2 * Math.PI * earthRadius)
  const dLongitude = dLatitude * convergenceFactor
  const halfWidthLatitude = 360 * spec.halfWidth / (2 * Math.PI * earthRadius)
  const halfWidthLongitude = halfWidthLatitude * convergenceFactor
  return {
    id,
    feature,
    resolution: spec.resolution,
    layer: spec.layer,
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
    options.runways.forEach(value => {
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
      tasks.push(generateTask(value, runway))
    })
    options.airports.forEach(value => {
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
      tasks.push(generateTask(value, airport))
    })
    debug('Generated download tasks', tasks)
    hook.data.tasks = tasks
    return hook
  }
}
hooks.registerHook('generateTasks', generateTasks)

module.exports = {
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
          -r lanczos <%= layer %> ../output/<%= id %>.tif'
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
