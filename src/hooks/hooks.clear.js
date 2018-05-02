import _ from 'lodash'
import makeDebug from 'debug'
import { getStoreFromHook } from '../utils'

const debug = makeDebug('krawler:hooks:clear')

function clearObjectOutputs (object, store, type) {
  // Default value
  let outputType = (type || 'intermediate')
  let outputs = _.get(object, outputType, [])
  // Clear all outputs found
  return Promise.all(outputs.map(output => new Promise((resolve, reject) => {
    store.remove(output, error => {
      if (error) {
        debug('Cannot remove output data ' + output + ' for ' + object.id + ' from store')
        // Continue cleanup on error, does not stop
        // reject(error)
        console.log(error)
        resolve()
      } else {
        debug('Removing output data ' + output + ' for ' + object.id + ' from store')
        resolve()
      }
    })
  })))
  .then(() => object)
}

// Clear outputs
export function clearOutputs (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'clearOutputs' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'clearOutputs', options)
    if (Array.isArray(hook.result)) {
      await Promise.all(hook.result.map(result => clearObjectOutputs(result, store, options.type)))
    } else {
      await clearObjectOutputs(hook.result, store, options.type)
    }

    return hook
  }
}

// Clear in-memory data
export function clearData (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'clearData' hook should only be used as a 'after' hook.`)
    }

    let dataPath = options.dataPath || 'result.data'
    if (_.get(hook, dataPath)) {
      debug('Clearing data for ' + hook.data.id + ' on path ' + dataPath)
      _.unset(hook, dataPath)
    }
    return hook
  }
}
