import chai from 'chai'
import chailint from 'chai-lint'
import path, { dirname } from 'path'
import fsStore from 'fs-blob-store'
import yaml from 'js-yaml'
import fs from 'fs'
import _ from 'lodash'
import utils from 'util'
import { hooks as pluginHooks } from '../lib/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

describe('krawler:hooks:utils', () => {
  const inputStore = fsStore({ path: path.join(__dirname, 'data') })
  const outputStore = fsStore({ path: path.join(__dirname, 'output') })

  before(async () => {
    chailint(chai, util)
  })

  const applyHook = {
    type: 'before',
    data: {
      value: 6
    }
  }

  it('apply function', async () => {
    const hook = await pluginHooks.apply({
      function: (item) => { if (item.value === 6) item.value = 3 }
    })(applyHook)

    expect(hook.data.value).to.equal(3)
  })

  it('apply async function', async () => {
    const hook = await pluginHooks.apply({
      function: async (item) => {
        await utils.promisify(setTimeout)(1000)
        if (item.value === 3) item.value = 6
      }
    })(applyHook)

    expect(hook.data.value).to.equal(6)
  })
  // Let enough time to download
    .timeout(5000)

  it('apply function raising error', (done) => {
    pluginHooks.apply({
      function: (item) => { throw new Error('apply error') }
    })(applyHook)
      .catch(error => {
        expect(error).toExist()
        expect(error.message).to.equal('apply error')
        done()
      })
  })

  it('apply async function raising error', (done) => {
    pluginHooks.apply({
      function: async (item) => {
        await utils.promisify(setTimeout)(1000)
        throw new Error('apply error')
      }
    })(applyHook)
      .catch(error => {
        expect(error).toExist()
        expect(error.message).to.equal('apply error')
        done()
      })
  })
  // Let enough time to download
    .timeout(5000)

  it('apply function with match filter', async () => {
    applyHook.type = 'after'
    applyHook.method = 'create' // Required to use hook pipeline
    applyHook.result = { value: 6 }
    let hook = await pluginHooks.addHook('apply', { match: { value: 6 }, function: (item) => { item.value = 3 } })(applyHook)
    expect(hook.result.value).to.equal(3)
    hook = await pluginHooks.addHook('apply', { match: { value: 6 }, function: (item) => { item.value = 6 } })(applyHook)
    expect(hook.result.value).to.equal(3)
  })

  it('apply function with match filter predicate', async () => {
    applyHook.type = 'after'
    applyHook.method = 'create' // Required to use hook pipeline
    applyHook.result = { value: 6 }
    let hook = await pluginHooks.addHook('apply', { match: { predicate: (item) => item.value === 3 }, function: (item) => { item.value = 6 } })(applyHook)
    expect(hook.result.value).to.equal(6)
    hook = await pluginHooks.addHook('apply', { match: { predicate: (item) => item.value === 3 }, function: (item) => { item.value = 3 } })(applyHook)
    expect(hook.result.value).to.equal(6)
  })

  it('apply function with async match filter predicate', async () => {
    applyHook.type = 'after'
    applyHook.method = 'create' // Required to use hook pipeline
    applyHook.result = { value: 6 }
    let hook = await pluginHooks.addHook('apply', {
      match: {
        predicate: async (item) => {
          await utils.promisify(setTimeout)(1000)
          return item.value === 3
        }
      },
      function: (item) => { item.value = 6 }
    })(applyHook)
    expect(hook.result.value).to.equal(6)
    hook = await pluginHooks.addHook('apply', {
      match: {
        predicate: async (item) => {
          await utils.promisify(setTimeout)(1000)
          return item.value === 3
        }
      },
      function: (item) => { item.value = 3 }
    })(applyHook)
    expect(hook.result.value).to.equal(6)
  })
  // Let enough time to download
    .timeout(5000)

  const templateHook = {
    type: 'after',
    data: {
      id: 'mapproxy-templated'
    },
    result: {
      id: 'mapproxy-templated',
      data: {
        times: [new Date(Date.UTC(2017, 11, 5, 0, 0, 0)), new Date(Date.UTC(2017, 11, 5, 6, 0, 0)), new Date(Date.UTC(2017, 11, 5, 12, 0, 0))],
        elevations: [0, 10, 100]
      }
    },
    params: { store: outputStore, templateStore: inputStore }
  }

  it('write template from JSON', async () => {
    const hook = await pluginHooks.writeTemplate({ templateFile: 'mapproxy-template.yaml' })(templateHook)
    let templated = fs.readFileSync(path.join(outputStore.path, 'mapproxy-templated.yaml'), 'utf8')
    templated = yaml.safeLoad(templated)
    const times = _.get(templated, 'layers[0].dimensions.time.values')
    expect(times).toExist()
    expect(times.map(time => new Date(time))).to.deep.equal(hook.result.data.times)
    const elevations = _.get(templated, 'layers[0].dimensions.elevation.values')
    expect(elevations).toExist()
    expect(elevations).to.deep.equal(hook.result.data.elevations)
  })
  // Let enough time to proceed
    .timeout(5000)

  const hookDefinitions = {
    readJson: {},
    convertToGeoJson: {}
  }

  it('insert hook before', () => {
    let newHookDefinitions = pluginHooks.insertHookBefore('convertToGeoJson', hookDefinitions, 'transformJson', {})
    let index = 0
    _.forOwn(newHookDefinitions, (hookOptions, hookName) => {
      if (index === 0) expect(hookName).to.equal('readJson')
      else if (index === 1) expect(hookName).to.equal('transformJson')
      else if (index === 2) expect(hookName).to.equal('convertToGeoJson')
      index++
    })
  })

  it('insert hook after', () => {
    let newHookDefinitions = pluginHooks.insertHookAfter('readJson', hookDefinitions, 'transformJson', {})
    let index = 0
    _.forOwn(newHookDefinitions, (hookOptions, hookName) => {
      if (index === 0) expect(hookName).to.equal('readJson')
      else if (index === 1) expect(hookName).to.equal('transformJson')
      else if (index === 2) expect(hookName).to.equal('convertToGeoJson')
      index++
    })
  })
})
