import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from 'feathers'
import path from 'path'
import nock from 'nock'
import moment from 'moment'
import plugin from '../src'

describe('krawler:jobs', () => {
  let app, server, storage, storesService, jobsService

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

  it('creates the job store', () => {
    const outputPath = path.join(__dirname, 'output')
    return storesService.create({
      id: 'test-store',
      type: 'fs',
      options: { path: outputPath }
    })
    .then(store => {
      expect(store).toExist()
      expect(store.path).to.equal(outputPath)
      storage = store
    })
  })

  it('creates a HTTP job', (done) => {
    jobsService.create({
      id: 'job',
      tasks: [
        { id: 'job.html', type: 'http', store: 'test-store', options: { url: 'https://www.google.com' } }
      ]
    })
    .then(tasks => {
      storage.exists('job.html', (error, exist) => {
        if (error) done(error)
        else done(exist ? null : new Error('File not found in store'))
      })
    })
  })
  // Let enough time to download
  .timeout(5000)

  it('creates a failed HTTP job (403)', (done) => {
    nock('https://www.google.com')
    .get('/')
    .reply(403)
    jobsService.create({
      id: 'job',
      tasks: [
        { id: 'job-403.html', type: 'http', store: 'test-store', options: { url: 'https://www.google.com' } }
      ]
    })
    .catch(error => {
      expect(error).toExist()
      done()
    })
  })
  // Let enough time to fail
  .timeout(5000)

  it('creates a failed HTTP job (timeout)', (done) => {
    nock('https://www.google.com')
    .get('/')
    .delay(10000)
    .reply(200, '<html></html>')
    jobsService.create({
      id: 'job',
      tasks: [
        { id: 'job-timeout.html', type: 'http', store: 'test-store', options: { url: 'https://www.google.com', timeout: 5000 } }
      ]
    })
    .catch(error => {
      expect(error).toExist()
      done()
    })
  })
  // Let enough time to fail
  .timeout(10000)

  it('creates a fault-tolerant failed HTTP job (403)', () => {
    nock('https://www.google.com')
    .get('/')
    .reply(403)
    return jobsService.create({
      id: 'job',
      options: { faultTolerant: true },
      tasks: [
        { id: 'job-403-fault-tolerant.html', type: 'http', store: 'test-store', options: { url: 'https://www.google.com' } }
      ]
    })
    .then(tasks => {
      expect(tasks).toExist()
      expect(tasks.length).to.equal(1)
    })
  })
  // Let enough time to fail
  .timeout(5000)

  it('creates a fault-tolerant failed HTTP task in job (403)', () => {
    nock('https://www.google.com')
    .get('/')
    .reply(403)
    return jobsService.create({
      id: 'job',
      tasks: [
        { id: 'job-403-fault-tolerant.html', type: 'http', store: 'test-store', faultTolerant: true, options: { url: 'https://www.google.com' } }
      ]
    })
    .then(tasks => {
      expect(tasks).toExist()
      expect(tasks.length).to.equal(1)
    })
  })
  // Let enough time to fail
  .timeout(5000)

  it('creates a WCS job', (done) => {
    let datetime = moment.utc()
    datetime.startOf('day')
    jobsService.create({
      id: 'job',
      options: {
        workersLimit: 2
      },
      taskTemplate: {
        store: 'test-store',
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
      storage.exists('job-20.tif', (error, exist) => {
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
  .timeout(15000)

  // Cleanup
  after(() => {
    if (server) server.close()
  })
})
