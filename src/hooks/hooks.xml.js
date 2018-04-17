import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'
import xml2js from 'xml2js'
import makeDebug from 'debug'
import { getStoreFromHook } from '../utils'

const debug = makeDebug('krawler:hooks:xml')

// Generate a YAML from specific hook result values
export function readXML (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'readXML' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'readXML', options.storePath)
    if (!store.path && !store.buffers) {
      throw new Error(`The 'readXML' hook only work with the fs or memory blob store.`)
    }

    let xml
    const xmlName = hook.result.id
    if (store.path) {
      const filePath = path.join(store.path, xmlName)
      debug('Reading XML file ' + filePath)
      xml = await fs.readFile(filePath)
    } else {
      debug('Parsing XML for ' + xmlName)
      xml = store.buffers[xmlName]
    }
    let parser = new xml2js.Parser({explicitArray: false})
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
