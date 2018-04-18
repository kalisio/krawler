import _ from 'lodash'
import sift from 'sift'
import makeDebug from 'debug'
import { Duplex } from 'stream'

const debug = makeDebug('krawler:utils')

// Add to the 'outputs' property of the given abject a new entry
export function addOutput (object, output, type) {
  // Default value
  let outputType = (type || 'intermediate')
  let outputs = _.get(object, outputType, [])
  outputs.push(output)
  _.set(object, outputType, outputs)
}

// Get the actual store object from its definition in input data based on the given property path,
// or if definition not found retrieve it directly from params
export async function getStore (storesService, params, data, storePath) {
  let path = storePath || 'store'
  debug('Seeking for store with data or params on path', path)
  // First try specific service data
  let store = _.get(data, path)
  // Store config/object given ?
  if (store) {
    if (typeof store === 'string' && storesService) {
      store = await storesService.get(store)
    }
  } else {
    // Check if store object already provided as global parameter
    store = _.get(params, path)
  }

  if (!store) {
    throw new Error('Cannot find store on data or params ', data, params)
  }

  return store
}

// Get the actual store object from its definition in input data based on the given property path
// or if definition not found retrieve directly from params
export async function getStoreFromHook (hook, hookName, storePath) {
  debug('Seeking for store in hook ' + hookName)
  try {
    return await getStore(_.get(hook, 'service.storesService'), hook.params, hook.data, storePath)
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

// Convert a data buffer to a stream piped to a target store
export function writeBufferToStore (buffer, store, options) {
  return new Promise((resolve, reject) => {
    bufferToStream(buffer)
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

