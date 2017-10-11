import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from 'feathers'
import path from 'path'
import moment from 'moment'
import store from 'fs-blob-store'
import plugin from '../src'

describe('krawler:tasks', () => {
  let app, storage, tasksService

  before(() => {
    chailint(chai, util)
    app = feathers()
    app.configure(plugin)
    storage = store(path.join(__dirname, './data'))
  })

  it('creates the tasks service', () => {
    app.use('tasks', plugin.tasks({ Model: storage }))
    tasksService = app.service('tasks')
    expect(tasksService).toExist()
  })

  it('creates a WCS task', (done) => {
    let datetime = moment.utc()
    datetime.startOf('day')
    tasksService.create({
      id: 'request.tif',
      type: 'wcs',
      options: {
        url: 'https://geoservices.meteofrance.fr/services/MF-NWP-GLOBAL-ARPEGE-05-GLOBE-WCS?SERVICE=WCS&version=2.0.1',
        token: '__qEMDoIC2ogPRlSoRQLGUBOomaxJyxdEd__',
        coverageid: 'TEMPERATURE__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND' + '___' + datetime.format(),
        subsets: {
          height: 2,
          time: datetime.format()
        }
      }
    })
    .then(task => {
      storage.exists('request.tif', error => done(error))
    })
  })
  // Let enough time to download
  .timeout(10000)

})
