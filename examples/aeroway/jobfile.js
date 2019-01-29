
const krawler = require('../../lib')
const hooks = krawler.hooks
const path = require('path')
const sift = require('sift')
const _ = require('lodash')
const makeDebug = require('debug')

const spec = require('./spec')

const debug = makeDebug('krawler:examples')

const airportsDB = require('./airports').features
const earthRadius = 6356752.31424518


let generateTask = (id, airport, type, distance) => {
  const lon = airport.geometry.coordinates[0]
  const lat = airport.geometry.coordinates[1]
  // Convert resolution/width from meters to degrees and
  // compute corresponding delta latitude/longitude at given latitude
  const convergenceFactor = Math.cos(lat * Math.PI / 180)
  const halfWidthLat = 360 * distance / (2 * Math.PI * earthRadius)
  const halfWidthLon = halfWidthLat * convergenceFactor
  const bbox = (lat - halfWidthLat) + ',' + (lon - halfWidthLon) + ',' + (lat + halfWidthLat) + ',' + (lon + halfWidthLon)
  const query = `[out:json][bbox:${bbox}];(node["aeroway"="${type}"];way["aeroway"="${type}"];relation["aeroway"="${type}"];);out body;>;out skel qt;`
  return {
    id: id + '-' + type,
    options: {
      data: query
    }
  }
}

// Create a custom hook to generate tasks
let generateTasks = (options) => {
  return (hook) => {
    let tasks = []
    options.airports.list.forEach(value => {
      // Find airport
      const results = sift({
        'properties.ICAO': value
      }, airportsDB)
      if (results.length === 0) {
        console.error('Could not found airport', value)
        return
      }
      console.log('Adding airport to queue', value)
      const airport = results[0]
      options.airports.params.types.forEach(type => tasks.push(generateTask(value, airport, type, options.airports.params.distance)))
    })
    debug('Generated download tasks', tasks)
    hook.data.tasks = tasks
    return hook
  }
}
hooks.registerHook('generateTasks', generateTasks)

module.exports = {
  id: 'aeroway-download',
  store: 'output-store',
  taskTemplate: {
    store: 'output-store',
    type: 'overpass'
  },
  options: {
    workersLimit: 4
  },
  hooks: {
    tasks: {
      after: {
        readJson: {},
        convertOSMToGeoJson: {},
        writeJson: {}
      }
    },
    jobs: {
      before: {
        createStores: [{
          id: 'output-store',
          type: 'fs',
          storePath: 'taskTemplate.outputStore',
          options: { path: path.join(__dirname, '..', 'output') }
        }],
        generateTasks: {
          airports: spec.airports
        }
      },
      after: {
        removeStores: ['output-store']
      }
    }
  }
}
