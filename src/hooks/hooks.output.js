import json2csv from 'json2csv'
import fs from 'fs-extra'
import path from 'path'
import makeDebug from 'debug'

const debug = makeDebug('krawler:hooks:output')

// Generate a CSV from tasks and specific task values
export function generateCSV (fields) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'generateCSV' hook should only be used as a 'after' hook.`)
    }
    let store = await hook.app.service('stores').get(hook.data.taskTemplate.store)
    if (!store || !store.path) {
      throw new Error(`The 'generateCSV' hook only work with the fs blob store.`)
    }

    debug('Creating CSV for job')
    let csv = json2csv({ data: hook.result, fields })
    let filePath = path.join(store.path, 'output.csv')
    debug('Exporting CSV to ' + filePath)
    return fs.outputFile(filePath, csv)
    .then(() => hook)
  }
}
