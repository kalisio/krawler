import _ from 'lodash'
import fs from './stores.fs'
import s3 from './stores.s3'

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

export default {
  fs,
  s3
}
