import chai from 'chai'
import chailint from 'chai-lint'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import path, { dirname } from 'path'
import utility from 'util'
import nock from 'nock'
import moment from 'moment'
import plugin, { hooks as pluginHooks } from '../lib/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

describe('krawler:tasks', () => {
  let app, server, storage, storageExists, storesService, tasksService

  before(async () => {
    chailint(chai, util)
    app = express(feathers())
    app.configure(plugin())
    server = await app.listen(3030)
  })

  it('creates the storage', async () => {
    app.use('stores', plugin.stores())
    storesService = app.service('stores')
    storage = await storesService.create({ id: 'test-store', type: 'fs', options: { path: path.join(__dirname, 'output') } })
    // Use a promisified version of this method to ease testing
    storageExists = utility.promisify(storage.exists).bind(storage)
  })

  it('creates the tasks service', () => {
    app.use('tasks', plugin.tasks())
    tasksService = app.service('tasks')
    expect(tasksService).toExist()
  })

  it('creates a HTTP task', async () => {
    nock('https://www.google.com')
      .get('/')
      .reply(200, '<html></html>')
    await tasksService.create({
      id: 'task.html',
      store: 'test-store',
      type: 'http',
      options: {
        url: 'https://www.google.com'
      }
    })
    const exist = await storageExists('task.html')
    expect(exist).beTrue()
  })
  // Let enough time to download
    .timeout(10000)

  it('creates a HTTP task with POST method', async () => {
    nock('https://www.google.com')
      .post('/')
      .reply(200, '<html></html>')
    await tasksService.create({
      id: 'post-task.html',
      store: 'test-store',
      type: 'http',
      options: {
        url: 'https://www.google.com',
        method: 'POST'
      }
    })
    const exist = await storageExists('post-task.html')
    expect(exist).beTrue()
  })
  // Let enough time to download
    .timeout(10000)

  it('creates a failed HTTP task (403)', (done) => {
    nock('https://www.google.com')
      .get('/')
      .reply(403)
    tasksService.create({
      id: 'task-403.html',
      store: 'test-store',
      type: 'http',
      options: {
        url: 'https://www.google.com'
      }
    })
      .catch(error => {
        expect(error).toExist()
        done()
      })
  })
  // Let enough time to fail
    .timeout(5000)

  it('creates a failed HTTP task (timeout)', (done) => {
    nock('https://www.google.com')
      .get('/')
      .delay(10000)
      .reply(200, '<html></html>')
    tasksService.create({
      id: 'task-timeout.html',
      store: 'test-store',
      type: 'http',
      options: {
        url: 'https://www.google.com',
        timeout: 5000
      }
    })
      .catch(error => {
        expect(error).toExist()
        done()
      })
  })
  // Let enough time to fail
    .timeout(10000)

  it('creates a WCS task', async () => {
    const datetime = moment.utc()
    datetime.startOf('day')
    await tasksService.create({
      id: 'task.tif',
      store: 'test-store',
      type: 'wcs',
      options: {
        url: 'https://public-api.meteofrance.fr/public/arpege/1.0/wcs/MF-NWP-GLOBAL-ARPEGE-025-GLOBE-WCS/GetCoverage',
        version: '2.0.1',
        apikey: process.env.METEO_FRANCE_TOKEN,
        coverageid: 'TEMPERATURE__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND' + '___' + datetime.format(),
        subsets: {
          height: 2,
          time: datetime.format()
        }
      }
    })
    const exist = await storageExists('task.tif')
    expect(exist).beTrue()
  })
  // Let enough time to download
    .timeout(30000)

  it('creates a WFS task', async () => {
    await tasksService.create({
      id: 'task.xml',
      store: 'test-store',
      type: 'wfs',
      options: {
        url: 'http://services.sandre.eaufrance.fr/geo/hyd',
        version: '1.1.0',
        typename: 'StationHydro_FXX',
        featureID: 'StationHydro_FXX.A282000101'
      }
    })
    const exist = await storageExists('task.xml')
    expect(exist).beTrue()
  })
  // Let enough time to download
    .timeout(30000)

  it('creates an OVERPASS task', async () => {
    await tasksService.create({
      id: 'overpass.json',
      store: 'test-store',
      type: 'overpass',
      options: {
        data: '[out:json][timeout:25][bbox:43.10,1.36,43.70,1.39];(node["aeroway"="runway"];way["aeroway"="runway"];relation["aeroway"="runway"];);out body;>;out skel qt;'
      }
    })
    const exist = await storageExists('overpass.json')
    expect(exist).beTrue()
  })
  // Let enough time to download
    .timeout(30000)

  it('removes a task', async () => {
    await tasksService.remove('task.tif', { store: storage })
    const exist = await storageExists('task.tif')
    expect(exist).beFalse()
  })

  it('run a task as hook', async () => {
    nock('https://www.google.com')
      .get('/')
      .reply(200, '<html></html>')
    const taskHook = {
      type: 'before',
      service: tasksService,
      data: {}
    }
    await pluginHooks.runTask({
      id: 'task.hook.html',
      store: 'test-store',
      type: 'http',
      options: {
        url: 'https://www.google.com'
      }
    })(taskHook)

    const exist = await storageExists('task.hook.html')
    expect(exist).beTrue()
  })
  // Let enough time to download
    .timeout(5000)

  // Cleanup
  after(() => {
    if (server) server.close()
  })
})
