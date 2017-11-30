import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import path from 'path'
import { run } from '../src'

describe('krawler:cli', () => {
  before(() => {
    chailint(chai, util)
  })

  it('runs as CLI', () => {
    const jobfile = path.join(__dirname, 'data', 'jobfile.js')
    return run(jobfile)
    .then(tasks => {
      // All other features should have been tested independently
      // so we just test here the CLI run correctly
      expect(tasks.length > 0).beTrue()
    })
  })
  // Let enough time to process
  .timeout(10000)
})
