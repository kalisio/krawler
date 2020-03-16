import path from 'path'
import _ from 'lodash'
import fs from 'fs-extra'
import yamljs from 'js-yaml'
import { getItems } from 'feathers-hooks-common'
import makeDebug from 'debug'
import { getStoreFromHook, addOutput, writeBufferToStore, template, templateObject, transformJsonObject } from '../utils'

const debug = makeDebug('krawler:hooks:yaml')

// Generate a YAML from specific hook result values
export function writeYAML (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'writeYAML\' hook should only be used as a \'after\' hook.')
    }

    const store = await getStoreFromHook(hook, 'writeYAML', options)

    debug('Creating YAML for ' + hook.data.id)
    const yaml = yamljs.safeDump(_.get(hook, options.dataPath || 'result.data'), options)
    const ymlName = template(hook.data, options.key || (hook.data.id + '.yaml'))
    await writeBufferToStore(
      Buffer.from(yaml, 'utf8'),
      store, {
        key: ymlName,
        params: options.storageOptions
      }
    )
    addOutput(hook.result, ymlName, options.outputType)
    return hook
  }
}

// Generate a YAML from specific hook result values
export function readYAML (options = {}) {
  return async function (hook) {
    const item = getItems(hook)

    const store = await getStoreFromHook(hook, 'readYAML', options)
    if (!store.path && !store.buffers) {
      throw new Error('The \'readYAML\' hook only work with the fs or memory blob store.')
    }

    let yaml
    const yamlName = template(item, options.key || item.id)
    if (store.path) {
      const filePath = path.join(store.path, yamlName)
      debug('Reading YAML file ' + filePath)
      yaml = await fs.readFile(filePath)
    } else {
      debug('Parsing YAML for ' + yamlName)
      yaml = store.buffers[yamlName]
    }
    // Clear previous data if any as we append
    const jsonPath = options.dataPath || 'result.data'
    _.unset(hook, jsonPath)
    let json = yamljs.safeLoad(yaml.toString())
    if (options.objectPath) json = _.get(json, options.objectPath)
    // Allow transform after read
    if (options.transform) {
      const templatedTransform = templateObject(item, options.transform)
      json = transformJsonObject(json, templatedTransform)
    }
    _.set(hook, jsonPath, json)
    return hook
  }
}
