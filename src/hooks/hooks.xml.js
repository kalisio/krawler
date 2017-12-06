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
    if (!store.path) {
      throw new Error(`The 'readXML' hook only work with the fs blob store.`)
    }
    const fileName = hook.result.id
    const filePath = path.join(store.path, fileName)

    debug('Reading XML file ' + filePath)
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err)
        }
        let parser = new xml2js.Parser()
        parser.parseString(data, (err, result) => {
          if (err) {
            reject(err)
          }
          _.set(hook, options.dataPath || 'result.data', result)
          resolve(hook)
        })
      })
    })
  }
}
