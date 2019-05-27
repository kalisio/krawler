import path from 'path'
import _ from 'lodash'
import fs from 'fs-extra'
import { getItems } from 'feathers-hooks-common'
import makeDebug from 'debug'
import { getStoreFromHook, addOutput, writeBufferToStore, template, transformJsonObject } from '../utils'

const debug = makeDebug('krawler:hooks:json')

// Generate a JSON from specific hook result values
export function writeJson (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'writeJson' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'writeJson', options)

    debug('Creating JSON for ' + hook.data.id)
    let json = _.get(hook, options.dataPath || 'result.data', {}) || {}
    // Allow transform before write
    if (options.transform) json = transformJsonObject(json, options.transform)
    let jsonName = template(hook.data, options.key || (hook.data.id + '.json'))
    await writeBufferToStore(
      Buffer.from(JSON.stringify(json), 'utf8'),
      store, {
        key: jsonName,
        params: options.storageOptions
      }
    )
    addOutput(hook.result, jsonName, options.outputType)
    return hook
  }
}

// Restructure a JSON from specific hook result values
export function transformJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'transformJson' hook should only be used as a 'after' hook.`)
    }

    debug('Transforming JSON for ' + hook.result.id)

    let json = _.get(hook, options.dataPath || 'result.data', {}) || {}
    json = transformJsonObject(json, options)
    // Take care that transformation allocate new objects so that if we erase the reference to the previous result
    // it will not be accessible anymore from the job, possibly causing a large memory consumption/leak (i.e. memory not freed until the end of the job).
    // Indeed a reference to the initial task list is kept in job in order to resolve the create job operation with it.
    // So in this case we simply update the properties of the result object instead of replace it.
    if (options.dataPath === 'result') {
      debug('Transforming root result in-place for ' + hook.result.id)
      const keys = Object.keys(hook.result)
      keys.forEach(key => delete hook.result[key])
      Object.assign(hook.result, json)
    } else {
      _.set(hook, options.dataPath || 'result.data', json)
    }
  }
}

// Generate a file based on a template and injected JSON from specific hook result values
export function writeTemplate (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'writeTemplate' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'writeTemplate', options)
    if (!store.path) {
      throw new Error(`The 'writeTemplate' hook only work with the fs blob store.`)
    }

    let templateStore = await getStoreFromHook(hook, 'writeTemplate', {
      store: options.templateStore,
      storePath: options.templateStorePath || 'templateStore'
    })
    if (!templateStore.path) {
      throw new Error(`The 'writeTemplate' hook only work with the fs blob store.`)
    }

    const ext = path.extname(options.templateFile)
    debug('Creating file from template ' + options.templateFile + ' for ' + hook.data.id)
    const templateFilePath = path.join(templateStore.path, options.templateFile)
    let template = await fs.readFile(templateFilePath)
    let compiler = _.template(template.toString())
    const filePath = path.join(store.path, hook.data.id + ext)
    await fs.outputFile(filePath, compiler(_.get(hook, options.dataPath || 'result.data', {}) || {}))
    addOutput(hook.result, hook.data.id + ext, options.outputType)
    return hook
  }
}

// Generate a JSON from different ones in the output store
export function mergeJson (options = {}) {
  return function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'mergeJson' hook should only be used as a 'after' hook.`)
    }

    debug('Merging JSON for ' + hook.data.id)
    // Only in-memory for now
    let objects = hook.result.map(result => _.get(result, options.dataPath || 'data', {}) || {})
    let json = _.unionBy(...objects, options.by)
    _.set(hook, options.dataPath || 'result.data', json)
    return hook
  }
}

// Read a JSON from an input stream/store
export function readJson (options = {}) {
  return async function (hook) {
    let item = getItems(hook)

    let store = await getStoreFromHook(hook, 'readJson', options)
    if (!store.path && !store.buffers) {
      throw new Error(`The 'readJson' hook only work with the fs or memory blob store.`)
    }

    let json = {}
    const jsonName = template(item, options.key || item.id)

    if (store.path) {
      const filePath = path.join(store.path, jsonName)
      debug('Reading JSON file ' + filePath)
      json = await fs.readJson(filePath)
    } else {
      debug('Parsing JSON for ' + jsonName)
      const data = store.buffers[jsonName].toString()
      json = JSON.parse(data)
      // Sometimes we get a response string containing a JSON as a string
      if (typeof json === 'string') json = JSON.parse(json)
    }
    if (options.objectPath) json = _.get(json, options.objectPath)
    // Allow transform after read
    if (options.transform) json = transformJsonObject(json, options.transform)

    _.set(hook, options.dataPath || 'result.data', json)
    return hook
  }
}
