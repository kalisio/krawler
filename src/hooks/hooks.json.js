import path from 'path'
import _ from 'lodash'
import fs from 'fs-extra'
import sift from 'sift'
import moment from 'moment'
import math from 'mathjs'
import makeDebug from 'debug'
import { getStoreFromHook, addOutput, writeBufferToStore } from '../utils'

const debug = makeDebug('krawler:hooks:json')
// Add knot unit not defined by default
math.createUnit('knot', { definition: '0.514444 m/s', aliases: ['knots', 'kt', 'kts'] })

// Generate a JSON from specific hook result values
export function writeJson (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'writeJson' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'writeJson', options)

    debug('Creating JSON for ' + hook.data.id)
    let json = _.get(hook, options.dataPath || 'result.data', {})
    let jsonName = hook.data.id + '.json'
    await writeBufferToStore(
      Buffer.from(JSON.stringify(json), 'utf8'),
      store, {
        key: jsonName,
        params: Object.assign({}, options.storageOptions) // See https://github.com/kalisio/krawler/issues/7
      }
    )
    addOutput(hook.result, jsonName, options.outputType)
    return hook
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
    let rootJson = json
    if (options.transformPath) {
      json = _.get(json, options.transformPath)
    }
    if (options.toArray) {
      json = _.toArray(json)
    }
    if (options.toObjects) {
      json = json.map(array => array.reduce((object, value, index) => {
        // Set the value at index on object using key provided in input list
        const propertyName = options.toObjects[index]
        object[propertyName] = value
        return object
      }, {}))
    }
    // Safety check
    let isArray = Array.isArray(json)
    if (!isArray) {
      json = [json]
    }
    if (options.filter) {
      json = sift(options.filter, json)
    }
    // Iterate over path mapping
    _.forOwn(options.mapping, (output, inputPath) => {
      let outputPath = output
      if (typeof output === 'object') {
        outputPath = outputPath.path
      }
      // Then iterate over JSON objects
      _.forEach(json, object => {
        let value = _.get(object, inputPath)
        // Perform value mapping (if any)
        if (typeof output === 'object' && output.values) {
          value = output.values[value]
        }
        // Perform key mapping
        _.set(object, outputPath, value)
      })
      _.forEach(json, object => {
        _.unset(object, inputPath)
      })
    })
    // Iterate over unit mapping
    _.forOwn(options.unitMapping, (units, path) => {
      // Then iterate over JSON objects
      _.forEach(json, object => {
        // Perform conversion
        const value = _.get(object, path)
        if (value) {
          // Handle dates
          if (units.asDate) {
            let date
            // Handle UTC or local dates using input format if provided
            if (units.asDate === 'utc') {
              date = (units.from ? moment.utc(value, units.from) : moment.utc(value))
            } else {
              date = (units.from ? moment(value, units.from) : moment(value))
            }
            // In this case we'd like to reformat as a string
            // otherwise the moment object is converted to standard JS Date
            if (units.to) {
              date = date.format(units.to)
            } else {
              date = date.toDate()
            }
            _.set(object, path, date)
          } else { // Handle numbers
            _.set(object, path, math.unit(value, units.from).toNumber(units.to))
          }
        }
      })
    })
    // Then iterate over JSON objects to pick/omit properties in place
    for (let i = 0; i < json.length; i++) {
      let object = json[i]
      if (options.pick) {
        object = _.pick(object, options.pick)
      }
      if (options.omit) {
        object = _.omit(object, options.omit)
      }
      if (options.merge) {
        object = _.merge(object, options.merge)
      }
      json[i] = object
    }
    // Then update JSON in place in memory
    if (options.transformPath) {
      _.set(rootJson, options.transformPath, json)
      json = rootJson
    }
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
    const longitude = options.longitude || 'longitude'
    const latitude = options.latitude || 'latitude'
    const altitude = options.altitude || 'altitude'
    // Then iterate over JSON objects
    _.forEach(json, object => {
      let lon = Number(_.get(object, longitude, 0))
      let lat = Number(_.get(object, latitude, 0))
      let alt = Number(_.get(object, altitude, 0))
      if (lat && lon) {
        // Define the GeoJson feature corresponding to the object
        let feature = {
          type: 'Feature',
          // Lat, long, alt not required anymore
          properties: (options.keepGeometryProperties ? object : _.omit(object, [longitude, latitude, altitude])),
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

// Generate a file based on a template and injected JSON from specific hook result values
export function writeTemplate (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'writeTemplate' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'writeTemplate', options)
    if (!store.path) {
      throw new Error(`The 'writeTemplate' hook only work with the fs blob store.`)
    }

    let templateStore = await getStoreFromHook(hook, 'writeTemplate', {
      store: options.templateStore,
      storePath: options.templateStorePath || 'templateStore'
    })
    if (!templateStore.path) {
      throw new Error(`The 'writeTemplate' hook only work with the fs blob store.`)
    }

    const ext = path.extname(options.templateFile)
    debug('Creating file from template ' + options.templateFile + ' for ' + hook.data.id)
    const templateFilePath = path.join(templateStore.path, options.templateFile)
    let template = await fs.readFile(templateFilePath)
    let compiler = _.template(template.toString())
    const filePath = path.join(store.path, hook.data.id + ext)
    await fs.outputFile(filePath, compiler(_.get(hook, options.dataPath || 'result.data', {})))
    addOutput(hook.result, hook.data.id + ext, options.outputType)
    return hook
  }
}

// Generate a JSON from different ones in the output store
export function mergeJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'mergeJson' hook should only be used as a 'after' hook.`)
    }

    debug('Merging JSON for ' + hook.data.id)
    // Only in-memory for now
    let objects = hook.result.map(result => _.get(result, options.dataPath || 'data', {}))
    let json = _.unionBy(...objects, options.by)
    _.set(hook, options.dataPath || 'result.data', json)
    return hook
  }
}

// Read a JSON from an input stream/store
export function readJson (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'readJson' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'readJson', options)
    if (!store.path && !store.buffers) {
      throw new Error(`The 'readJson' hook only work with the fs or memory blob store.`)
    }

    let json = {}
    const jsonName = hook.result.id
    if (store.path) {
      const filePath = path.join(store.path, jsonName)
      debug('Reading JSON file ' + filePath)
      try {
        json = await fs.readJson(filePath)
      } catch (error) {
        debug('Impossible to read json', error)
      }
    } else {
      debug('Parsing JSON for ' + jsonName)
      const data = store.buffers[jsonName].toString()
      try {
        json = JSON.parse(data)
        // Sometimes we get a response string containing a JSON as a string
        if (typeof json === 'string') json = JSON.parse(json)
      } catch (error) {
        debug('Impossible to parse json', data, error)
      }
    }
    if (options.objectPath) {
      json = _.get(json, options.objectPath)
    }
    _.set(hook, options.dataPath || 'result.data', json)
    return hook
  }
}
