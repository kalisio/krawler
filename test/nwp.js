import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import path from 'path'
import feathers from 'feathers'
import hooks from 'feathers-hooks'
import fsStore from 'fs-blob-store'
import fs from 'fs'
import plugin, { hooks as pluginHooks } from '../src'

describe('krawler:nwp', () => {
  let app, server, tasksService, jobsService
  let outputStore = fsStore({ path: path.join(__dirname, 'output') })

  before(async () => {
    chailint(chai, util)
    app = feathers()
    app.configure(hooks())
    app.configure(plugin())
    server = app.listen(3030)
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
          pluginHooks.generateNwpTasks({
            runInterval: 6 * 3600,          // Produced every 6h
            interval: 3 * 3600,             // Steps of 3h
            lowerLimit: 3 * 3600,           // From T0 + 3h
            upperLimit: 6 * 3600,           // Up to T0 + 6h
            runIndex: -2,                   // Not current run but previous one to ensure it is already available
            elements: [{
              name: 'TEMPERATURE__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND',
              levels: [ 100, 3000 ]
            }, {
              name: 'TEMPERATURE__ISOBARIC_SURFACE',
              levels: [ 850 ]
            }]
          })
        ]
      }
    })
  })

  it('creates a ARPEGE/AROME download job', (done) => {
    jobsService.create({
      id: 'MF-NWP-GLOBAL-ARPEGE-05-GLOBE-WCS',
      options: { faultTolerant: true },
      taskTemplate: {
        id: '<%= name %>_<%= level %>_<%= runTime.format(\'YYYY-MM-DD[_]HH-mm-ss\') %>_<%= forecastTime.format(\'YYYY-MM-DD[_]HH-mm-ss\') %>.tif',
        type: 'wcs',
        options: {
          url: 'https://geoservices.meteofrance.fr/services/MF-NWP-GLOBAL-ARPEGE-05-GLOBE-WCS',
          version: '2.0.1',
          token: '__qEMDoIC2ogPRlSoRQLGUBOomaxJyxdEd__',
          coverageid: '<%= name %>___<%= runTime.format() %>',
          subsets: {
            time: '<%= forecastTime.format() %>',
            height: '<%= level %>',
            long: [-10, 10],
            lat: [-10, 10]
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

  // Cleanup
  after(() => {
    if (server) server.close()
  })
})
