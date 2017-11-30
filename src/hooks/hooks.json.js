import path from 'path'
import _ from 'lodash'
import fs from 'fs-extra'
import makeDebug from 'debug'
import { getStoreFromHook } from '../stores'

const debug = makeDebug('krawler:hooks:json')

// Generate a JSON from specific hook result values
export function writeJson (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'writeJson' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'writeJson', options.storePath)

    return new Promise(async (resolve, reject) => {
      debug('Creating JSON for ' + hook.data.id)
      const filePath = path.join(store.path, hook.data.id + '.json')
      fs.outputJson(filePath, _.get(hook, options.dataPath || 'result.data', {}))
      .then(_ => resolve(hook))
      .catch(reject)
    })
  }
}

// Restructure a JSON from specific hook result values
export function transformJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'transformJson' hook should only be used as a 'after' hook.`)
    }

    debug('Transforming JSON for ' + hook.result.id)

    let json = _.get(hook, options.dataPath || 'result.data', {})
    // Iterate over path mapping
    _.forOwn(options.mapping, (outputPath, inputPath) => {
      // Then iterate over JSON objects
      _.forEach(json, object => {
        // Perform mapping
        _.set(object, outputPath, _.get(object, inputPath))
      })
      // Now we can erase old date
      _.forEach(json, object => {
        _.unset(object, inputPath)
      })
    })
    // Then update JSON in place in memory
    _.set(hook, options.dataPath || 'result.data', json)
  }
}

// Convert a Json to a GeoJSON point collection
export function convertToGeoJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'convertToGeoJson' hook should only be used as a 'after' hook.`)
    }

    debug('Converting to GeoJSON for ' + hook.result.id)

    let json = _.get(hook, options.dataPath || 'result.data', {})

    // Declare the output GeoJson collection
    let collection = { 
      type: 'FeatureCollection', 
      features: [] 
    }
        
    // Then iterate over JSON objects
     _.forEach(json, object => {
      let lon = Number(_.get(object, options.longitude || 'longitude', 0))
      let lat = Number(_.get(object, options.latitude || 'latitude', 0))
      let alt = Number(_.get(object, options.altitude || 'altitude', 0))
      if (lat && lon) {
        // Define the GeoJson feature corresponding to the object
        let feature = {
          type: 'Feature',
          properties: object,
          geometry: {
            type: 'Point',
            coordinates: [lon, lat, alt]
          }
        }
        collection.features.push(feature)
      }
    })
    
    // Then update JSON in place in memory
    _.set(hook, options.dataPath || 'result.data', collection)
  }
}
