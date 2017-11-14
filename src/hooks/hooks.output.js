import json2csv from 'json2csv'
import fastcsv from 'fast-csv'
import merge from 'merge-stream'
import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import makeDebug from 'debug'

const debug = makeDebug('krawler:hooks:output')

async function getStore (hook, hookName) {
  // Check if store object already provided or has to be found
  let store = (hook.params.store ? hook.params.store : await hook.app.service('stores').get(typeof hook.data.store === 'object' ? hook.data.store.id : hook.data.store))
  if (!store || !store.path) {
    throw new Error(`The ${hookName} hook only work with the fs blob store.`)
  }

  return store
}

// Generate a CSV from tasks and specific task values
export function generateCSV (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'generateCSV' hook should only be used as a 'after' hook.`)
    }

    return new Promise(async (resolve, reject) => {
      let store
      try {
        store = await getStore(hook, 'generateCSV')
      } catch (error) {
        reject(error)
        return
      }

      debug('Creating CSV for ' + hook.data.id)
      let csv = json2csv({ data: _.get(hook, options.dataPath || 'result'), fields: options.fields })
      let filePath = path.join(store.path, hook.data.id + '.csv')
      debug('Exporting CSV to ' + filePath)
      fs.outputFile(filePath, csv)
      .then(() => resolve(hook))
      .catch(reject)
    })
  }
}

// Generate a CSV from different ones
export function mergeCSV (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'mergeCSV' hook should only be used as a 'after' hook.`)
    }

    return new Promise(async (resolve, reject) => {
      let store
      try {
        store = await getStore(hook, 'mergeCSV')
      } catch (error) {
        reject(error)
        return
      }

      debug('Merging CSV for ' + hook.data.id)
      let inputStreams = hook.result.map(result => {
        let stream = fs.createReadStream(path.join(store.path, result.id + '.csv'))
        return fastcsv.fromStream(stream, options)
      })

      let filePath = path.join(store.path, hook.data.id + '.csv')
      merge.apply(null, inputStreams)
      .pipe(fastcsv.createWriteStream(options))
      .pipe(fs.createWriteStream(filePath))
      .on('finish', () => resolve(hook))
      .on('error', reject)
    })
  }
}
