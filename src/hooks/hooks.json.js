import path from 'path'
import _ from 'lodash'
import fs from 'fs-extra'
import makeDebug from 'debug'
import { getStoreFromHook } from '../stores'

const debug = makeDebug('krawler:hooks:json')

// Generate a JSON from specific hook result values
export function writeJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'writeJson' hook should only be used as a 'after' hook.`)
    }

    return new Promise(async (resolve, reject) => {
      let store
      try {
        store = await getStoreFromHook(hook, 'writeJson', options.storePath)
      } catch (error) {
        reject(error)
        return
      }

      debug('Creating JSON for ' + hook.data.id)
      const filePath = path.join(store.path, hook.data.id + '.json')
      fs.outputJson(filePath, _.get(hook, options.dataPath || 'result.data', {}))
      .then(_ => resolve(hook))
      .catch(reject)
    })
  }
}

// Restructure a JSON from specific hook result values
export function transformJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'transformJson' hook should only be used as a 'after' hook.`)
    }

    debug('Transforming JSON for ' + hook.result.id)

    let json = _.get(hook, options.dataPath || 'result.data', {})
    // Iterate over path mapping
    _.forOwn(options.mapping, (outputPath, inputPath) => {
      // Then iterate over JSON objects
      _.forEach(json, object => {
        // Perform mapping
        _.set(object, outputPath, _.get(object, inputPath))
      })
      // Now we can erase old date
      _.forEach(json, object => {
        _.unset(object, inputPath)
      })
    })
    // Then update JSON in place in memory
    _.set(hook, options.dataPath || 'result.data', json)
  }
}
