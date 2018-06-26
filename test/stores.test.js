import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from 'feathers'
import path from 'path'
import fs from 'fs'
import plugin, { hooks as pluginHooks } from '../src'

describe('krawler:stores', () => {
  let app, storesService, fsStore, memoryStore, s3Store

  before(() => {
    chailint(chai, util)
    app = feathers()
    app.configure(plugin())
  })

  it('creates the stores service', () => {
    app.use('stores', plugin.stores())
    storesService = app.service('stores')
    expect(storesService).toExist()
  })

  it('creates the fs storage', () => {
    return storesService.create({
      id: 'fs',
      type: 'fs',
      options: {
        path: path.join(__dirname, 'output')
      }
    })
    .then(_ => {
      return storesService.get('fs')
    })
    .then(store => {
      fsStore = store
      expect(fsStore).toExist()
    })
  })

  it('creates the memory storage', () => {
    return storesService.create({
      id: 'memory',
      type: 'memory'
    })
    .then(_ => {
      return storesService.get('memory')
    })
    .then(store => {
      memoryStore = store
      expect(memoryStore).toExist()
    })
  })

  it('creates the s3 storage', () => {
    return storesService.create({
      id: 's3',
      options: {
        client: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        },
        bucket: process.env.S3_BUCKET
      }
    })
    .then(_ => {
      return storesService.get('s3')
    })
    .then(store => {
      s3Store = store
      expect(s3Store).toExist()
    })
  })

  let copyHook = {
    type: 'before',
    data: {
      id: 'world_cities.csv'
    },
    params: {}
  }

  it('copy to store', () => {
    // Fake hook service
    copyHook.service = { storesService }
    return pluginHooks.copyToStore({ input: { store: 's3', key: '<%= id %>' }, output: { store: 'fs', key: '<%= id %>' } })(copyHook)
    .then(hook => {
      expect(fs.existsSync(path.join(fsStore.path, copyHook.data.id))).beTrue()
    })
  })
  // Let enough time to proceed
  .timeout(10000)

  it('removes the fs storage', (done) => {
    storesService.remove('fs')
    .then(store => {
      storesService.get('fs').catch(error => {
        expect(error).toExist()
        done()
      })
    })
  })

  it('removes the memory storage', (done) => {
    storesService.remove('memory')
    .then(store => {
      storesService.get('memory').catch(error => {
        expect(error).toExist()
        done()
      })
    })
  })

  it('removes the s3 storage', (done) => {
    storesService.remove('s3')
    .then(store => {
      storesService.get('s3').catch(error => {
        expect(error).toExist()
        done()
      })
    })
  })

  // Cleanup
  after(() => {

  })
})
