import chai from 'chai'
import chailint from 'chai-lint'
import path, { dirname } from 'path'
import fsStore from 'fs-blob-store'
import fs from 'fs'
import { hooks as pluginHooks } from '../lib/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

function checkJson (hook) {
  // We know we have a max value at 73.44 in this file
  expect(hook.result.data).toExist()
  let maxPixel, maxIndex
  let index = 0
  hook.result.data.forEach(pixel => {
    if (pixel.value > 73) {
      maxPixel = pixel
      maxIndex = index
    }
    index++
  })
  expect(maxPixel).toExist()
  // This point [139.736316,35.630105] should be in pixel
  expect(maxPixel.bbox[0] < 139.736316).to.beTrue()
  expect(maxPixel.bbox[2] > 139.736316).to.beTrue()
  expect(maxPixel.bbox[1] < 35.630105).to.beTrue()
  expect(maxPixel.bbox[3] > 35.630105).to.beTrue()
  // It is located at [96, 16]
  expect(Math.floor(maxIndex / 300)).to.equal(16)
  expect(maxIndex % 300).to.equal(96)
}

describe('krawler:hooks:csv', () => {
  const inputStore = fsStore({ path: path.join(__dirname, 'data') })
  const outputStore = fsStore({ path: path.join(__dirname, 'output') })

  before(async () => {
    chailint(chai, util)
  })

  const csvHook = {
    type: 'after',
    data: {
      id: 'RJTT-30-18000-2-1.csv'
    },
    result: {
      id: 'RJTT-30-18000-2-1.csv'
    },
    params: { store: inputStore }
  }

  it('converts CSV to JSON', () => {
    return pluginHooks.readCSV({ header: true })(csvHook)
      .then(hook => {
        pluginHooks.transformJson({
          mapping: {
            Lonmin: 'bbox[0]',
            Latmin: 'bbox[1]',
            Lonmax: 'bbox[2]',
            Latmax: 'bbox[3]',
            Elev: 'value'
          }
        })(hook)
        checkJson(hook)
      })
  })
  // Let enough time to proceed
    .timeout(5000)

  it('converts JSON to CSV', () => {
    return pluginHooks.readCSV({ header: true })(csvHook)
      .then(hook => {
      // Switch to output store
        csvHook.params.store = outputStore
        return pluginHooks.writeCSV()(csvHook)
      })
      .then(hook => {
        expect(fs.existsSync(path.join(outputStore.path, csvHook.result.id + '.csv'))).beTrue()
      })
  })
  // Let enough time to proceed
    .timeout(5000)

  const mergeCsvHook = {
    type: 'after',
    data: {
      id: 'RJTT-30-18000-2-1-merged'
    },
    result: [
      { id: 'RJTT-30-18000-2-1-part1' },
      { id: 'RJTT-30-18000-2-1-part2' },
      { id: 'RJTT-30-18000-2-1-part3' }
    ],
    params: { store: outputStore }
  }

  it('Merges CSV', () => {
    mergeCsvHook.result.forEach(result => {
      fs.copyFileSync(path.join(inputStore.path, result.id + '.csv'), path.join(outputStore.path, result.id + '.csv'))
    })
    return pluginHooks.mergeCSV({ parse: { header: true }, unparse: { header: true } })(mergeCsvHook)
      .then(hook => {
        expect(fs.existsSync(path.join(outputStore.path, csvHook.result.id + '.csv'))).beTrue()
      })
  })
  // Let enough time to proceed
    .timeout(60000)
})
