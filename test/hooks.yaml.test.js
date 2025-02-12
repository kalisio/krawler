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

describe('krawler:hooks:yaml', () => {
  const inputStore = fsStore({ path: path.join(__dirname, 'data') })
  const outputStore = fsStore({ path: path.join(__dirname, 'output') })

  before(async () => {
    chailint(chai, util)
  })

  const yamlHook = {
    type: 'after',
    data: {
      id: 'mapproxy.yaml'
    },
    result: {
      id: 'mapproxy.yaml'
    },
    params: { store: inputStore }
  }

  it('converts YAML to JSON', () => {
    return pluginHooks.readYAML()(yamlHook)
      .then(hook => {
        expect(hook.result.data).toExist()
      })
  })
  // Let enough time to proceed
    .timeout(5000)

  it('converts JSON to YAML', () => {
    // Switch to output store
    yamlHook.params.store = outputStore
    return pluginHooks.writeYAML()(yamlHook)
      .then(hook => {
        expect(fs.existsSync(path.join(outputStore.path, yamlHook.result.id + '.yaml'))).beTrue()
      })
  })
  // Let enough time to proceed
    .timeout(5000)

  const capabilitiesHook = {
    type: 'after'
  }
})
