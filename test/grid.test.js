import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from 'feathers'
import hooks from 'feathers-hooks'
import path from 'path'
import moment from 'moment'
import store from 'fs-blob-store'
import plugin, { stores, hooks as pluginHooks } from '../src'

describe('krawler:grid', () => {
  let app, server, storage, jobsService

  before(() => {
    chailint(chai, util)
    app = feathers()
    app.configure(hooks())
    app.configure(plugin)
    server = app.listen(3030)
  })

  it('registers the storage', () => {
    storage = store(path.join(__dirname, './data'))
    stores.registerStore('fs', storage)
    expect(stores.getStore('fs')).toExist()
  })

  it('adds hooks to the jobs service', () => {
    app.use('tasks', plugin.tasks())
    app.use('jobs', plugin.jobs())
    jobsService = app.service('jobs')
    expect(jobsService).toExist()
    jobsService.hooks({
      before: {
        create: [pluginHooks.generateGrid, pluginHooks.generateGridTasks]
      }
    })
  })

  it('converts zone spec to grid spec', () => {
    // We want 1° resolution grid centered at given latitude/longitude and 10 cells long
    const latitude = 40
    const longitude = 0
    const n = 10
    const convergenceFactor = Math.cos(latitude * Math.PI / 180)
    const earthRadius = 6356752.31424518
    const resolution = 2 * Math.PI * earthRadius / 360
    let hook = {
      type: 'before',
      data: {
        longitude,
        latitude,
        resolution,
        halfWidth: n * resolution
      }
    }
    pluginHooks.generateGrid(hook)
    expect(hook.data.resolution).to.deep.equal([convergenceFactor, 1])
    expect(hook.data.origin).to.deep.equal([longitude - n * convergenceFactor, latitude - n])
    expect(hook.data.size).to.deep.equal([20, 20])
  })

  it('creates a WMS gridded job', (done) => {
    let datetime = moment.utc()
    datetime.startOf('day')
    jobsService.create({
      id: 'requests',
      taskTemplate: {
        store: 'fs',
        id: '<%= taskId %>.png',
        type: 'wms',
        options: {
          url: 'https://geoservices.meteofrance.fr/services/MF-NWP-GLOBAL-ARPEGE-05-GLOBE-WMS?SERVICE=WMS&version=1.3.0',
          token: '__qEMDoIC2ogPRlSoRQLGUBOomaxJyxdEd__',
          LAYERS: 'TEMPERATURE__ISOBARIC_SURFACE',
          CRS: 'EPSG:4326',
          styles: 'T__ISOBARIC__SHADING',
          format: 'image/png',
          width: 512,
          height: 512,
          dim_reference_time: datetime.format(),
          time: datetime.format()
        }
      },
      origin: [-10, 35],
      resolution: [5, 5],
      size: [2, 2]
    })
    .then(tasks => {
      done()
      // storage.exists('request.tif', error => done(error))
    })
  })
  // Let enough time to download
  .timeout(30000)

  // Cleanup
  after(() => {
    if (server) server.close()
  })
})
