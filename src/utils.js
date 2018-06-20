import _ from 'lodash'
import { getItems, replaceItems } from 'feathers-hooks-common'
import makeDebug from 'debug'
import { Duplex } from 'stream'

const debug = makeDebug('krawler:utils')

// Call a given function on each hook item
export function callOnHookItems(f) {
  return async function (hook) {
    // Retrieve the items from the hook
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    if (isArray) {
      for (let i = 0; i < items.length; i++) {
        await f(items[i], hook)
      }
    } else {
      await f(items, hook)
    }
    // Replace the items within the hook
    replaceItems(hook, items)
    return hook
  }
}

// Template a string or array of strings property according to a given item
export function template(item, property) {
  const isArray = Array.isArray(property)
  let strings = (isArray ? property : [property])
  strings = strings.map(string => { 
    let compiler = _.template(string)
    // Add env into templating context
    const context = Object.assign({}, item, process)
    return compiler(context)
  })

  const result = (isArray ? strings : strings[0])
  return result
}

export function templateObject(item, object, properties) {
  return _.mapValues(object, (value, key) => (properties.includes(key) ? template(item, value) : value))
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
    .pipe(store.createWriteStream(options, error => {
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
