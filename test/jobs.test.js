import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from 'feathers'
import path from 'path'
import moment from 'moment'
import store from 'fs-blob-store'
import plugin, { stores } from '../src'

describe('krawler:tasks', () => {
  let app, server, storage, jobsService

  before(() => {
    chailint(chai, util)
    app = feathers()
    app.configure(plugin)
    server = app.listen(3030)
  })

  it('registers the storage', () => {
    storage = store(path.join(__dirname, './data'))
    stores.registerStore('fs', storage)
    expect(stores.getStore('fs')).toExist()
  })

  it('creates the jobs service', () => {
    app.use('tasks', plugin.tasks())
    app.use('jobs', plugin.jobs())
    jobsService = app.service('jobs')
    expect(jobsService).toExist()
  })

  it('creates a WCS job', (done) => {
    let datetime = moment.utc()
    datetime.startOf('day')
    jobsService.create({
      id: 'requests',
      taskTemplate: {
        store: 'fs',
        id: '<%= taskId %>.tif',
        type: 'wcs',
        options: {
          url: 'https://geoservices.meteofrance.fr/services/MF-NWP-GLOBAL-ARPEGE-05-GLOBE-WCS?SERVICE=WCS&version=2.0.1',
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
