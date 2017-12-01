import _ from 'lodash'

// Add to the 'outputs' property of the given abject a new entry
export function addOutput (object, output, type) {
  // Default value
  let outputType = (type || 'intermediate')
  let outputs = _.get(object, outputType, [])
  outputs.push(output)
  _.set(object, outputType, outputs)
}

// Get the actual store object from its definition in input data based on the given property path
// or if definition not found retrieve directly from params
export async function getStoreFromHook (hook, hookName, storePath) {
  // First try specific hook data
  let store = _.get(hook, storePath || 'data.store')
  if (store) {
    store = await hook.service.storesService.get(typeof store === 'object' ? store.id : store)
  } else {
    // Check if store object already provided as global parameter
    store = hook.params.store
  }
  if (!store) {
    throw new Error(`Cannot find store for hook ${hookName}.`)
  }

  return store
}

// Get the actual store object from its definition in input data based on the given property path,
// will create it if it does not yet exist
// or if definition not found retrieve directly from params
export async function getStoreFromService (storesService, params, data, storePath) {
  // First try specific service data
  let store = _.get(data, storePath || 'store')
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
