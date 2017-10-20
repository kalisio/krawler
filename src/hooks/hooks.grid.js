import _ from 'lodash'
import makeDebug from 'debug'
import SphericalMercator from '@mapbox/sphericalmercator'

const debug = makeDebug('krawler:hooks:grid')

const sphericalMercator = new SphericalMercator({
  size: 256
})

// Generate grid spec from location/width/resolution spec
export function generateGrid (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'generateGrid' hook should only be used as a 'before' hook.`)
  }

  if (_.isNumber(hook.data.resolution) && _.isNumber(hook.data.halfWidth) && _.isNumber(hook.data.longitude) && _.isNumber(hook.data.latitude)) {
    const resolution = hook.data.resolution
    // Convert resolution/width from meters to degrees and
    // compute corresponding delta latitude/longitude at given latitude
    const earthRadius = 6356752.31424518
    const convergenceFactor = Math.cos(hook.data.latitude * Math.PI / 180)
    const dLatitude = 360 * resolution / (2 * Math.PI * earthRadius)
    const dLongitude = dLatitude * convergenceFactor
    const halfWidthLatitude = 360 * hook.data.halfWidth / (2 * Math.PI * earthRadius)
    const halfWidthLongitude = halfWidthLatitude * convergenceFactor
    // Then setup grid spec
    hook.data.resolution = [ dLongitude, dLatitude ]
    hook.data.origin = [ hook.data.longitude - halfWidthLongitude, hook.data.latitude - halfWidthLatitude ]
    hook.data.size = [ 2 * halfWidthLongitude / dLongitude, 2 * halfWidthLatitude / dLatitude ]
    debug('Generated grid spec for data ', hook.data)
  }

  return hook
}

// Generate the task to download gridded data from grid spec
export function generateGridTasks (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'generateGridTasks' hook should only be used as a 'before' hook.`)
  }

  if (hook.data.origin && hook.data.origin.length > 1 &&
      hook.data.size && hook.data.size.length > 1 &&
      hook.data.resolution && hook.data.resolution.length > 1) {
    const origin = hook.data.origin
    const size = hook.data.size
    const resolution = hook.data.resolution

    let tasks = []
    for (let i = 0; i < size[0]; i++) {
      for (let j = 0; j < size[1]; j++) {
        let minLon = origin[0] + (i * resolution[0])
        let minLat = origin[1] + (j * resolution[1])
        let bbox = [
          minLon,
          minLat,
          minLon + resolution[0],
          minLat + resolution[1]
        ]
        // Check if we need to convert to spherical mercator
        // FIXME: manage more CRS
        let crs = _.get(hook.data, 'taskTemplate.options.SRS')
        if (!crs) crs = _.get(hook.data, 'taskTemplate.options.CRS')
        if (crs === 'EPSG:900913' || crs === 'EPSG:3857') {
          bbox = sphericalMercator.convert(bbox, '900913')
        }
        // Check if we need to invert XY
        let version = _.get(hook.data, 'taskTemplate.options.VERSION')
        if (version) {
          version = _.toNumber(version.replace('.', ''))
          // Before WMS v 1.1.3 order was always lon,lat
          // With WMS v 1.1.3 order si the same than the SRS used so usually lat,lon
          // FIXME: check with CRS
          if (version >= 113) {
            bbox = [ bbox[1], bbox[0], bbox[3], bbox[2] ]
          }
        }
        tasks.push({
          id: j.toFixed() + '-' + i.toFixed(),
          bbox,
          options: {
            BBOX: bbox[0] + ',' + bbox[1] + ',' + bbox[2] + ',' + bbox[3]
          }
        })
      }
    }
    debug('Generated grid tasks', tasks)
    hook.data.tasks = tasks
  }

  return hook
}
