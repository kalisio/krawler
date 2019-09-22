import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import path from 'path'
import _ from 'lodash'
import request from 'request'
import utils from 'util'
import fs from 'fs-extra'
import { MongoClient } from 'mongodb'
import { cli, getApp } from '../src'
// Can't use promisify here otherwise on error cases we cannot access stdout/stderr
const exec = require('child_process').exec
async function runCommand (command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr })
    })
  })
}

describe('krawler:cli', () => {
  const jobfilePath = path.join(__dirname, 'data', 'jobfile.js')
  const jobfile = require(jobfilePath)
  const outputPath = _.get(jobfile, 'hooks.jobs.before.createStores[0].options.path')
  let client, collection, appServer

  before(async () => {
    chailint(chai, util)
    client = await MongoClient.connect('mongodb://127.0.0.1:27017/krawler-test', { useNewUrlParser: true })
    client.db = client.db('krawler-test')
  })

  it('runs once using CLI', async () => {
    const tasks = await cli(jobfile)
    // All other features should have been tested independently
    // so we just test here the CLI run correctly
    expect(tasks.length).to.equal(1)
    // Check intermediate products have been erased and final product are here
    expect(fs.existsSync(path.join(outputPath, 'RJTT-30-18000-2-1.tif'))).beFalse()
    expect(fs.existsSync(path.join(outputPath, 'RJTT-30-18000-2-1.tif.csv'))).beTrue()
  })
  // Let enough time to process
    .timeout(10000)

  it('runs as CRON using CLI with healthcheck', (done) => {
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
        // As it runs every 10 seconds we know that in 20s it has ran at least once again
        cli(jobfile, { mode: 'runJob', cron: '*/10 * * * * *' })
        setTimeout(async () => {
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
        }, 10000)
        setTimeout(async () => {
          expect(runCount).to.equal(2) // 2 runs
          const response = await utils.promisify(request.get)('http://localhost:3030/healthcheck')
          expect(response.statusCode).to.equal(500)
          const { error, stdout, stderr } = await runCommand('node ' + path.join(__dirname, '..', 'healthcheck.js'))
          expect(error).toExist()
          expect(stdout).to.equal('')
          expect(stderr.includes('[ALERT]')).beTrue()
          const healthcheckLog = fs.readJsonSync(path.join(__dirname, '..', 'healthcheck.log'))
          const healthcheck = JSON.parse(response.body)
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
        }, 20000)
      })
  })
  // Let enough time to process
    .timeout(25000)

  // Cleanup
  after(async () => {
    fs.removeSync(path.join(__dirname, '..', 'healthcheck.log'))
    if (collection) await collection.drop()
    if (client) await client.close()
    if (appServer) await appServer.close()
  })
})
