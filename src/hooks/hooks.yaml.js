import path from 'path'
import _ from 'lodash'
import fs from 'fs-extra'
import yamljs from 'js-yaml'
import makeDebug from 'debug'
import { getStoreFromHook, addOutput, writeBufferToStore } from '../utils'

const debug = makeDebug('krawler:hooks:yaml')

// Generate a YAML from specific hook result values
export function writeYAML (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'writeYAML' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'writeYAML', options.storePath)

    debug('Creating YAML for ' + hook.data.id)
    let yaml = yamljs.safeDump(_.get(hook, options.dataPath || 'result.data'), options)
    let ymlName = hook.data.id + '.yaml'
    await writeBufferToStore(
      Buffer.from(yaml, 'utf8'),
      store, {
        key: ymlName,
        params: Object.assign({}, options.storageOptions) // See https://github.com/kalisio/krawler/issues/7
      }
    )
    addOutput(hook.result, ymlName, options.outputType)
    return hook
  }
}

// Generate a YAML from specific hook result values
export function readYAML (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'readYAML' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'readYAML', options.storePath)
    if (!store.path && !store.buffers) {
      throw new Error(`The 'readYAML' hook only work with the fs or memory blob store.`)
    }

    let yaml
    const yamlName = hook.result.id
    if (store.path) {
      const filePath = path.join(store.path, yamlName)
      debug('Reading YAML file ' + filePath)
      yaml = await fs.readFile(filePath)
    } else {
      debug('Parsing YAML for ' + yamlName)
      yaml = store.buffers[yamlName]
    }
    _.set(hook, options.dataPath || 'result.data', yamljs.safeLoad(yaml.toString()))
    return hook
  }
}
