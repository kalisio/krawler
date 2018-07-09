import _ from 'lodash'
import { getItems, replaceItems } from 'feathers-hooks-common'
import makeDebug from 'debug'
import { Duplex } from 'stream'

const debug = makeDebug('krawler:utils')

// Call a given function on each hook item
export function callOnHookItems (f) {
  return async function (hook) {
    let hookObject = hook
    // Handle error hooks as usual
    if (hook.type === 'error') hookObject = hook.original
    // Retrieve the items from the hook
    let items = getItems(hookObject)
    const isArray = Array.isArray(items)
    if (isArray) {
      for (let i = 0; i < items.length; i++) {
        // Handle error hooks as usual
        if (hook.type === 'error') items[i].error = _.omit(hook.error, ['hook']) // Avoid circular reference
        await f(items[i], hookObject)
      }
    } else {
      // Handle error hooks as usual
      if (hook.type === 'error') items.error = _.omit(hook.error, ['hook']) // Avoid circular reference
      await f(items, hookObject)
    }
    // Replace the items within the hook
    replaceItems(hookObject, items)
    return hookObject
  }
}

// Template a string or array of strings property according to a given item
export function template (item, property) {
  const isArray = Array.isArray(property)
  // Recurse
  if (!isArray && (typeof property === 'object')) return templateObject(item, property)
  let values = (isArray ? property : [property])
  values = values.map(value => {
    if (typeof value === 'string') {
      let compiler = _.template(value)
      // Add env into templating context
      const context = Object.assign({}, item, process)
      return compiler(context)
    } else {
      return value
    }
  })

  const result = (isArray ? values : values[0])
  return result
}

export function templateObject (item, object, properties) {
  // Restrict to some properties only ?
  if (properties) return _.mapValues(object, (value, key) => (properties.includes(key) ? template(item, value) : value))
  else return _.mapValues(object, (value, key) => template(item, value))
}

// Add to the 'outputs' property of the given abject a new entry
export function addOutput (object, output, type) {
  // Default value
  let outputType = (type || 'intermediate')
  let outputs = _.get(object, outputType, [])
  outputs.push(output)
  _.set(object, outputType, outputs)
}

// Get the actual store object from its definition in input data based on the given name or property path,
// or if definition not found retrieve it directly from params
export async function getStore (storesService, params, data, storePathOrName) {
  let path = storePathOrName || 'store'
  debug('Seeking for store in service, data or params with path/name ' + path)
  // First try store as specified in input data
  let store = _.get(data, path)
  if (store) {
    // Store object or only ID given ?
    if (typeof store === 'string' && storesService) {
      store = await storesService.get(store)
    }
  } else {
    // Check if store object already provided as global parameter on params
    store = _.get(params, path)
  }

  // Try to directly access it by name from service
  if (!store) {
    if (storesService) {
      store = await storesService.get(path)
    } else {
      throw new Error('Cannot find store on data or params ', data, params)
    }
  }

  return store
}

// Get the actual store object from its definition in input data based on the given name or property path
// or if definition not found retrieve directly from params
export async function getStoreFromHook (hook, hookName, options = {}) {
  debug('Seeking for store in hook ' + hookName)
  try {
    return await getStore(_.get(hook, 'service.storesService'), hook.params, hook.data, options.store || options.storePath)
  } catch (error) {
    throw new Error(`Cannot find store for hook ${hookName}.`)
  }
}

// Convert a data buffer to a stream
export function bufferToStream (buffer) {
  let stream = new Duplex()
  stream.push(buffer)
  stream.push(null)
  return stream
}

// Pipe a stream to a target store
export function writeStreamToStore (stream, store, options) {
  return new Promise((resolve, reject) => {
    stream
    .on('error', reject)
    // See https://github.com/kalisio/krawler/issues/7
    .pipe(store.createWriteStream(_.cloneDeep(options), error => {
      if (error) reject(error)
    }))
    .on('finish', () => {
      resolve()
    })
    .on('error', reject)
  })
}

// Convert a data buffer to a stream piped to a target store
export function writeBufferToStore (buffer, store, options) {
  return writeStreamToStore(bufferToStream(buffer), store, options)
}
