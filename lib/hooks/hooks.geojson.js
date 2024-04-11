import path from 'path'
import _ from 'lodash'
import fs from 'fs-extra'
import readline from 'readline'
import common from 'feathers-hooks-common'
import { reproject } from 'reproject'
import proj4 from 'proj4'
import osmtogeojson from 'osmtogeojson'
import makeDebug from 'debug'
import { getStoreFromHook, template, transformJsonObject } from '../utils.js'
import epsg from '../epsg.js'
import { writeJson, readJson } from './hooks.json.js'
const { getItems } = common

const debug = makeDebug('krawler:hooks:geojson')
// Generate projection dictionary
epsg(proj4)
const crss = _.mapValues(proj4.defs, def => proj4.Proj(def))

// Convenient name but similar to writeJson
export function writeGeoJson (options = {}) {
  return writeJson(options)
}

// Convenient name but similar to readJson
export function readGeoJson (options = {}) {
  return readJson(options)
}

// For sequential files
export function readSequentialGeoJson (options = {}) {
  return async function (hook) {
    const item = getItems(hook)

    const store = await getStoreFromHook(hook, 'readSequentialGeoJson', options)
    if (!store.path && !store.buffers) {
      throw new Error('The \'readSequentialGeoJson\' hook only work with the fs blob store.')
    }

    let json = []
    const jsonName = template(item, options.key || item.id)
    const filePath = path.join(store.path, jsonName)
    debug('Reading sequential GeoJSON file ' + filePath)
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity
    })

    await new Promise((resolve, reject) => {
      rl
        .on('line', (line) => {
          json.push(JSON.parse(line))
        })
        .on('close', resolve)
        .on('error', reject)
    })
    // Allow transform after read
    if (options.transform) json = transformJsonObject(json, options.transform)
    if (options.asFeatureCollection) json = { type: 'FeatureCollection', features: json }

    _.set(hook, options.dataPath || 'result.data', json)
    return hook
  }
}

// Convert a Json to a GeoJSON point collection
export function convertToGeoJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'convertToGeoJson\' hook should only be used as a \'after\' hook.')
    }

    debug('Converting to GeoJSON for ' + hook.result.id)

    let json = _.get(hook, options.dataPath || 'result.data', {}) || {}
    // Safety check
    const isArray = Array.isArray(json)
    if (!isArray) {
      json = [json]
    }

    // Declare the output GeoJson collection
    const collection = {
      type: 'FeatureCollection',
      features: []
    }
    const geometry = options.geometry || 'geometry'
    const longitude = options.longitude || 'longitude'
    const latitude = options.latitude || 'latitude'
    const altitude = options.altitude || 'altitude'
    // Then iterate over JSON objects
    _.forEach(json, object => {
      const geo = _.get(object, geometry)
      const lon = Number(_.get(object, longitude, 0))
      const lat = Number(_.get(object, latitude, 0))
      const alt = Number(_.get(object, altitude, 0))
      if (geo || (lat && lon)) {
        // Define the GeoJson feature corresponding to the object
        const feature = {
          type: 'Feature',
          // Lat, long, alt not required anymore
          // Keep GeoJson properties but avoid geometry, etc. in case the target object is already a GeoJson feature
          properties: Object.assign({}, _.get(object, 'properties'),
            (options.keepGeometryProperties
              ? _.omit(object, ['properties', 'geometry', 'type'])
              : _.omit(object, [geometry, longitude, latitude, altitude, 'properties', 'geometry', 'type']))),
          geometry: (geo || {
            type: 'Point',
            coordinates: [lon, lat, alt]
          })
        }
        collection.features.push(feature)
      }
    })

    // Then update JSON in place in memory
    _.set(hook, options.dataPath || 'result.data', collection)
  }
}

// Convert a Json to a GeoJSON point collection
export function convertOSMToGeoJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'convertOSMToGeoJson\' hook should only be used as a \'after\' hook.')
    }

    debug('Converting OSM to GeoJSON for ' + hook.result.id)
    const osm = _.get(hook, options.dataPath || 'result.data', {}) || {}

    // Then update JSON in place in memory
    _.set(hook, options.dataPath || 'result.data', osmtogeojson(osm, options))
  }
}

// Reproject a GeoJSON
export function reprojectGeoJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'reprojectGeoJson\' hook should only be used as a \'after\' hook.')
    }

    debug('Reproject GeoJSON for ' + hook.result.id)

    let geojson = _.get(hook, options.dataPath || 'result.data', {}) || {}
    // Reproject
    geojson = reproject(geojson, options.from || 'EPSG:4326', options.to || 'EPSG:4326', crss)
    // Then update JSON in place in memory
    _.set(hook, options.dataPath || 'result.data', geojson)
  }
}
