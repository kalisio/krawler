import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import path from 'path'
import _ from 'lodash'
import fsStore from 'fs-blob-store'
import { krawler, run } from '../src'

describe('krawler:cli', () => {
  const jobfilePath = path.join(__dirname, 'data', 'jobfile.js')
  const jobfile = require(jobfilePath)
  const outputPath = _.get(jobfile, 'hooks.jobs.before.createStores[0].options.path')
  let store = fsStore({ path: outputPath })

  before(() => {
    chailint(chai, util)
  })

  it('runs as CLI', (done) => {
    let job = krawler(jobfilePath)
    run(job)
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
})
