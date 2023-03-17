import _ from 'lodash'
import stream from 'stream'
import Papa from 'papaparse'
import merge from 'merge-stream'
import common from 'feathers-hooks-common'
import makeDebug from 'debug'
import {
  getStoreFromHook, addOutput, writeBufferToStore, template, templateObject, transformJsonObject
} from '../utils.js'

const { getItems } = common
const debug = makeDebug('krawler:hooks:csv')

// Generate a CSV from specific hook result values
export function writeCSV (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'writeCSV\' hook should only be used as a \'after\' hook.')
    }

    const store = await getStoreFromHook(hook, 'writeCSV', options)

    debug('Creating CSV for ' + hook.data.id)
    let json = _.get(hook, options.dataPath || 'result')
    // Allow transform before write
    if (options.transform) {
      const templatedTransform = templateObject(hook.data, options.transform)
      json = transformJsonObject(json, templatedTransform)
    }
    const csv = Papa.unparse(json, options)
    const csvName = template(hook.data, options.key || (hook.data.id + '.csv'))
    await writeBufferToStore(
      Buffer.from(csv, 'utf8'),
      store, {
        key: csvName,
        params: options.storageOptions
      }
    )
    addOutput(hook.result, csvName, options.outputType)
    return hook
  }
}

// Generate a CSV from different ones in the output store
export function mergeCSV (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'mergeCSV\' hook should only be used as a \'after\' hook.')
    }

    const store = await getStoreFromHook(hook, 'mergeCSV', options)

    return new Promise((resolve, reject) => {
      debug('Merging CSV for ' + hook.data.id)
      const inputStreams = _.map(hook.result, result => {
        const mergedCsvName = template(result, options.mergeKey || (result.id + '.csv'))
        const stream = store.createReadStream(mergedCsvName)
        return stream.pipe(Papa.parse(Papa.NODE_STREAM_INPUT, options.parse))
      })

      const csvName = template(hook.data, options.key || (hook.data.id + '.csv'))
      const unparseOptions = _.get(options, 'unparse')
      const hasHeader = _.get(unparseOptions, 'header', true)
      let headerWritten = false
      merge.apply(null, inputStreams)
        .pipe(new stream.Transform({
          writableObjectMode: true,
          transform (chunk, encoding, callback) {
            if (hasHeader) {
              // Avoid repeating header
              if (headerWritten) unparseOptions.header = false
              else headerWritten = true
            }
            const csv = Papa.unparse([chunk], unparseOptions) + '\n'
            callback(null, csv)
          }
        }))
        .pipe(store.createWriteStream(csvName))
        .on('finish', () => {
          addOutput(hook.result, csvName, options.outputType)
          resolve(hook)
        })
        .on('error', reject)
    })
  }
}

// Read a CSV from an input stream/store and convert to JSON values
export function readCSV (options = {}) {
  return async function (hook) {
    const item = getItems(hook)

    const store = await getStoreFromHook(hook, 'readCSV', options)
    const csvName = template(item, options.key || item.id)

    return new Promise((resolve, reject) => {
      debug('Reading CSV for ' + item.id)
      const stream = item.stream ? item.stream : store.createReadStream(csvName)
      // Clear previous data if any as we append
      const jsonPath = options.dataPath || 'result.data'
      _.unset(hook, jsonPath)
      stream
        .pipe(Papa.parse(Papa.NODE_STREAM_INPUT, options))
        .on('data', data => {
          const json = _.get(hook, jsonPath, [])
          json.push(data)
          _.set(hook, jsonPath, json)
        })
        .on('end', () => {
          // Allow transform after read
          if (options.transform) {
            let json = _.get(hook, jsonPath, [])
            const templatedTransform = templateObject(item, options.transform)
            json = transformJsonObject(json, templatedTransform)
            _.set(hook, jsonPath, json)
          }
          resolve(hook)
        })
        .on('error', reject)
    })
  }
}
