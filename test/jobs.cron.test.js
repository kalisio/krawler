import chai from 'chai'
import chailint from 'chai-lint'
import path, { dirname } from 'path'
import request from 'request'
import utils from 'util'
import moment from 'moment'
import { cli } from '../lib/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

describe('krawler:jobs:cron', () => {
  let appServer

  before(async () => {
    chailint(chai, util)
  })

  it('skipped job as CRON raises error', async () => {
    let count = 0
    appServer = await cli({
      id: 'job',
      tasks: [{ id: 'task', type: 'http', store: 'job-store', options: { url: 'https://www.google.com' } }],
      hooks: {
        tasks: {
          before: {
            apply: {
              function: async () => {
                if (count === 0) {
                  await utils.promisify(setTimeout)(10000)
                  count++
                }
              }
            }
          }
        },
        jobs: {
          before: {
            createStores: {
              id: 'job-store',
              type: 'fs',
              options: { path: path.join(__dirname, 'output') }
            }
          }
        }
      }
    }, {
      port: 3030,
      cron: '*/5 * * * * *',
      nbSkippedJobs: 1,
      messageTemplate: process.env.MESSAGE_TEMPLATE,
      debug: false,
      slackWebhook: process.env.SLACK_WEBHOOK_URL
    })
    // As it runs every 5 seconds wait until it should have ran at least twice
    const seconds = Math.floor(moment().seconds())
    const remainingSecondsForNextRun = 5 - seconds % 5
    await utils.promisify(setTimeout)((6 + remainingSecondsForNextRun) * 1000)
    // Check for error with healthcheck
    {
      const response = await utils.promisify(request.get)('http://localhost:3030/healthcheck')
      const healthcheck = JSON.parse(response.body)
      // console.log(healthcheck)
      expect(response.statusCode).to.equal(500)
      expect(healthcheck.isRunning).beTrue()
      expect(healthcheck.duration).beUndefined()
      expect(healthcheck.nbSkippedJobs).to.be.at.least(1)
      expect(healthcheck.nbFailedTasks).beUndefined()
      expect(healthcheck.nbSuccessfulTasks).beUndefined()
      expect(healthcheck.successRate).beUndefined()
      expect(healthcheck.error).toExist()
      expect(healthcheck.error.message).toExist()
      expect(healthcheck.error.message.includes('Too much skipped jobs')).beTrue()
    }
    await utils.promisify(setTimeout)(5000)
    // Now it should have finished
    {
      const response = await utils.promisify(request.get)('http://localhost:3030/healthcheck')
      const healthcheck = JSON.parse(response.body)
      // console.log(healthcheck)
      expect(response.statusCode).to.equal(200)
      expect(healthcheck.isRunning).beFalse()
      expect(healthcheck.duration).toExist()
      expect(healthcheck.nbSkippedJobs).to.equal(0)
      expect(healthcheck.nbFailedTasks).to.equal(0)
      expect(healthcheck.nbSuccessfulTasks).to.equal(1)
      expect(healthcheck.successRate).to.equal(1)
      expect(healthcheck.error).beUndefined()
    }
  })
  // Let enough time to process
    .timeout(30000)

  // Cleanup
  after(async () => {
    if (appServer) await appServer.close()
  })
})
