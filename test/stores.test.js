import chai from 'chai'
import chailint from 'chai-lint'
import feathers from '@feathersjs/feathers'
import path, { dirname } from 'path'
import fs from 'fs'
import plugin, { hooks as pluginHooks } from '../lib/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

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

  it('creates the fs input storage', () => {
    return storesService.create({
      id: 'fs-in',
      type: 'fs',
      options: {
        path: path.join(__dirname, 'data')
      }
    })
      .then(_ => {
        return storesService.get('fs-in')
      })
  })

  it('creates the fs output storage', () => {
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

  const storeHook = {
    type: 'before',
    data: {
      id: 'world_cities.csv'
    },
    params: {}
  }

  it('copy between stores', () => {
    // Fake hook service
    storeHook.service = { storesService }
    return pluginHooks.copyToStore({ input: { store: 's3', key: '<%= id %>' }, output: { store: 'fs', key: '<%= id %>' } })(storeHook)
      .then(hook => {
        expect(fs.existsSync(path.join(fsStore.path, storeHook.data.id))).beTrue()
      })
  })
  // Let enough time to proceed
    .timeout(10000)

  it('check if file exists in stores', () => {
    // Fake hook service
    return pluginHooks.discardIfExistsInStore({ output: { store: 'fs', key: '<%= id %>.none' } })(storeHook)
      .then(hook => {
        expect(hook.data.skip).beUndefined()
        return pluginHooks.discardIfExistsInStore({ output: { store: 'fs', key: '<%= id %>' } })(storeHook)
      })
      .then(hook => {
        expect(hook.data.skip).beTrue()
      })
  })
  // Let enough time to proceed
    .timeout(10000)

  it('copy inside the same store', () => {
    return pluginHooks.copyToStore({ input: { store: 'fs', key: '<%= id %>' }, output: { store: 'fs', key: '<%= id %>.copy' } })(storeHook)
      .then(hook => {
        expect(fs.existsSync(path.join(fsStore.path, storeHook.data.id + '.copy'))).beTrue()
        const originalStat = fs.statSync(path.join(fsStore.path, storeHook.data.id))
        const deflateStat = fs.statSync(path.join(fsStore.path, storeHook.data.id + '.copy'))
        expect(originalStat.size).to.equal(deflateStat.size)
      })
  })
  // Let enough time to proceed
    .timeout(10000)

  it('gzip in a store', () => {
    return pluginHooks.gzipToStore({ input: { store: 'fs', key: '<%= id %>' }, output: { store: 'fs', key: '<%= id %>.gz' } })(storeHook)
      .then(hook => {
        expect(fs.existsSync(path.join(fsStore.path, storeHook.data.id + '.gz'))).beTrue()
      })
  })
  // Let enough time to proceed
    .timeout(10000)

  it('gunzip in a store', () => {
    return pluginHooks.gunzipFromStore({ input: { store: 'fs', key: '<%= id %>.gz' }, output: { store: 'fs', key: '<%= id %>.guz' } })(storeHook)
      .then(hook => {
        expect(fs.existsSync(path.join(fsStore.path, storeHook.data.id + '.guz'))).beTrue()
        const originalStat = fs.statSync(path.join(fsStore.path, storeHook.data.id))
        const deflateStat = fs.statSync(path.join(fsStore.path, storeHook.data.id + '.guz'))
        expect(originalStat.size).to.equal(deflateStat.size)
      })
  })
  // Let enough time to proceed
    .timeout(10000)

  it('unzip in a store', () => {
    return pluginHooks.unzipFromStore({ input: { store: 'fs-in', key: 'stations.zip' }, output: { store: 'fs', path: 'unzip' } })(storeHook)
      .then(hook => {
        expect(fs.existsSync(path.join(fsStore.path, 'unzip', 'StationHydro_FXX-geojson.dat'))).beTrue()
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
