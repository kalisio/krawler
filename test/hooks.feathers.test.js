import chai from 'chai'
import chailint from 'chai-lint'
import path, { dirname } from 'path'
import fs from 'fs-extra'
import fsStore from 'fs-blob-store'
import { feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio'
import memory from '@feathersjs/memory'
import { hooks as pluginHooks } from '../lib/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

describe('krawler:hooks:feathers', () => {
  const inputStore = fsStore({ path: path.join(__dirname, 'data') })
  let app, server, geojson

  before(async () => {
    chailint(chai, util)
    app = feathers()
      .configure(socketio({ path: '/ws' }))
      .use('/geojson', memory({
        multi: true
      }))
    server = await app.listen(4000)
    geojson = fs.readJsonSync(path.join(inputStore.path, 'geojson.json'))
  })

  const feathersOptions = {
    origin: 'http://localhost:4000',
    transport: 'websocket',
    path: '/ws'
  }

  const feathersHook = {
    type: 'before',
    data: {},
    params: {}
  }

  it('connect to Feathers', async () => {
    await pluginHooks.connectFeathers(feathersOptions)(feathersHook)
    expect(feathersHook.data.client).toExist()
    expect(feathersHook.data.client.service('/geojson')).toExist()
  })
  // Let enough time to proceed
    .timeout(5000)

  it('connect to Feathers again', async () => {
    const result = await pluginHooks.connectFeathers(feathersOptions)(feathersHook).then(ok => ok, no => no)
    expect(result).to.be.equal(feathersHook)
  })

  it('creates objects using service', async () => {
    feathersHook.type = 'after'
    feathersHook.result = feathersHook.data
    feathersHook.result.data = geojson
    await pluginHooks.callFeathersServiceMethod({
      service: '/geojson',
      method: 'create',
      transform: {
        omit: ['properties.prop2']
      }
    })(feathersHook)
    const service = feathersHook.data.client.service('/geojson')
    const results = await service.find({ query: {} })
    expect(results.length).to.equal(3)
    expect(results[0].properties).toExist()
    expect(results[0].properties.prop0).to.equal('value0')
    expect(results[0].properties.prop2).beUndefined()
  })
  // Let enough time to proceed
    .timeout(5000)

  it('reads objects using service', async () => {
    await pluginHooks.callFeathersServiceMethod({
      service: '/geojson',
      method: 'find',
      query: {
        $skip: 1,
        $limit: 2
      },
      transform: {
        omit: ['properties.prop0']
      }
    })(feathersHook)
    const results = feathersHook.result.data
    expect(results.length).to.equal(2)
    expect(results[0].id).to.equal(2)
    expect(results[0].properties).toExist()
    expect(results[0].properties.prop0).beUndefined()
    expect(results[0].properties.prop1).to.equal(0)
    expect(results[1].id).to.equal(3)
    expect(results[1].properties).toExist()
    expect(results[0].properties.prop0).beUndefined()
  })
  // Let enough time to proceed
    .timeout(5000)

  it('updates objects using service', async () => {
    feathersHook.type = 'after'
    await pluginHooks.callFeathersServiceMethod({
      service: '/geojson',
      method: 'patch',
      data: { properties: 'value1' },
      id: null,
      query: {}
    })(feathersHook)
    const service = feathersHook.data.client.service('/geojson')
    const results = await service.find({ query: {} })
    expect(results.length).to.equal(3)
    results.forEach(result => {
      expect(result.properties).to.equal('value1')
    })
  })
  // Let enough time to proceed
    .timeout(5000)

  it('deletes objects using service', async () => {
    await pluginHooks.callFeathersServiceMethod({
      service: '/geojson',
      method: 'remove',
      id: null,
      query: {}
    })(feathersHook)
    const service = feathersHook.data.client.service('/geojson')
    const results = await service.find({ query: {} })
    expect(results.length).to.equal(0)
  })
  // Let enough time to proceed
    .timeout(5000)

  it('disconnect from Feathers', async () => {
    // Cleanup
    await pluginHooks.disconnectFeathers()(feathersHook)
    expect(feathersHook.data.client).beUndefined()
  })
  // Let enough time to proceed
    .timeout(5000)

  it('disconnect from Feathers again', async () => {
    const result = await pluginHooks.disconnectFeathers()(feathersHook).then(ok => ok, no => no)
    expect(result).to.be.equal(feathersHook)
  })

  // Cleanup
  after(async () => {
    await server.close()
  })
})
