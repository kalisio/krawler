import _ from 'lodash'
import makeDebug from 'debug'
import SphericalMercator from '@mapbox/sphericalmercator'
import { Grid } from '../grid.js'
import { templateObject, transformJsonObject } from '../utils.js'

const debug = makeDebug('krawler:hooks:grid')

const sphericalMercator = new SphericalMercator({
  size: 256
})

// Generate grid spec from location/width/resolution spec
export function generateGrid (options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'generateGrid\' hook should only be used as a \'before\' hook.')
    }

    if (_.isNumber(hook.data.resolution) && _.isNumber(hook.data.halfWidth) && _.isNumber(hook.data.longitude) && _.isNumber(hook.data.latitude)) {
      const resolution = hook.data.resolution
      // Convert resolution/width from meters to degrees and
      // compute corresponding delta latitude/longitude at given latitude
      const earthRadius = 6356752.31424518
      // This will ensure that at any latitude the width/height are the same in meters (but not in degrees)
      const convergenceFactor = 1.0 / Math.cos(hook.data.latitude * Math.PI / 180)
      const dLatitude = 360 * resolution / (2 * Math.PI * earthRadius)
      const dLongitude = dLatitude * convergenceFactor
      const halfWidthLatitude = 360 * hook.data.halfWidth / (2 * Math.PI * earthRadius)
      const halfWidthLongitude = halfWidthLatitude * convergenceFactor
      // Then setup grid spec
      hook.data.resolution = [dLongitude, dLatitude]
      hook.data.origin = [hook.data.longitude - halfWidthLongitude, hook.data.latitude - halfWidthLatitude]
      hook.data.size = [Math.floor(2 * halfWidthLongitude / dLongitude), Math.floor(2 * halfWidthLatitude / dLatitude)]
      // Take into account a block resolution
      const blockResolution = hook.data.blockResolution
      if (blockResolution) {
        const dBlockLatitude = 360 * blockResolution / (2 * Math.PI * earthRadius)
        const dBlockLongitude = dBlockLatitude * convergenceFactor
        hook.data.blockResolution = [dBlockLongitude, dBlockLatitude]
        hook.data.nbBlocks = [Math.floor(2 * halfWidthLongitude / dBlockLongitude), Math.floor(2 * halfWidthLatitude / dBlockLatitude)]
        hook.data.blockSize = [hook.data.size[0] / hook.data.nbBlocks[0], hook.data.size[1] / hook.data.nbBlocks[1]]
      }
      debug('Generated grid specification for ', hook.data)
    }

    return hook
  }
}

// Generate the task to download gridded data from grid spec
export function generateGridTasks (options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'generateGridTasks\' hook should only be used as a \'before\' hook.')
    }

    if (hook.data.origin && hook.data.origin.length > 1 &&
        hook.data.size && hook.data.size.length > 1 &&
        hook.data.resolution && hook.data.resolution.length > 1) {
      const origin = hook.data.origin
      // One task can target a block of the grid or the final grid resolution
      const blockSize = hook.data.blockSize
      const size = hook.data.nbBlocks || hook.data.size
      const resolution = hook.data.blockResolution || hook.data.resolution

      const type = _.get(hook.data, 'taskTemplate.type')
      // Depending on the version number we have different options
      let version = _.get(hook.data, 'taskTemplate.options.version')
      if (version) {
        version = _.toNumber(version.split('.').join(''))
      }
      const longitudeLabel = _.get(hook.data, 'taskTemplate.options.longitudeLabel', 'long')
      const latitudeLabel = _.get(hook.data, 'taskTemplate.options.latitudeLabel', 'lat')
      // Once consumed not required anymore and will avoid polluting request parameters
      _.unset(hook.data, 'taskTemplate.options.longitudeLabel')
      _.unset(hook.data, 'taskTemplate.options.latitudeLabel')

      const tasks = []
      for (let i = 0; i < size[0]; i++) {
        for (let j = 0; j < size[1]; j++) {
          const minLon = origin[0] + (i * resolution[0])
          const minLat = origin[1] + (j * resolution[1])
          let bbox = [minLon, minLat, minLon + resolution[0], minLat + resolution[1]]

          // Check if we need to convert to spherical mercator
          // FIXME: manage more CRS
          const crs = (version >= 113 ? _.get(hook.data, 'taskTemplate.options.crs') : _.get(hook.data, 'taskTemplate.options.srs'))
          if (crs === 'EPSG:900913' || crs === 'EPSG:3857') {
            bbox = sphericalMercator.convert(bbox, '900913')
          }
          const task = {
            id: j.toFixed() + '-' + i.toFixed(),
            bbox,
            options: {}
          }
          if (type === 'wms') {
            // Check if we need to invert XY
            if (version >= 113) {
              // Before WMS v 1.1.3 order was always lon,lat but with WMS v 1.1.3 order si the same than the SRS used so usually lat,lon
              // FIXME: check with CRS
              bbox = [bbox[1], bbox[0], bbox[3], bbox[2]]
            }
            // Resample to target grid resolution ?
            if (options.resample) {
              if (blockSize) {
                task.options.width = blockSize[0]
                task.options.height = blockSize[1]
              } else {
                task.options.width = 1
                task.options.height = 1
              }
            }
            task.options.BBOX = bbox[0] + ',' + bbox[1] + ',' + bbox[2] + ',' + bbox[3]
          } else if (type === 'wcs') {
            if (version >= 200) {
              if (!task.options.subsets) task.options.subsets = {}
              task.options.subsets[longitudeLabel] = bbox[0] + ',' + bbox[2]
              task.options.subsets[latitudeLabel] = bbox[1] + ',' + bbox[3]
              // Resample to target grid resolution ?
              if (options.resample) {
                const resampleLongitudeLabel = _.get(hook.data, 'taskTemplate.options.resampleLongitudeLabel', longitudeLabel)
                const resampleLatitudeLabel = _.get(hook.data, 'taskTemplate.options.resampleLatitudeLabel', latitudeLabel)
                if (blockSize) {
                  task.options.scalesize = resampleLongitudeLabel + '(' + blockSize[0] + ')' + ',' + resampleLatitudeLabel + '(' + blockSize[1] + ')'
                } else {
                  task.options.scalesize = resampleLongitudeLabel + '(' + 1 + ')' + ',' + resampleLatitudeLabel + '(' + 1 + ')'
                }
              }
            } else {
              // WCS 1.1 follows EPSG defined axis/tuple ordering for geographic coordinate systems.
              // This means that coordinates reported are actually handled as lat/long not long/lat.
              bbox = [bbox[1], bbox[0], bbox[3], bbox[2]]
              task.options.boundingbox = bbox[0] + ',' + bbox[1] + ',' + bbox[2] + ',' + bbox[3] + ',' + 'urn:ogc:def:crs:EPSG::4326'
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

// Resample a grid
export function resampleGrid (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'resampleGrid\' hook should only be used as a \'after\' hook.')
    }

    debug('Resampling grid for ' + hook.result.id)

    let data = _.get(hook, options.dataPath || 'result.data', []) || []
    const grid = new Grid({
      bounds: options.input.bounds,
      origin: options.input.origin,
      size: options.input.size,
      resolution: options.input.resolution,
      data
    })
    data = grid.resample(options.output.origin, options.output.resolution, options.output.size)
    _.set(hook, options.dataPath || 'result.data', data)
  }
}

// Tile a grid
export function tileGrid (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'tileGrid\' hook should only be used as a \'after\' hook.')
    }

    debug('Tiling grid for ' + hook.result.id)

    const data = _.get(hook, options.dataPath || 'result.data', []) || []
    const grid = new Grid({
      bounds: options.input.bounds,
      origin: options.input.origin,
      size: options.input.size,
      resolution: options.input.resolution,
      data
    })
    let tiles = grid.tileset(options.output.resolution)
    // Add GeoJson geometry
    tiles.forEach(tile => Object.assign(tile, Grid.toGeometry(tile.bounds)))
    // Allow transform before write
    if (options.transform) {
      const templatedTransform = templateObject(hook.result, options.transform)
      tiles = transformJsonObject(tiles, templatedTransform)
    }
    _.set(hook, options.dataPath || 'result.data', tiles)
  }
}
