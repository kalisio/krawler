import chai from 'chai'
import chailint from 'chai-lint'
import _ from 'lodash'
import fsStore from 'fs-blob-store'
import path, { dirname } from 'path'
import { hooks as pluginHooks } from '../lib/index.js'
import { fileURLToPath } from 'url'

const { util, expect } = chai
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('krawler:hooks:txt', () => {
  
  const inputStore = fsStore({ path: path.join(__dirname, 'data') })
  
  const txtHook = {
    type: 'after',
    result: { id: 'lines.txt' },
    params: {'store': inputStore }
  }

  before(() => {
    chailint(chai, util)
  })

  it('convert TXT to JSON', async () => {
    await pluginHooks.readTXT({})(txtHook)
    console.log(txtHook.result.data)
    expect(txtHook.result.data.length).to.equal(8)
    txtHook.result.data.forEach(line => {
      expect(line.length).to.equal(10)
    })
  })

  // Let enough time to proceed
    .timeout(5000)
})
