import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from 'feathers'
import path from 'path'
import moment from 'moment'
import plugin from '../src'

describe('krawler:jobs', () => {
  let app, server, storesService, jobsService

  before(() => {
    chailint(chai, util)
    app = feathers()
    app.configure(plugin())
    server = app.listen(3030)
  })

  it('creates the jobs service', () => {
    app.use('stores', plugin.stores())
    storesService = app.service('stores')
    app.use('tasks', plugin.tasks())
    app.use('jobs', plugin.jobs())
    jobsService = app.service('jobs')
    expect(jobsService).toExist()
  })

  it('creates a WCS job', (done) => {
    let datetime = moment.utc()
    datetime.startOf('day')
    jobsService.create({
      id: 'job',
      options: {
        workersLimit: 2
      },
      store: {
        id: 'test-store',
        type: 'fs',
        options: { path: path.join(__dirname, 'output') }
      },
      taskTemplate: {
        id: '<%= jobId %>-<%= taskId %>.tif',
        type: 'wcs',
        options: {
          url: 'https://geoservices.meteofrance.fr/services/MF-NWP-GLOBAL-ARPEGE-05-GLOBE-WCS',
          version: '2.0.1',
          token: '__qEMDoIC2ogPRlSoRQLGUBOomaxJyxdEd__',
          coverageid: 'TEMPERATURE__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND' + '___' + datetime.format(),
          subsets: {
            time: datetime.format()
          }
        }
      },
      tasks: [
        { id: '2', options: { subsets: { height: 2 } } },
        { id: '20', options: { subsets: { height: 20 } } },
        { id: '3000', options: { subsets: { height: 3000 } } }
      ]
    })
    .then(tasks => {
      return storesService.get('test-store')
    })
    .then(store => {
      store.exists('job-20.tif', (error, exist) => {
        if (error) done(error)
        else done(exist ? null : new Error('File not found in store'))
      })
    })
  })
  // Let enough time to download
  .timeout(30000)

  // Cleanup
  after(() => {
    if (server) server.close()
  })
})
