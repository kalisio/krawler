import json2csv from 'json2csv'
import fastcsv from 'fast-csv'
import merge from 'merge-stream'
import _ from 'lodash'
import { getItems } from 'feathers-hooks-common'
import makeDebug from 'debug'
import { getStoreFromHook, addOutput, writeBufferToStore, template } from '../utils'

const debug = makeDebug('krawler:hooks:csv')

// Generate a CSV from specific hook result values
export function writeCSV (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'writeCSV' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'writeCSV', options)

    debug('Creating CSV for ' + hook.data.id)
    const data = _.get(hook, options.dataPath || 'result')
    let csv = json2csv({ data, fields: options.fields })
    let csvName = template(hook.data, options.key || (hook.data.id + '.csv'))
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
      throw new Error(`The 'mergeCSV' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'mergeCSV', options)

    return new Promise((resolve, reject) => {
      debug('Merging CSV for ' + hook.data.id)
      let inputStreams = hook.result.map(result => {
        const mergedCsvName = template(result, options.mergeKey || (result.id + '.csv'))
        let stream = store.createReadStream(mergedCsvName)
        return fastcsv.fromStream(stream, options)
      })

      let csvName = template(hook.data, options.key || (hook.data.id + '.csv'))
      merge.apply(null, inputStreams)
      .pipe(fastcsv.createWriteStream(options))
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
    let item = getItems(hook)

    let store = await getStoreFromHook(hook, 'readCSV', options)
    const csvName = template(item, options.key || item.id)

    return new Promise((resolve, reject) => {
      debug('Reading CSV for ' + item.id)
      let stream = item.stream ? item.stream : store.createReadStream(csvName)
      // Clear previous data if any as we append
      const jsonPath = options.dataPath || 'result.data'
      _.unset(hook, jsonPath)
      fastcsv.fromStream(stream, options)
      .on('data', data => {
        let json = _.get(hook, jsonPath, [])
        json.push(data)
        _.set(hook, jsonPath, json)
      })
      .on('end', () => resolve(hook))
      .on('error', reject)
    })
  }
}
