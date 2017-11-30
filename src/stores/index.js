import _ from 'lodash'
import fs from './stores.fs'

export async function getStoreFromHook (hook, hookName, storePath) {
  // First try specific hook data
  let store = _.get(hook, storePath || 'data.store')
  if (store) {
    store = await hook.app.service('stores').get(typeof store === 'object' ? store.id : store)
  } else {
    // Check if store object already provided as global parameter
    store = hook.params.store
  }
  if (!store) {
    throw new Error(`Cannot find store for hook ${hookName}.`)
  }
  if (!store.path) {
    throw new Error(`The ${hookName} hook only work with the fs blob store.`)
  }

  return store
}

export async function getStoreFromService (storesService, params, data) {
  // First try specific service data
  let { store } = data
  // Store config given
  if (store) {
    try {
      // Check if store does not already exist
      store = await storesService.get(typeof store === 'object' ? store.id : store)
    } catch (error) {
      // If not create it the first time
      store = await storesService.create(store)
    }
  } else {
    // Check if store object already provided as global parameter
    store = params.store
  }

  return store
}

export default {
  fs
}
