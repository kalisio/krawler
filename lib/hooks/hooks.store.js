import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import unzipper from 'unzipper'
import makeDebug from 'debug'
import { addOutput, getStoreFromHook, writeStreamToStore, callOnHookItems, templateObject } from '../utils.js'

const { Extract } = unzipper
const debug = makeDebug('krawler:hooks:store')

// Create a new (set of) store(s)
export function createStores (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'createStore\' hook should only be used as a \'before\' hook.')
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
          // Ensure the path exists when the store is of type of fs
          const fsPath = _.get(storeOptions, 'options.path')
          if (fsPath && !fs.existsSync(fsPath)) fs.mkdirSync(fsPath, { recursive: true })
        } catch (error) {
          if (faultTolerant) {
            debug('Could not create store for ' + hook.data.id)
            console.error(error)
          } else {
            throw error
          }
        }
      }
    }

    return hook
  }
}

// Alias
export const createStore = createStores

// Remove an existing (set of) store(s)
export function removeStores (options = {}) {
  return async function (hook) {
    if ((hook.type !== 'after') && (hook.type !== 'error')) {
      throw new Error('The \'removeStore\' hook should only be used as a \'after/error\' hook.')
    }

    // Transform to array
    const faultTolerant = options.faultTolerant
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
      try {
        await hook.service.storesService.remove(id)
        if (storeOptions.storePath) _.unset(hook.data, storeOptions.storePath)
      } catch (error) {
        if (faultTolerant) {
          debug('Could not remove store for ' + hook.data.id)
          console.error(error)
        } else {
          throw error
        }
      }
    }

    return hook
  }
}

// Alias
export const removeStore = removeStores

export function copyToStore (options = {}) {
  async function copy (item, hook) {
    // Output store config given in options
    const outputOptions = templateObject(item, options.output, ['key'])
    const outStore = await hook.service.storesService.get(outputOptions.store)
    const inputOptions = templateObject(item, options.input, ['key'])
    const inStore = await getStoreFromHook(hook, 'copyToStore', inputOptions)
    debug('Copying to store', inputOptions, outputOptions)
    await writeStreamToStore(inStore.createReadStream(inputOptions), outStore, outputOptions)
    addOutput(item, outputOptions.key, outputOptions.outputType)
  }

  return callOnHookItems(options)(copy)
}

export function gzipToStore (options = {}) {
  async function gzip (item, hook) {
    // Output store config given in options
    const outputOptions = templateObject(item, options.output, ['key'])
    const outStore = await hook.service.storesService.get(outputOptions.store)
    const inputOptions = templateObject(item, options.input, ['key'])
    const inStore = await getStoreFromHook(hook, 'gzipToStore', inputOptions)
    debug('Gzipping to store', inputOptions, outputOptions)
    await writeStreamToStore(inStore.createReadStream(inputOptions).pipe(zlib.createGzip(options)), outStore, outputOptions)
    addOutput(item, outputOptions.key, outputOptions.outputType)
  }

  return callOnHookItems(options)(gzip)
}

export function gunzipFromStore (options = {}) {
  async function gunzip (item, hook) {
    // Output store config given in options
    const outputOptions = templateObject(item, options.output, ['key'])
    const outStore = await hook.service.storesService.get(outputOptions.store)
    const inputOptions = templateObject(item, options.input, ['key'])
    const inStore = await getStoreFromHook(hook, 'gunzipFromStore', inputOptions)
    debug('Gunzipping from store', inputOptions, outputOptions)
    await writeStreamToStore(inStore.createReadStream(inputOptions).pipe(zlib.createGunzip(options)), outStore, outputOptions)
    addOutput(item, outputOptions.key, outputOptions.outputType)
  }

  return callOnHookItems(options)(gunzip)
}

export function unzipFromStore (options = {}) {
  async function unzip (item, hook) {
    // Output store config given in options
    const outputOptions = templateObject(item, options.output, ['path'])
    const outStore = await hook.service.storesService.get(outputOptions.store)
    const inputOptions = templateObject(item, options.input, ['key'])
    const inStore = await getStoreFromHook(hook, 'unzipFromStore', inputOptions)
    debug('Unzipping from store', inputOptions, outputOptions)
    if (!outStore.path) {
      throw new Error('The \'unzipFromStore\' hook only work with the fs blob store as output.')
    }
    const outputPath = path.join(outStore.path, outputOptions.path || '')
    await new Promise((resolve, reject) => {
      inStore.createReadStream(inputOptions)
        .pipe(Extract({ path: outputPath }))
        .on('close', () => resolve())
        .on('error', (error) => reject(error))
    })
    // FIXME: add zip entries as output
    // addOutput(item, outputOptions.key, outputOptions.outputType)
  }

  return callOnHookItems(options)(unzip)
}

export function discardIfExistsInStore (options = {}) {
  async function discard (item, hook) {
    // Output store config given in options
    const outputOptions = templateObject(item, options.output, ['key'])
    const outStore = await hook.service.storesService.get(outputOptions.store)
    return new Promise((resolve, reject) => {
      outStore.exists(outputOptions.key, (err, exists) => {
        if (err) {
          reject(err)
        } else {
          if (exists) {
            debug('Discarding ' + item.id + ' as it already exists in store', outputOptions)
            item.skip = true
          }
          resolve(hook)
        }
      })
    })
  }

  return callOnHookItems(options)(discard)
}
