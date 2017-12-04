import _ from 'lodash'
import path from 'path'
import jsonix from 'jsonix'
import makeDebug from 'debug'
import { getStoreFromHook } from '../utils'

const debug = makeDebug('krawler:hooks:ogc')

// Generate a YAML from specific hook result values
export function readOGCSchema (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'readOGCSchema' hook should only be used as a 'after' hook.`)
    }

    let store = await getStoreFromHook(hook, 'readOGCSchema', options.storePath)
    if (!store.path) {
      throw new Error(`The 'readOGCSchema' hook only work with the fs blob store.`)
    }
    const fileName = hook.data.id
    const filePath = path.join(store.path, fileName)

    return new Promise((resolve, reject) => {
      debug('Reading XML file ' + hook.data.id)

      let contextSchemas = []
      if (options.schemas) {
        options.schemas.forEach(schema => {
          contextSchemas.push(require(schema.organisation + '-schemas')[schema.name])
        })
      }
      let jsonixContext = new jsonix.Jsonix.Context(contextSchemas)
      let unmarshaller = jsonixContext.createUnmarshaller()

      unmarshaller.unmarshalFile(filePath, (result) => {
        if (result.value) {
          _.set(hook, options.dataPath || 'result.data', result.value)
          resolve(hook)
        }
        reject(new Error('readOGCSchema: Could not parse the file: ' + filePath))
      })
    })
  }
}
