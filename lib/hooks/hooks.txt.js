import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'
import readline from 'readline'
import common from 'feathers-hooks-common'
import makeDebug from 'debug'
import { getStoreFromHook, template } from '../utils.js'

const { getItems } = common
const debug = makeDebug('krawler:hooks:txt')

// Generate a JSON from specific hook result values
export function readTXT (options = {}) {
  return async function (hook) {
    const item = getItems(hook)

    const store = await getStoreFromHook(hook, 'readTXT', options)
    if (!store.path && !store.buffers) {
      throw new Error('The \'readTXT\' hook only work with the fs or memory blob store.')
    }

    const txtName = template(item, options.key || item.id)

    let fileStream
    if (store.path) {
      debug('Reading TXT file ' + txtName)
      fileStream = await fs.createReadStream(path.join(store.path, txtName))
    } else {
      debug('Parsing TXT for ' + txtName)
      fileStream = store.buffers[txtName]
    }

    const json = []
    const reader = readline.createInterface({ input: fileStream, crlfDelay: Infinity })
    for await (const line of reader) {
      json.push(JSON.parse(JSON.stringify(line.split('\t'))))
    }

    _.set(hook, options.dataPath || 'result.data', json)
    return hook
  }
}
