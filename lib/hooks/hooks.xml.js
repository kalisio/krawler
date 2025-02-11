import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'
import xml2js from 'xml2js'
import common from 'feathers-hooks-common'
import makeDebug from 'debug'
import { getStoreFromHook, addOutput, writeBufferToStore, template } from '../utils.js'

const { getItems } = common
const debug = makeDebug('krawler:hooks:xml')

export function readXML (options = {}) {
  return async function (hook) {
    const item = getItems(hook)

    const store = await getStoreFromHook(hook, 'readXML', options)
    if (!store.path && !store.buffers) {
      throw new Error('The \'readXML\' hook only work with the fs or memory blob store.')
    }

    let xml
    const xmlName = template(item, options.key || item.id)
    if (store.path) {
      const filePath = path.join(store.path, xmlName)
      debug('Reading XML file ' + filePath)
      xml = await fs.readFile(filePath)
    } else {
      debug('Parsing XML for ' + xmlName)
      xml = store.buffers[xmlName]
    }
    const parser = new xml2js.Parser(options.parser)
    return new Promise((resolve, reject) => {
      parser.parseString(xml.toString(), (err, result) => {
        if (err) {
          reject(err)
          return
        }
        _.set(hook, options.dataPath || 'result.data', result)
        resolve(hook)
      })
    })
  }
}

export function writeXML (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'writeXML\' hook should only be used as a \'after\' hook.')
    }

    const store = await getStoreFromHook(hook, 'writeXML', options)

    debug('Creating XML for ' + hook.data.id)
    const builder = new xml2js.Builder(options)
    const xml = builder.buildObject(_.get(hook, options.dataPath || 'result.data'))
    const xmlName = template(hook.data, options.key || (hook.data.id + '.xml'))
    await writeBufferToStore(
      Buffer.from(xml, 'utf8'),
      store, {
        key: xmlName,
        params: options.storageOptions
      }
    )
    addOutput(hook.result, xmlName, options.outputType)
    return hook
  }
}
