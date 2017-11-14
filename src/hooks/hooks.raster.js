import path from 'path'
import _ from 'lodash'
import fs from 'fs-extra'
import makeDebug from 'debug'
import gtif from 'geo-pixel-stream'
import gdal from 'gdal'

const debug = makeDebug('krawler:hooks:raster')

async function getStream (hook, hookName) {
  // Check if store object already provided or has to be found
  let store = (hook.params.store ? hook.params.store : await hook.app.service('stores').get(typeof hook.data.store === 'object' ? hook.data.store.id : hook.data.store))
  let fileName = hook.result.id
  if (!store || !store.path || (path.extname(fileName) !== '.tif')) {
    throw new Error(`The ${hookName} hook only work with GeoTiff files and the fs blob store.`)
  }
  const filePath = path.join(store.path, fileName)
  let readers = []
  try {
    readers = gtif.createReadStreams(filePath)
  } catch (error) {
    throw new Error(`Cannot read file ${filePath}.`)
  }
  // No band found
  if (readers.length === 0) {
    throw new Error(`Nothing to read from file ${filePath}.`)
  }

  let stream = readers[0]
  stream.on('end', () => {
    // Force closing underlying GDAL dataset immediately (not waiting for GC) as it might be large
    stream._src.close()
  })

  debug('Read file metadata for ' + filePath + ':', stream.metadata)

  return { store, filePath, stream, dataset: stream._src, band: stream._band }
}

// Compute min/max value/elevation on a zone
export function computeStatistics (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'computeStatistics' hook should only be used as a 'after' hook.`)
    }

    return new Promise(async (resolve, reject) => {
      let geotiff
      try {
        geotiff = await getStream(hook, 'computeStatistics')
      } catch (error) {
        reject(error)
        return
      }
      let { filePath, stream, band } = geotiff
      debug('Computing statistics for ' + filePath)
      let maxValue = Number.NEGATIVE_INFINITY
      let minValue = Number.POSITIVE_INFINITY
      stream.on('data', (data) => {
        let blockLen = data.blockSize.x * data.blockSize.y
        for (let i = 0; i < blockLen; i++) {
          let value = data.buffer[i]
          if (value !== band.noDataValue) {
            if (value < minValue) minValue = value
            if (value > maxValue) maxValue = value
          }
        }
      })

      stream.on('end', () => {
        if (options.max) hook.result.max = maxValue
        if (options.min) hook.result.min = minValue
        resolve(hook)
      })
    })
  }
}

// Convert GeoTiff to JSON
export function geotiff2json (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'geotiff2json' hook should only be used as a 'after' hook.`)
    }

    return new Promise(async (resolve, reject) => {
      let geotiff
      try {
        geotiff = await getStream(hook, 'geotiff2json')
      } catch (error) {
        reject(error)
        return
      }
      let { filePath, stream, dataset, band } = geotiff
      const wgs84 = gdal.SpatialReference.fromEPSG(4326)
      const geotransform = dataset.geoTransform
      const coordinateTransform = new gdal.CoordinateTransformation(dataset.srs, wgs84)

      let json = new Array(stream.metadata.width * stream.metadata.height)
      json.fill(band.noDataValue || 0)
      debug('Converting ' + json.length + ' values of ' + filePath + ' to JSON')
      stream.on('data', (data) => {
        let xOffset = data.offset.x * data.blockSize.x
        let yOffset = data.offset.y * data.blockSize.y
        for (let i = 0; i < data.blockSize.x; i++) {
          for (let j = 0; j < data.blockSize.y; j++) {
            const x = xOffset + i
            const y = yOffset + j
            // Take care that blocks do not exactly fit image size
            if ((x < stream.metadata.width) && (y < stream.metadata.height)) {
              let value = data.buffer[i + j * data.blockSize.y]
              // If no fields given simply export the value matrix
              if (!options.fields) {
                json[x * stream.metadata.width + y] = value
              } else {
                // Compute pixel bbox, take care that when x increases longitude increases
                // but when y increases latitude decreases
                let topLeft = {
                  x: geotransform[0] + x * geotransform[1] + (y + 1) * geotransform[2],
                  y: geotransform[3] + x * geotransform[4] + (y + 1) * geotransform[5]
                }
                let bottomRight = {
                  x: geotransform[0] + (x + 1) * geotransform[1] + y * geotransform[2],
                  y: geotransform[3] + (x + 1) * geotransform[4] + y * geotransform[5]
                }

                topLeft = coordinateTransform.transformPoint(topLeft)
                bottomRight = coordinateTransform.transformPoint(bottomRight)
                const bbox = [topLeft.x, topLeft.y, bottomRight.x, bottomRight.y]
                // Otherwise pick which field shoul be exported
                json[x * stream.metadata.width + y] = _.pick({ x, y, bbox, value }, options.fields)
              }
            }
          }
        }
      })

      stream.on('end', () => {
        // Store in memory attached to result object ?
        if (!options.writeToFile) {
          _.set(hook, options.dataPath || 'result.data', json)
          resolve(hook)
        } else {
          // Otherwise store to file
          fs.outputJson(path.join(path.dirname(geotiff.filePath), path.basename(geotiff.filePath, '.tif') + '.json'), json)
          .then(_ => resolve(hook))
          .catch(error => reject(error))
        }
      })
    })
  }
}
