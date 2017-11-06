import path from 'path'
import makeDebug from 'debug'
import gtif from 'geo-pixel-stream'

const debug = makeDebug('krawler:hooks:raster')

// Compute min/max value/elevation on a zone
export function computeValues (options) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'computeValues' hook should only be used as a 'after' hook.`)
    }

    return new Promise(async (resolve, reject) => {
      // Check if store object already provided or has to be found
      let store = (hook.params.store ? hook.params.store : await hook.app.service('stores').get(hook.data.store))
      let fileName = hook.result.id
      if (!store || !store.path || (path.extname(fileName) !== '.tif')) {
        // throw new Error(`The 'computeValues' hook only work with GeoTiff files and the fs blob store.`)
        // Simply skip processing
        resolve(hook)
        return
      }
      const filePath = path.join(store.path, fileName)
      let readers = gtif.createReadStreams(filePath)
      if (!readers || readers.length === 0) {
        throw new Error(`Cannot read file ${filePath}.`)
      }
      debug('File metadata for ' + filePath + ':', readers[0].metadata)
      let maxValue = Number.NEGATIVE_INFINITY
      let minValue = Number.POSITIVE_INFINITY
      readers[0].on('data', function (data) {
        let blockLen = data.blockSize.x * data.blockSize.y
        for (let i = 0; i < blockLen; i++) {
          let value = data.buffer[i]
          if (value < minValue) minValue = value
          if (value > maxValue) maxValue = value
        }
      })

      readers[0].on('end', function () {
        // Force closing underlying GDAL dataset immediately (not waiting for GC) as it might be large
        readers[0]._src.close()
        if (options.max) hook.result.max = maxValue
        if (options.min) hook.result.min = minValue
        resolve(hook)
      })
    })
  }
}
