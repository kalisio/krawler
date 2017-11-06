import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from 'feathers'
import hooks from 'feathers-hooks'
import path from 'path'
import moment from 'moment'
import plugin, { hooks as pluginHooks } from '../src'

describe('krawler:grid', () => {
  let app, server, storesService, tasksService, jobsService

  before(() => {
    chailint(chai, util)
    app = feathers()
    app.configure(hooks())
    app.configure(plugin)
    server = app.listen(3030)
  })

  it('adds hooks to the jobs service', () => {
    app.use('stores', plugin.stores())
    storesService = app.service('stores')
    app.use('tasks', plugin.tasks())
    tasksService = app.service('tasks')
    expect(tasksService).toExist()
    app.use('jobs', plugin.jobs())
    jobsService = app.service('jobs')
    expect(jobsService).toExist()
    tasksService.hooks({
      after: {
        create: [pluginHooks.computeValues({ max: true })]
      }
    })
    jobsService.hooks({
      before: {
        create: [pluginHooks.generateGrid, pluginHooks.generateGridTasks]
      },
      after: {
        create: pluginHooks.generateCSV([
          {
            label: 'Latmin',
            value: (task) => {
              return task.bbox[1]
            }
          },
          {
            label: 'Lonmin',
            value: (task) => {
              return task.bbox[0]
            }
          },
          {
            label: 'Latmax',
            value: (task) => {
              return task.bbox[3]
            }
          },
          {
            label: 'Lonmax',
            value: (task) => {
              return task.bbox[2]
            }
          },
          {
            label: 'Elev',
            value: 'max'
          }
        ])
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
/*
  it('creates a WCS gridded job', (done) => {
    jobsService.create({
      id: 'requests',
      store: {
        id: 'test-store',
        type: 'fs',
        options: { path: path.join(__dirname, './data') }
      },
      taskTemplate: {
        store: 'test-store',
        id: '<%= taskId %>.tif',
        type: 'wcs',
        options: {
          url: 'http://geoserver.kalisio.xyz/geoserver/Kalisio/wcs',
          VERSION: '2.0.1',
          FORMAT: 'image/tiff',
          coverageid: 'Kalisio:GMTED2010_15'
        }
      },
      origin: [-10, 35],
      resolution: [5, 5],
      size: [2, 2]
    })
    .then(tasks => {
      return storesService.get('test-store')
    })
    .then(store => {
      store.exists('0-0.tif', error => done(error))
    })
  })
  // Let enough time to download
  .timeout(30000)
*/
  it('creates a WMS gridded job', (done) => {
    let datetime = moment.utc()
    datetime.startOf('day')
    jobsService.create({
      id: 'requests',
      store: {
        id: 'test-store',
        type: 'fs',
        options: { path: path.join(__dirname, './data') }
      },
      taskTemplate: {
        id: '<%= taskId %>.png',
        type: 'wms',
        options: {
          url: 'https://geoservices.meteofrance.fr/services/MF-NWP-GLOBAL-ARPEGE-05-GLOBE-WMS',
          VERSION: '1.3.0',
          token: '__qEMDoIC2ogPRlSoRQLGUBOomaxJyxdEd__',
          LAYERS: 'TEMPERATURE__ISOBARIC_SURFACE',
          CRS: 'EPSG:4326',
          STYLES: 'T__ISOBARIC__SHADING',
          FORMAT: 'image/png',
          WIDTH: 512,
          HEIGHT: 512,
          dim_reference_time: datetime.format(),
          time: datetime.format()
        }
      },
      origin: [-10, 35],
      resolution: [5, 5],
      size: [2, 2]
    })
    .then(tasks => {
      return storesService.get('test-store')
    })
    .then(store => {
      store.exists('0-0.png', error => done(error))
    })
  })
  // Let enough time to download
  .timeout(30000)

  // Cleanup
  after(() => {
    if (server) server.close()
  })
})
