import path from 'path'
import fs from 'fs-extra'
import makeDebug from 'debug'
import gtif from 'geo-pixel-stream'

const debug = makeDebug('krawler:hooks:raster')

async function getStream (hook, hookName) {
  // Check if store object already provided or has to be found
  let store = (hook.params.store ? hook.params.store : await hook.app.service('stores').get(hook.data.store))
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

  debug('File metadata for ' + filePath + ':', stream.metadata)

  return { store, filePath, stream, dataset: stream._src, band: stream._band }
}

// Compute min/max value/elevation on a zone
export function computeStatistics (options) {
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
      let maxValue = Number.NEGATIVE_INFINITY
      let minValue = Number.POSITIVE_INFINITY
      geotiff.stream.on('data', (data) => {
        let blockLen = data.blockSize.x * data.blockSize.y
        for (let i = 0; i < blockLen; i++) {
          let value = data.buffer[i]
          if (value < minValue) minValue = value
          if (value > maxValue) maxValue = value
        }
      })

      geotiff.stream.on('end', () => {
        if (options.max) hook.result.max = maxValue
        if (options.min) hook.result.min = minValue
        resolve(hook)
      })
    })
  }
}

// Convert GeoTiff to JSON
export function geotiff2json (options) {
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
      let json = new Array(geotiff.stream.metadata.width * geotiff.stream.metadata.height)
      json.fill(geotiff.band.noDataValue || 0)
      geotiff.stream.on('data', (data) => {
        let x = data.offset.x * data.blockSize.x
        let y = data.offset.y * data.blockSize.y
        for (let i = 0; i < data.blockSize.x; i++) {
          for (let j = 0; j < data.blockSize.y; j++) {
            let value = data.buffer[i * data.blockSize.y + j]
            json[(x + i) * geotiff.stream.metadata.width + (y + j)] = value
          }
        }
      })

      geotiff.stream.on('end', () => {
        fs.outputJson(path.join(path.dirname(geotiff.filePath), path.basename(geotiff.filePath, '.tif') + '.json'), json)
        .then(_ => resolve(hook))
        .catch(error => reject(error))
      })
    })
  }
}
