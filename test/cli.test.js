import chai from 'chai'
import chailint from 'chai-lint'
import path, { dirname } from 'path'
import _ from 'lodash'
import moment from 'moment'
import request from 'request'
import utils from 'util'
import fs from 'fs-extra'
import mongodb from 'mongodb'
import { exec } from 'child_process'
import { cli, getApp } from '../lib/index.js'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { MongoClient } = mongodb
const { util, expect, assert } = chai
// Can't use promisify here otherwise on error cases we cannot access stdout/stderr

async function runCommand (command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr })
    })
  })
}

describe('krawler:cli', () => {
  const jobfilePath = pathToFileURL(path.join(__dirname, 'data', 'jobfile.cjs'))
  let jobfile, outputPath, client, collection, appServer

  before(async () => {
    chailint(chai, util)
    jobfile = (await import(jobfilePath)).default
    outputPath = _.get(jobfile, 'hooks.jobs.before.createStores[0].options.path')
    client = await MongoClient.connect('mongodb://127.0.0.1:27017/krawler-test', { useNewUrlParser: true })
    client.db = client.db('krawler-test')
  })

  it('runs successfully once using CLI', async () => {
    try {
      const tasks = await cli(jobfile, { port: 3030, messageTemplate: 'Job <%= jobId %>: <%= error.message %>', debug: true })
      // All other features should have been tested independently
      // so we just test here the CLI run correctly
      expect(tasks.length).to.equal(1)
      // Check intermediate products have been erased and final product are here
      expect(fs.existsSync(path.join(outputPath, 'RJTT-30-18000-2-1.tif'))).beFalse()
      expect(fs.existsSync(path.join(outputPath, 'RJTT-30-18000-2-1.tif.csv'))).beTrue()
    } catch (error) {
      assert.fail('Healthcheck should not fail')
    }
  })
  // Let enough time to process
    .timeout(10000)

  it('runs unsuccessfully once using CLI', async () => {
    try {
      await cli(jobfile, { port: 3030, maxDuration: 0, messageTemplate: 'Job <%= jobId %>: <%= error.message %>', debug: true })
      assert.fail('Healthcheck should fail')
    } catch (error) {
      // Check intermediate products have been erased and final product are here
      expect(fs.existsSync(path.join(outputPath, 'RJTT-30-18000-2-1.tif'))).beFalse()
      expect(fs.existsSync(path.join(outputPath, 'RJTT-30-18000-2-1.tif.csv'))).beTrue()
    }
  })
  // Let enough time to process
    .timeout(10000)

  it('runs as API using CLI', async () => {
    try {
      // Clean previous test output
      fs.removeSync(path.join(outputPath, 'RJTT-30-18000-2-1.tif.csv'))
      appServer = await cli(jobfile, { mode: 'setup', api: true, apiPrefix: '/api', port: 3030 })
      // Submit a job to be run
      const response = await utils.promisify(request.post)({
        url: 'http://localhost:3030/api/jobs',
        body: {
          id: 'job',
          store: 'job-store',
          tasks: [{
            id: 'RJTT-30-18000-2-1.tif',
            type: 'store',
            options: {
              store: 'task-store'
            }
          }]
        },
        json: true
      })
      const tasks = response.body
      await appServer.close()
      expect(tasks.length).to.equal(1)
      // Check intermediate products have been erased and final product are here
      expect(fs.existsSync(path.join(outputPath, 'RJTT-30-18000-2-1.tif'))).beFalse()
      expect(fs.existsSync(path.join(outputPath, 'RJTT-30-18000-2-1.tif.csv'))).beTrue()
    } catch (error) {
      console.log(error)
      assert.fail('Healthcheck should not fail')
    }
  })
  // Let enough time to process
    .timeout(15000)

  it('runs as CRON using CLI with continuous healthcheck', (done) => {
    // Clean previous test output
    fs.removeSync(path.join(outputPath, 'RJTT-30-18000-2-1.tif.csv'))
    // Setup the app
    cli(jobfile, {
      mode: 'setup',
      sync: 'mongodb://127.0.0.1:27017/krawler-test',
      cron: '*/10 * * * * *'
    })
      .then(server => {
        appServer = server
        // Clean any previous healthcheck log
        fs.removeSync(path.join(__dirname, '..', 'healthcheck.log'))
        const app = getApp()
        // Add hook to know how many times the job will run
        const jobService = app.service('jobs')
        let runCount = 0
        jobService.hooks({
          after: {
            create: (hook) => {
              runCount++
              // First run is fine, second one raises an error
              if (runCount === 1) return hook
              else throw new Error('Error')
            }
          }
        })
        // Check for event emission
        let eventCount = 0
        app.on('krawler', event => {
          if ((event.name === 'task-done') || (event.name === 'job-done')) eventCount++
        })
        // Only run as we already setup the app
        cli(jobfile, { mode: 'runJob', cron: '*/10 * * * * *', run: true })
          .then(async () => {
            // As it runs every 10 seconds wait until it should have ran at least once again
            const seconds = Math.floor(moment().seconds())
            const remainingSecondsForNextRun = 11 - seconds % 10
            setTimeout(async () => {
              try {
                expect(runCount).to.equal(2) // 2 runs
                const response = await utils.promisify(request.get)('http://localhost:3030/healthcheck')
                console.log(response.body)
                expect(response.statusCode).to.equal(500)
                const { error, stdout, stderr } = await runCommand('node ' + path.join(__dirname, '..', 'healthcheck.js'))
                expect(error).toExist()
                expect(stdout).to.equal('')
                expect(stderr.includes('[ALERT]')).beTrue()
                const healthcheckLog = fs.readJsonSync(path.join(__dirname, '..', 'healthcheck.log'))
                const healthcheck = JSON.parse(response.body)
                console.log(healthcheck)
                expect(healthcheck).to.deep.equal(healthcheckLog)
                expect(healthcheck.isRunning).beUndefined()
                expect(healthcheck.duration).beUndefined()
                expect(healthcheck.nbSkippedJobs).beUndefined()
                expect(healthcheck.nbFailedTasks).beUndefined()
                expect(healthcheck.nbSuccessfulTasks).beUndefined()
                expect(healthcheck.successRate).beUndefined()
                expect(healthcheck.error).toExist()
                expect(healthcheck.error.message).toExist()
                expect(healthcheck.error.message).to.equal('Error')
                expect(eventCount).to.equal(4) // 4 events
                collection = client.db.collection('krawler-events')
                const taskEvents = await collection.find({ event: 'task-done' }).toArray()
                expect(taskEvents.length).to.equal(2)
                const jobEvents = await collection.find({ event: 'job-done' }).toArray()
                expect(jobEvents.length).to.equal(2)
                server.close()
                appServer = null
                done()
              } catch (error) {
                console.log(error)
                done(error)
              }
            }, remainingSecondsForNextRun*1000)
            expect(runCount).to.equal(1) // First run
            const response = await utils.promisify(request.get)('http://localhost:3030/healthcheck')
            expect(response.statusCode).to.equal(200)
            const { error, stdout, stderr } = await runCommand('node ' + path.join(__dirname, '..', 'healthcheck.js'))
            expect(error).to.equal(null)
            expect(stdout).to.equal('')
            expect(stderr).to.equal('')
            const healthcheckLog = fs.readJsonSync(path.join(__dirname, '..', 'healthcheck.log'))
            const healthcheck = JSON.parse(response.body)
            expect(healthcheck).to.deep.equal(healthcheckLog)
            expect(healthcheck.isRunning).toExist()
            expect(healthcheck.nbSkippedJobs).toExist()
            expect(healthcheck.error).beUndefined()
            expect(healthcheck.nbFailedTasks).to.equal(0)
            expect(healthcheck.nbSuccessfulTasks).to.equal(1)
            expect(healthcheck.successRate).to.equal(1)
            expect(healthcheck.state).toExist()
            expect(eventCount).to.equal(2) // 2 events
            collection = client.db.collection('krawler-events')
            const taskEvents = await collection.find({ event: 'task-done' }).toArray()
            expect(taskEvents.length).to.equal(1)
            const jobEvents = await collection.find({ event: 'job-done' }).toArray()
            expect(jobEvents.length).to.equal(1)
          })
      })
  })
  // Let enough time to process
    .timeout(15000)

  // Cleanup
  after(async () => {
    fs.removeSync(path.join(__dirname, '..', 'healthcheck.log'))
    if (collection) await collection.drop()
    if (client) await client.close()
    if (appServer) await appServer.close()
  })
})
