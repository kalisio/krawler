import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from 'feathers'
import path from 'path'
import nock from 'nock'
import moment from 'moment'
import plugin from '../src'

describe('krawler:tasks', () => {
  let app, server, storage, storesService, tasksService

  before(() => {
    chailint(chai, util)
    app = feathers()
    app.configure(plugin())
    server = app.listen(3030)
  })

  it('creates the storage', () => {
    app.use('stores', plugin.stores())
    storesService = app.service('stores')
    return storesService.create({ id: 'test-store', type: 'fs', options: { path: path.join(__dirname, 'output') } })
    .then(store => {
      storage = store
    })
  })

  it('creates the tasks service', () => {
    app.use('tasks', plugin.tasks())
    tasksService = app.service('tasks')
    expect(tasksService).toExist()
  })

  it('creates a HTTP task', (done) => {
    nock('https://www.google.com')
    .get('/')
    .reply(200, '<html></html>')
    tasksService.create({
      id: 'task.html',
      store: 'test-store',
      type: 'http',
      options: {
        url: 'https://www.google.com'
      }
    })
    .then(task => {
      storage.exists('task.html', (error, exist) => {
        if (error) done(error)
        else done(exist ? null : new Error('File not found in store'))
      })
    })
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

  it('creates a WCS task', (done) => {
    let datetime = moment.utc()
    datetime.startOf('day')
    tasksService.create({
      id: 'task.tif',
      store: 'test-store',
      type: 'wcs',
      options: {
        url: 'https://geoservices.meteofrance.fr/services/MF-NWP-GLOBAL-ARPEGE-05-GLOBE-WCS',
        version: '2.0.1',
        token: '__qEMDoIC2ogPRlSoRQLGUBOomaxJyxdEd__',
        coverageid: 'TEMPERATURE__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND' + '___' + datetime.format(),
        subsets: {
          height: 2,
          time: datetime.format()
        }
      }
    })
    .then(task => {
      storage.exists('task.tif', (error, exist) => {
        if (error) done(error)
        else done(exist ? null : new Error('File not found in store'))
      })
    })
    .catch(error => {
      // Sometimes meteo france servers reply 404 or 503
      done()
    })
  })
  // Let enough time to download
  .timeout(10000)

  it('removes a task', (done) => {
    tasksService.remove('task.tif', { store: storage })
    .then(_ => {
      storage.exists('task.tif', (error, exist) => {
        if (error) done(error)
        else done(!exist ? null : new Error('File found in store'))
      })
    })
  })

  // Cleanup
  after(() => {
    if (server) server.close()
  })
})
