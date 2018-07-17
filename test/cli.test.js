import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import path from 'path'
import _ from 'lodash'
import fs from 'fs'
import { MongoClient } from 'mongodb'
import { cli, getApp } from '../src'

describe('krawler:cli', () => {
  const jobfilePath = path.join(__dirname, 'data', 'jobfile.js')
  const jobfile = require(jobfilePath)
  const outputPath = _.get(jobfile, 'hooks.jobs.before.createStores[0].options.path')
  let client, collection

  before(async () => {
    chailint(chai, util)
    client = await MongoClient.connect('mongodb://127.0.0.1:27017/krawler-test')
    client.db = client.db('krawler-test')
  })

  it('runs once using CLI', (done) => {
    cli(jobfile)
    .then(tasks => {
      // All other features should have been tested independently
      // so we just test here the CLI run correctly
      expect(tasks.length).to.equal(1)
      // Check intermediate products have been erased and final product are here
      expect(fs.existsSync(path.join(outputPath, 'RJTT-30-18000-2-1.tif'))).beFalse()
      expect(fs.existsSync(path.join(outputPath, 'RJTT-30-18000-2-1.tif.csv'))).beTrue()
      done()
    })
  })
  // Let enough time to process
  .timeout(10000)

  it('runs as CRON using CLI', (done) => {
    // Setup the app
    cli(jobfile, { mode: 'setup', sync: 'mongodb://127.0.0.1:27017/krawler-test' })
    .then(server => {
      let app = getApp()
      // Add hook to know how many times the job will run
      let jobService = app.service('jobs')
      let runCount = 0
      jobService.hooks({
        after: {
          create: (hook) => {
            runCount++
            return hook
          }
        }
      })
      // Check for event emission
      let eventCount = 0
      app.on('krawler', event => {
        if ((event.type === 'task-done') || (event.type === 'job-done')) eventCount++
      })
      // Only run as we already setup the app
      // As it runs every 15 seconds we know that in 20s it has ran at least once again
      cli(jobfile, { cron: '*/15 * * * * *', mode: 'runJob' })
      setTimeout(() => {
        expect(runCount).to.be.at.least(2) // 2 runs
        expect(eventCount).to.be.at.least(4) // 4 events
        collection = client.db.collection('events')
        collection.find({ 'message.type': { $exists: true } }).toArray()
        .then(results => {
          expect(results.length).to.be.at.least(4)
          results.forEach(result => {
            expect(result.event).to.satisfy(event => event === 'tasks krawler' || event === 'jobs krawler')
            expect(result.message.type).to.satisfy(type => type === 'task-done' || type === 'job-done')
          })
          server.close()
          done()
        })
      }, 20000)
    })
  })
  // Let enough time to process
  .timeout(30000)

  // Cleanup
  after(() => {
    collection.drop()
  })
})
