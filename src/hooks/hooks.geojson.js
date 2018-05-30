import _ from 'lodash'
import { reproject } from 'reproject'
import proj4 from 'proj4'
import epsg from '../epsg'
import makeDebug from 'debug'

const debug = makeDebug('krawler:hooks:geojson')
// Generate projection dictionary
epsg(proj4)
const crss = _.mapValues(proj4.defs, def => proj4.Proj(def))

// Reproject a GeoJSON
export function reprojectGeoJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'reprojectGeoJson' hook should only be used as a 'after' hook.`)
    }

    debug('Reproject GeoJSON for ' + hook.result.id)

    let geojson = _.get(hook, options.dataPath || 'result.data', {})
    // Reproject
    geojson = reproject(geojson, options.from || 'EPSG:4326', options.to || 'EPSG:4326', crss)
    // Then update JSON in place in memory
    _.set(hook, options.dataPath || 'result.data', geojson)
  }
}
