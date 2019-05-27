import _ from 'lodash'
import { reproject } from 'reproject'
import proj4 from 'proj4'
import epsg from '../epsg'
import osmtogeojson from 'osmtogeojson'
import makeDebug from 'debug'
import { writeJson, readJson } from './hooks.json'

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

// Convert a Json to a GeoJSON point collection
export function convertToGeoJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'convertToGeoJson' hook should only be used as a 'after' hook.`)
    }

    debug('Converting to GeoJSON for ' + hook.result.id)

    let json = _.get(hook, options.dataPath || 'result.data', {}) || {}
    // Safety check
    let isArray = Array.isArray(json)
    if (!isArray) {
      json = [json]
    }

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

// Convert a Json to a GeoJSON point collection
export function convertOSMToGeoJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'convertOSMToGeoJson' hook should only be used as a 'after' hook.`)
    }

    debug('Converting OSM to GeoJSON for ' + hook.result.id)
    let osm = _.get(hook, options.dataPath || 'result.data', {}) || {}

    // Then update JSON in place in memory
    _.set(hook, options.dataPath || 'result.data', osmtogeojson(osm, options))
  }
}

// Reproject a GeoJSON
export function reprojectGeoJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'reprojectGeoJson' hook should only be used as a 'after' hook.`)
    }

    debug('Reproject GeoJSON for ' + hook.result.id)

    let geojson = _.get(hook, options.dataPath || 'result.data', {}) || {}
    // Reproject
    geojson = reproject(geojson, options.from || 'EPSG:4326', options.to || 'EPSG:4326', crss)
    // Then update JSON in place in memory
    _.set(hook, options.dataPath || 'result.data', geojson)
  }
}
