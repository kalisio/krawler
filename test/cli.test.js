import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import path from 'path'
import _ from 'lodash'
import fsStore from 'fs-blob-store'
import { cli, getApp } from '../src'

describe('krawler:cli', () => {
  const jobfilePath = path.join(__dirname, 'data', 'jobfile.js')
  const jobfile = require(jobfilePath)
  const outputPath = _.get(jobfile, 'hooks.jobs.before.createStores[0].options.path')
  let store = fsStore({ path: outputPath })

  before(() => {
    chailint(chai, util)
  })

  it('runs once using CLI', (done) => {
    cli(jobfile)
    .then(tasks => {
      // All other features should have been tested independently
      // so we just test here the CLI run correctly
      expect(tasks.length > 0).beTrue()
      // Check intermediate products have been erased and final product are here
      store.exists('RJTT-30-18000-2-1.tif', (error, exist) => {
        if (error) {
          done(error)
          return
        }
        if (exist) {
          done(new Error('Intermediate file found in store'))
          return
        }

        store.exists('RJTT-30-18000-2-1.tif.csv', (error, exist) => {
          if (error) done(error)
          else done(exist ? null : new Error('Product file not found in store'))
        })
      })
    })
  })
  // Let enough time to process
  .timeout(10000)

  it('runs as CRON using CLI', (done) => {
    // Setup the app
    cli(jobfile, { mode: 'setup' })
    .then(server => {
      let app = getApp()
      // Add hook to know how many times the job will run
      let jobService = app.service('jobs')
      let count = 0
      jobService.hooks({
        after: {
          create: (hook) => {
            count++
            return hook
          }
        }
      })
      // Only run as we already setup the app
      // As it runs every 15 seconds we know that in 20s it has ran at least once again
      cli(jobfile, { cron: '*/15 * * * * *', mode: 'runJob' })
      setTimeout(() => {
        server.close()
        expect(count).to.be.at.least(2)
        done()
      }, 20000)
    })
  })
  // Let enough time to process
  .timeout(30000)
})
