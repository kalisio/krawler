import chai from 'chai'
import chailint from 'chai-lint'
import path, { dirname } from 'path'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import fsStore from 'fs-blob-store'
import fs from 'fs'
import plugin, { hooks as pluginHooks } from '../lib/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

describe('krawler:hooks:nwp', () => {
  let app, server, tasksService, jobsService
  const outputStore = fsStore({ path: path.join(__dirname, 'output') })

  before(async () => {
    chailint(chai, util)
    app = express(feathers())
    app.configure(plugin())
    server = await app.listen(3030)
  })

  it('adds hooks to the jobs service', () => {
    app.use('stores', plugin.stores())
    app.use('tasks', plugin.tasks())
    tasksService = app.service('tasks')
    expect(tasksService).toExist()
    app.use('jobs', plugin.jobs())
    jobsService = app.service('jobs')
    expect(jobsService).toExist()
    jobsService.hooks({
      before: {
        create: [
          // Test for hard-coded options
          pluginHooks.generateNwpTasks({
            runInterval: 6 * 3600, // Produced every 6h
            oldestRunInterval: 24 * 3600, // Don't go back in time older than 1 day
            interval: 3 * 3600, // Steps of 3h
            lowerLimit: 3 * 3600, // From T0 + 3h
            upperLimit: 6 * 3600, // Up to T0 + 6h
            runIndex: -2, // Not current run but previous one to ensure it is already available
            keepPastForecasts: true, // As we go back in time
            elements: [{
              name: 'TEMPERATURE__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND',
              levels: [100, 3000]
            }, {
              name: 'WIND_SPEED_GUST__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND',
              levels: [10]
            }]
          })
        ]
      }
    })
  })

  it('creates a ARPEGE download job', (done) => {
    jobsService.create({
      id: 'ARPEGE-025-GLOBE',
      options: { faultTolerant: true },
      taskTemplate: {
        id: '<%= name %>_<%= level %>_<%= runTime.format(\'YYYY-MM-DD[_]HH-mm-ss\') %>_<%= forecastTime.format(\'YYYY-MM-DD[_]HH-mm-ss\') %>.tif',
        type: 'wcs',
        options: {
          url: 'https://public-api.meteofrance.fr/public/arpege/1.0/wcs/MF-NWP-GLOBAL-ARPEGE-025-GLOBE-WCS/GetCoverage',
          version: '2.0.1',
          apikey: process.env.METEO_FRANCE_TOKEN,
          coverageid: '<%= name %>___<%= runTime.format() %>',
          subsets: {
            time: '<%= forecastTime.format() %>',
            height: '<%= level %>',
            long: [8, 10],
            lat: [41, 43]
          }
        }
      }
    }, { store: outputStore })
      .then(tasks => {
        expect(tasks.length).to.equal(6)
        tasks.forEach(task => {
          expect(fs.existsSync(path.join(outputStore.path, task.id))).beTrue()
        })
        done()
      })
  })
  // Let enough time to download
    .timeout(30000)

  it('creates a GFS download job', (done) => {
    jobsService.create({
      id: 'GFS-05-GLOBE',
      // Test for options given in job
      runInterval: 6 * 3600, // Produced every 6h
      oldestRunInterval: 24 * 3600, // Don't go back in time older than 1 day
      interval: 3 * 3600, // Steps of 3h
      lowerLimit: 3 * 3600, // From T0 + 3h
      upperLimit: 6 * 3600, // Up to T0 + 6h
      runIndex: -2, // Not current run but previous one to ensure it is already available
      keepPastForecasts: true, // As we go back in time
      elements: [{
        name: 'var_UGRD',
        levels: ['lev_10_m_above_ground', 'lev_100_m_above_ground']
      }, {
        name: 'var_GUST',
        levels: ['lev_surface']
      }],
      options: { faultTolerant: true },
      taskTemplate: {
        id: '<%= name %>_<%= level %>_<%= runTime.format(\'YYYY-MM-DD[_]HH-mm-ss\') %>_<%= forecastTime.format(\'YYYY-MM-DD[_]HH-mm-ss\') %>.grib',
        type: 'http',
        options: {
          url: 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p50.pl',
          dir: '/gfs.<%= runTime.format(\'YYYYMMDD/HH\') %>/atmos',
          file: 'gfs.t<%= runTime.format(\'HH\') %>z.pgrb2full.0p50.f<%= (timeOffset / 3600).toString().padStart(3, \'0\') %>',
          subregion: true,
          leftlon: 8,
          rightlon: 10,
          bottomlat: 41,
          toplat: 43,
          '<%= name %>': 'on',
          '<%= level %>': 'on'
        }
      }
    }, { store: outputStore })
      .then(tasks => {
        expect(tasks.length).to.equal(6)
        tasks.forEach(task => {
          expect(fs.existsSync(path.join(outputStore.path, task.id))).beTrue()
        })
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
