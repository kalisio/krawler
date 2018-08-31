import _ from 'lodash'
import makeDebug from 'debug'
import { getStoreFromHook, callOnHookItems } from '../utils'

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
  .then(() => {
    _.unset(object, outputType)
    return object
  })
}

// Clear outputs
export function clearOutputs (options = {}) {
  async function clearItemOutputs (item, hook) {
    let store = await getStoreFromHook(hook, 'clearOutputs', options)
    await clearObjectOutputs(item, store, options.type)
  }

  return callOnHookItems(clearItemOutputs)
}

// Clear in-memory data
export function clearData (options = {}) {
  async function clearItemData (item, hook) {
    let dataPath = options.dataPath || 'data'
    if (_.get(item, dataPath)) {
      debug('Clearing data for ' + item.id + ' on path ' + dataPath)
      _.unset(item, dataPath)
    }
  }

  return callOnHookItems(clearItemData)
}
