import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'
import { DOMParser } from 'xmldom'
import { kml } from '@tmcw/togeojson'
import common from 'feathers-hooks-common'
import makeDebug from 'debug'
import { getStoreFromHook } from '../utils.js'

const { getItems } = common
const debug = makeDebug('krawler:hooks:kml')

// Generate a GeoJSON from specific hook result values
export function readKML(options = {}) {
  return async function (hook) {
    const item = getItems(hook)

    const store = await getStoreFromHook(hook, 'readKML', options)
    if (!store.path && !store.buffers) {
      throw new Error('The \'readKML\' hook only work with the fs or memory blob store.')
    }

    let kmldocument
    const kmlName = item.id
    if (store.path) {
      const filePath = path.join(store.path, kmlName)
      debug('Reading KML file ' + filePath)
      kmldocument = await fs.readFile(filePath)
    } else {
      debug('Parsing KML for ' + kmlName)
      kmldocument = store.buffers[kmlName]
    }

    // Clear previous data if any as we append
    const jsonPath = options.dataPath || 'result.data'
    _.unset(hook, jsonPath)

    const json = kml(new DOMParser().parseFromString(kmldocument.toString()))

    // Automatically read features from a GeoJson collection
    if (options.features && (json.type === 'FeatureCollection') && json.features && Array.isArray(json.features)) json = json.features
    if (options.objectPath) json = _.get(json, options.objectPath)

    // Allow transform after read
    if (options.transform) json = transformJsonObject(json, options.transform)

    _.set(hook, options.dataPath || 'result.data', json)
    return hook

  }
}
