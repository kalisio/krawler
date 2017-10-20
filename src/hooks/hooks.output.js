import json2csv from 'json2csv'
import fs from 'fs-extra'
import path from 'path'
import makeDebug from 'debug'
import * as stores from '../stores'

const debug = makeDebug('krawler:hooks:output')

// Generate a CSV from grid task and specific task values
export function generateGridCSV (hook) {
  if (hook.type !== 'after') {
    throw new Error(`The 'generateGridCSV' hook should only be used as a 'after' hook.`)
  }
  let store = stores.getStore(hook.data.taskTemplate.store)
  if (!store || !store.path) {
    throw new Error(`The 'generateGridCSV' hook only work with the fs blob store.`)
  }

  const fields = [
    {
      label: 'Latmin',
      value: (row, field, data) => {
        return row.bbox[1]
      }
    },
    {
      label: 'Lonmin',
      value: (row, field, data) => {
        return row.bbox[0]
      }
    },
    {
      label: 'Latmax',
      value: (row, field, data) => {
        return row.bbox[3]
      }
    },
    {
      label: 'Lonmax',
      value: (row, field, data) => {
        return row.bbox[2]
      }
    },
    {
      label: 'Elev',
      value: 'max'
    }
  ]
  debug('Creating CSV for job')
  let csv = json2csv({ data: hook.result, fields })
  let filePath = path.join(store.path, 'output.csv')
  debug('Exporting CSV to ' + filePath)
  return fs.outputFile(filePath, csv)
  .then(() => hook)
}
