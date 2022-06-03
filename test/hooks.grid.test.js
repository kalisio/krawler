import chai from 'chai'
import chailint from 'chai-lint'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import fsStore from 'fs-blob-store'
import fs from 'fs'
import path, { dirname } from 'path'
import moment from 'moment'
import plugin, { hooks as pluginHooks } from '../lib/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

describe('krawler:hooks:grid', () => {
  let app, server, tasksService, jobsService
  const outputStore = fsStore({ path: path.join(__dirname, 'output') })

  before(async () => {
    chailint(chai, util)
    app = express(feathers())
    app.configure(plugin())
    server = await app.listen(3030)
  })

  it('adds hooks to the jobs service', () => {
    app.use('tasks', plugin.tasks())
    tasksService = app.service('tasks')
    expect(tasksService).toExist()
    app.use('jobs', plugin.jobs())
    jobsService = app.service('jobs')
    expect(jobsService).toExist()
    jobsService.hooks({
      before: {
        create: [
          pluginHooks.generateGrid(),
          pluginHooks.generateGridTasks()
        ]
      }
    })
  })

  it('converts zone spec to grid spec', () => {
    // We want 1° resolution grid centered at given latitude/longitude and 10 cells long
    const latitude = 40
    const longitude = 0
    const n = 10
    const convergenceFactor = 1.0 / Math.cos(latitude * Math.PI / 180)
    const earthRadius = 6356752.31424518
    const resolution = 2 * Math.PI * earthRadius / 360
    const hook = {
      type: 'before',
      data: {
        longitude,
        latitude,
        resolution,
        halfWidth: n * resolution
      }
    }
    pluginHooks.generateGrid()(hook)
    expect(hook.data.resolution).to.deep.equal([convergenceFactor, 1])
    expect(hook.data.origin).to.deep.equal([longitude - n * convergenceFactor, latitude - n])
    expect(hook.data.size).to.deep.equal([20, 20])
  })

  it('creates a WMS gridded job', (done) => {
    const datetime = moment.utc()
    datetime.startOf('day')
    jobsService.create({
      id: 'wms-grid',
      taskTemplate: {
        id: '<%= jobId %>-<%= taskId %>.png',
        type: 'wms',
        options: {
          url: 'https://geoservices.meteofrance.fr/services/MF-NWP-GLOBAL-ARPEGE-025-GLOBE-WMS',
          version: '1.3.0',
          token: '__qEMDoIC2ogPRlSoRQLGUBOomaxJyxdEd__',
          layers: 'TEMPERATURE__ISOBARIC_SURFACE',
          crs: 'EPSG:4326',
          styles: 'T__ISOBARIC__SHADING',
          format: 'image/png',
          width: 512,
          height: 512,
          dim_reference_time: datetime.format(),
          time: datetime.format()
        }
      },
      origin: [-10, 35],
      resolution: [0.5, 0.5],
      size: [2, 2]
    }, { store: outputStore })
      .then(tasks => {
        expect(tasks.length).to.equal(4)
        tasks.forEach(task => {
          expect(fs.existsSync(path.join(outputStore.path, task.id))).beTrue()
        })
        done()
      })
      .catch(error => {
      // Sometimes meteo france servers reply 404 or 503
        console.log(error)
        done()
      })
  })
  // Let enough time to download
    .timeout(30000)

  it('creates a WCS gridded job with resampling', (done) => {
    // These hooke only work with Geotiff
    tasksService.hooks({
      after: {
        create: [
          pluginHooks.readGeoTiff(),
          pluginHooks.resampleGrid({
            input: { bounds: [-10, 35, -8, 37], origin: [-10, 35], size: [2, 2], resolution: [0.5, 0.5] },
            output: { origin: [-9.5, 35.5], size: [1, 1], resolution: [1, 1] }
          }),
          pluginHooks.writeJson()
        ]
      }
    })
    jobsService.hooks({
      after: {
        create: pluginHooks.writeCSV({
          fields: [
            {
              label: 'Latmin',
              value: 'bbox[1]'
            },
            {
              label: 'Lonmin',
              value: 'bbox[0]'
            },
            {
              label: 'Latmax',
              value: 'bbox[3]'
            },
            {
              label: 'Lonmax',
              value: 'bbox[2]'
            },
            {
              label: 'Elev',
              value: 'max'
            }
          ]
        })
      }
    })

    const datetime = moment.utc()
    datetime.startOf('day')
    jobsService.create({
      id: 'wcs-grid',
      taskTemplate: {
        id: '<%= jobId %>-<%= taskId %>.tif',
        type: 'wcs',
        options: {
          /*
          url: 'http://geoserver.kalisio.xyz/geoserver/Kalisio/wcs',
          version: '2.0.1',
          format: 'image/tiff',
          coverageid: 'Kalisio:GMTED2010_15',
          longitudeLabel: 'Long',
          latitudeLabel: 'Lat'
          */
          url: 'https://geoservices.meteofrance.fr/services/MF-NWP-GLOBAL-ARPEGE-025-GLOBE-WCS',
          version: '2.0.1',
          token: '__qEMDoIC2ogPRlSoRQLGUBOomaxJyxdEd__',
          coverageid: 'TEMPERATURE__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND' + '___' + datetime.format(),
          subsets: {
            time: datetime.format(),
            height: 3000
          }
        }
      },
      origin: [-10, 35],
      resolution: [0.5, 0.5],
      size: [2, 2]
    }, { store: outputStore })
      .then(tasks => {
        expect(tasks.length).to.equal(4)
        tasks.forEach(task => {
          expect(task.data).toExist()
          expect(task.data.length).to.equal(1) // Downsampling 4 => 1
          expect(fs.existsSync(path.join(outputStore.path, task.id))).beTrue()
          expect(fs.existsSync(path.join(outputStore.path, task.id + '.json'))).beTrue()
        })
        done()
      })
      .catch(error => {
      // Sometimes meteo france servers reply 404 or 503
        console.log(error)
        done()
      })
  })
  // Let enough time to download
    .timeout(30000)

  // Cleanup
  after(() => {
    if (server) server.close()
  })
})
