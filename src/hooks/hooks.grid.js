import _ from 'lodash'
import makeDebug from 'debug'
import SphericalMercator from '@mapbox/sphericalmercator'

const debug = makeDebug('krawler:hooks:grid')

const sphericalMercator = new SphericalMercator({
  size: 256
})

// Generate grid spec from location/width/resolution spec
export function generateGrid (options) {
  return function (hook) {
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
}

// Generate the task to download gridded data from grid spec
export function generateGridTasks (options) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'generateGridTasks' hook should only be used as a 'before' hook.`)
    }

    if (hook.data.origin && hook.data.origin.length > 1 &&
        hook.data.size && hook.data.size.length > 1 &&
        hook.data.resolution && hook.data.resolution.length > 1) {
      const origin = hook.data.origin
      const size = hook.data.size
      const resolution = hook.data.resolution

      let type = _.get(hook.data, 'taskTemplate.type')
      // Depending on the version number we have different options
      let version = _.get(hook.data, 'taskTemplate.options.version')
      if (version) {
        version = _.toNumber(version.split('.').join(''))
      }

      let tasks = []
      for (let i = 0; i < size[0]; i++) {
        for (let j = 0; j < size[1]; j++) {
          let minLon = origin[0] + (i * resolution[0])
          let minLat = origin[1] + (j * resolution[1])
          let bbox = [ minLon, minLat, minLon + resolution[0], minLat + resolution[1] ]

          // Check if we need to convert to spherical mercator
          // FIXME: manage more CRS
          let crs = (version >= 113 ? _.get(hook.data, 'taskTemplate.options.crs') : _.get(hook.data, 'taskTemplate.options.srs'))
          if (crs === 'EPSG:900913' || crs === 'EPSG:3857') {
            bbox = sphericalMercator.convert(bbox, '900913')
          }
          let task = {
            id: j.toFixed() + '-' + i.toFixed(),
            bbox,
            options: {}
          }
          if (type === 'wms') {
            // Check if we need to invert XY
            if (version >= 113) {
              // Before WMS v 1.1.3 order was always lon,lat but with WMS v 1.1.3 order si the same than the SRS used so usually lat,lon
              // FIXME: check with CRS
              bbox = [ bbox[1], bbox[0], bbox[3], bbox[2] ]
            }
            task.options.BBOX = bbox[0] + ',' + bbox[1] + ',' + bbox[2] + ',' + bbox[3]
          } else if (type === 'wcs') {
            if (version >= 200) {
              if (!task.options.subsets) task.options.subsets = {}
              task.options.subsets.Long = bbox[0] + ',' + bbox[2]
              task.options.subsets.Lat = bbox[1] + ',' + bbox[3]
            } else {
              // WCS 1.1 follows EPSG defined axis/tuple ordering for geographic coordinate systems.
              // This means that coordinates reported are actually handled as lat/long not long/lat.
              bbox = [ bbox[1], bbox[0], bbox[3], bbox[2] ]
              task.options.BOUNDINGBOX = bbox[0] + ',' + bbox[1] + ',' + bbox[2] + ',' + bbox[3] + ',' + 'urn:ogc:def:crs:EPSG::4326'
            }
          }
          tasks.push(task)
        }
      }
      debug('Generated grid tasks', tasks)
      hook.data.tasks = tasks
    }

    return hook
  }
}
