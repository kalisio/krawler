import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import path from 'path'
import nock from 'nock'
import moment from 'moment'
import plugin from '../src'
import { hooks as pluginHooks } from '../src'

describe('krawler:jobs', () => {
  let app, server, storage, storesService, jobsService, tasksService

  before(() => {
    chailint(chai, util)
    app = express(feathers())
    app.configure(plugin())
    server = app.listen(3030)
  })

  it('creates the jobs service', () => {
    app.use('stores', plugin.stores())
    storesService = app.service('stores')
    app.use('tasks', plugin.tasks())
    tasksService = app.service('tasks')
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

  it('creates a failed HTTP job (task with 403 status)', (done) => {
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

  it('creates a failed HTTP job (task reaching timeout)', (done) => {
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

  it('creates a fault-tolerant failed HTTP job (task with 403 status)', () => {
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
        expect(tasks[0].error).toExist()
      })
  })
  // Let enough time to fail
    .timeout(5000)

  it('creates a fault-tolerant failed HTTP job (global timeout)', (done) => {
    nock('https://www.google.com')
      .get('/')
      .delay(5000)
      .reply(200, '<html></html>')
    jobsService.create({
      id: 'job',
      options: { faultTolerant: true, timeout: 1 },
      tasks: [
        { id: 'job-403-fault-tolerant.html', type: 'http', store: 'test-store', options: { url: 'https://www.google.com', timeout: 3000 } }
      ]
    })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Timeout')
        done()
      })
  })
  // Let enough time to fail
    .timeout(7000)

  it('creates a fault-tolerant failed HTTP task in job (task with 403 status)', () => {
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

  it('creates a job retrying to success after a failed HTTP 403 status task', () => {
    nock('https://www.google.com').get('/').reply(403)
    nock('https://www.google.com').get('/').reply(403)
    nock('https://www.google.fr').get('/').reply(200)
    return jobsService.create({
      id: 'job',
      tasks: [
        {
          id: 'job-403-fault-tolerant.html',
          type: 'http',
          store: 'test-store',
          options: { url: 'https://www.google.com' },
          attemptsLimit: 3,
          attemptsOptions: [{}, { options: { url: 'https://www.google.fr' } }]
        }
      ]
    })
      .then(tasks => {
        expect(tasks).toExist()
        expect(tasks.length).to.equal(1)
        expect(tasks[0].options.url).to.equal('https://www.google.fr')
      })
  })
  // Let enough time to fail
    .timeout(5000)

  it('creates a WCS job', (done) => {
    const datetime = moment.utc()
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
          url: 'https://geoservices.meteofrance.fr/services/MF-NWP-GLOBAL-ARPEGE-025-GLOBE-WCS',
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
        console.log(error)
        done()
      })
  })
  // Let enough time to download
    .timeout(60000)

  // Add hooks and defaults to no error raised
  let raise = 'none'
  it('Add hooks to task service', () => {
    pluginHooks.activateHooks({
      after: {
        applyProcessed: {
          hook: 'apply',
          function: (item) => { item.state = 'processed' }
        }
      },
      before: {
        applyError: {
          hook: 'apply',
          function: (item) => {
            if (raise !== 'error') return
            throw new Error('apply error')
          }
        },
        applyTolerantError: {
          hook: 'apply',
          function: (item) => {
            if (raise !== 'fault-tolerant') return
            throw new Error('apply error')
          },
          faultTolerant: true
        }
      }
    }, tasksService)
  })
  
  it('creates a job with task hooks', () => {
    return jobsService.create({
      id: 'job',
      tasks: [
        { id: 'job-apply.html', type: 'noop' }
      ]
    })
      .then(tasks => {
        expect(tasks).toExist()
        expect(tasks.length).to.equal(1)
        expect(tasks[0].state).to.equal('processed')
      })
  })
  // Let enough time to fail
    .timeout(5000)

  it('creates a failed job with task hooks', (done) => {
    raise = 'error'
    jobsService.create({
      id: 'job',
      tasks: [
        { id: 'job-apply-error.html', type: 'noop' }
      ]
    })
      .catch(error => {
        expect(error).toExist()
        expect(error.message).to.equal('apply error')
        done()
      })
  })
  // Let enough time to fail
    .timeout(5000)

  it('creates a failed job with fault-tolerant task hooks', () => {
    raise = 'fault-tolerant'
    jobsService.create({
      id: 'job',
      tasks: [
        { id: 'job-apply-error.html', type: 'noop' }
      ]
    })
      .then(tasks => {
        expect(tasks).toExist()
        expect(tasks.length).to.equal(1)
        expect(tasks[0].state).to.equal('processed')
      })
  })
  // Let enough time to fail
    .timeout(5000)

  // Cleanup
  after(() => {
    if (server) server.close()
  })
})
