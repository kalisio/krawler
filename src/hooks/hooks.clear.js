import _ from 'lodash'
import makeDebug from 'debug'
import { getStoreFromHook } from '../stores'

const debug = makeDebug('krawler:hooks:clear')

// Clear intermediate outputs
export function clearHooksOutputs (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'clearHooksOutputs' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'clearHooksOutputs', options.storePath)

    return new Promise((resolve, reject) => {
      let outputs = _.get(hook.result, 'outputs', [])
      if (outputs.length > 0) {
        debug('Removing output data for ' + hook.result.id + ' from store')
        outputs.forEach(output => {
          store.remove(output, error => {
            // Continue cleanup on error
            if (error) {
              console.log(error)
              // reject(error)
              // return
            }
          })
        })
      }
      resolve(hook)
    })
  }
}

// Clear output for object
export function clearOutput (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'clearOutput' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'clearOutput', options.storePath)

    if (hook.service.remove) return hook.service.remove(hook.result.id, { store })
    else return Promise.resolve(hook)
  }
}
