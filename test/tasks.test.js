import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from 'feathers'
import path from 'path'
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
        done(exist ? null : new Error('File not found in store'))
      })
    })
  })
  // Let enough time to download
  .timeout(10000)

  // Cleanup
  after(() => {
    if (server) server.close()
  })
})
