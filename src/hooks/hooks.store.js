import _ from 'lodash'
import makeDebug from 'debug'
import { getStoreFromHook, writeStreamToStore, callOnHookItems, templateObject } from '../utils'

const debug = makeDebug('krawler:hooks:store')

// Create a new (set of) store(s)
export function createStores (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'createStore' hook should only be used as a 'before' hook.`)
    }

    // Transform to array
    const faultTolerant = options.faultTolerant
    let stores = []
    if (!Array.isArray(options)) {
      if (options.stores) stores = options.stores
      else stores = [options]
    } else {
      stores = options
    }

    for (let i = 0; i < stores.length; i++) {
      const storeOptions = stores[i]
      debug('Looking for store ' + storeOptions.id)
      let store
      try {
        // Check if store does not already exist
        store = await hook.service.storesService.get(storeOptions.id)
        if (storeOptions.storePath) _.set(hook.data, storeOptions.storePath, store)
        debug('Found existing store ' + storeOptions.id)
      } catch (error) {
        debug('Creating store for ' + hook.data.id + ' with options ', storeOptions)
        try {
          store = await hook.service.storesService.create(storeOptions)
          if (storeOptions.storePath) _.set(hook.data, storeOptions.storePath, store)
        } catch (error) {
          if (faultTolerant) {
            debug('Could not create store for ' + hook.data.id)
            console.log(error)
          } else {
            throw error
          }
        }
      }
    }

    return hook
  }
}

// Remove an existing (set of) store(s)
export function removeStores (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'removeStore' hook should only be used as a 'after' hook.`)
    }

    // Transform to array
    let stores = []
    if (!Array.isArray(options)) {
      if (options.stores) options = options.stores
      else stores = [options]
    } else {
      stores = options
    }

    for (let i = 0; i < stores.length; i++) {
      const storeOptions = stores[i]
      const id = (typeof storeOptions === 'string' ? storeOptions : storeOptions.id)
      debug('Removing store ' + id + ' for ' + hook.data.id)
      await hook.service.storesService.remove(id)
      if (storeOptions.storePath) _.unset(hook.data, storeOptions.storePath)
    }

    return hook
  }
}

export function copyToStore (options = {}) {
  async function copy (item, hook) {
    // Output store config given in options
    const outputOptions = templateObject(item, options.output, ['key'])
    let outStore = await hook.service.storesService.get(outputOptions.store)
    const inputOptions = templateObject(item, options.input, ['key'])
    let inStore = await getStoreFromHook(hook, 'copyToStore', inputOptions)
    await writeStreamToStore(inStore.createReadStream(inputOptions), outStore, outputOptions)
  }

  return callOnHookItems(copy)
}
