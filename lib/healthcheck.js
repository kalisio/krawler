import request from 'request'
import path, { dirname } from 'path'
import utils from 'util'

import fs from 'fs-extra'
import _ from 'lodash'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const logFile = path.join(__dirname, '..', 'healthcheck.log')

// Global structure used to manage healthcheck state for cron jobs
export const Healthcheck = {
  isRunning: false, // Flag indicating if job is currently running for cron jobs
  nbSkippedJobs: 0, // Number of times the scheduled job has been skipped due to on-going one
  error: null // Indicating error if job has erroned for cron jobs
  /* Undefined by default
  nbFailedTasks: 0, // Number of failed/success tasks of last run for fault-tolerant jobs
  nbSuccessfulTasks: 0,
  successRate: 0 // Ratio of previous values
  */
}

export class HealthcheckError extends Error {}

function readFromLog () {
  try {
    if (fs.pathExistsSync(logFile)) return fs.readJsonSync(logFile)
    else return {} // First launch
  } catch (error) {
    // Allowed to fail to make healthcheck robust
    console.error(error)
    return {}
  }
}

function writeToLog (data) {
  try {
    fs.writeJsonSync(logFile, data)
  } catch (error) {
    // Allowed to fail to make healthcheck robust
    console.error(error)
  }
}

function publishToConsole (data, compilers, pretext, stream = 'error') {
  try {
    if (stream === 'error') console.error(pretext, compilers.message(data))
    else console.log(pretext, compilers.message(data))
  } catch (error) {
    // Allowed to fail to make healthcheck robust
    console.error(error)
  }
}

async function publishToSlack (slackWebhook, data, compilers, posttext = '', color = 'danger') {
  if (!slackWebhook) return
  try {
    const message = compilers.message(data)
    const link = compilers.link(data)
    const text = link ? `<${link}|${message}${posttext}>` : `${message}${posttext}`

    await utils.promisify(request.post)({
      url: slackWebhook,
      body: JSON.stringify({
        attachments: [
          {
            color,
            mrkdwn_in: ['text'],
            text
          }
        ]
      })
    })
  } catch (error) {
    // Allowed to fail to make healthcheck robust
    console.error(error)
  }
}

function isSameError (previousError, error) {
  return (_.has(previousError, 'code') && _.has(error, 'code')
    ? _.isEqual(_.get(previousError, 'code'), _.get(error, 'code'))
    : _.isEqual(_.get(previousError, 'message'), _.get(error, 'message')))
}

export async function healthcheck (options) {
  const endpoint = `http://localhost:${options.port}${options.api ? options.apiPrefix : ''}/healthcheck`
  const compilers = {
    message: _.template(options.messageTemplate),
    link: _.template(options.linkTemplate),
    origin: _.template(options.messageOrigin)
  }
  let previousError
  try {
    const previousHealthcheck = readFromLog()
    previousError = previousHealthcheck.error
    if (options.debug) {
      console.log('Requesting healthcheck endpoint', endpoint)
    }
    const response = await utils.promisify(request.get)(endpoint)
    const data = JSON.parse(response.body)
    if (options.debug) {
      console.log('Current healthcheck output read from service', data)
      console.log('Previous healthcheck output read from log', previousHealthcheck)
    }
    if (response.statusCode === 200) {
      // Fault-tolerant jobs always return 200, we use more criteria to check for health status
      if (_.has(data, 'successRate') && (data.successRate < options.successRate)) {
        data.error = { code: 'HEALTHCHECK_SUCCESS_RATE', message: `Insufficient success rate (${data.successRate.toFixed(2)})` }
      }
      if (data.nbSkippedJobs >= options.nbSkippedJobs) {
        data.error = { code: 'HEALTHCHECK_SKIPPED_JOBS', message: `Too much skipped jobs (${data.nbSkippedJobs})` }
      }
      if ((options.maxDuration > 0) && (data.duration > options.maxDuration)) {
        data.error = { code: 'HEALTHCHECK_DURATION', message: `Too much slow execution (${data.duration}s)` }
      }
    }
    writeToLog(data)
    // Add env available for templates
    Object.assign(data, process.env)
    if (data.error) {
      // Only notify on new errors
      if (!previousError || !isSameError(previousError, data.error)) {
        publishToConsole(data, compilers, '[ALERT]', 'error')
        await publishToSlack(options.slackWebhook, data, compilers, '', 'danger')
      }
      throw new HealthcheckError(data.error.message)
    } else {
      // Only notify on closing errors
      if (previousError) {
        data.error = previousError
        publishToConsole(data, compilers, '[CLOSED ALERT]', 'log')
        await publishToSlack(options.slackWebhook, data, compilers, ' [RESOLVED]', 'good')
      }
    }
  } catch (error) {
    // Give feedback for any error raised by the healthcheck process
    if (!error instanceof HealthcheckError) {
      // Set jobId variable/error available in context so that templates will not fail
      const data = Object.assign({ jobId: '' }, { error: _.pick(error, ['code', 'message']) })
      writeToLog(data)
      // Add env available for templates
      Object.assign(data, process.env)
      // Only notify on new errors
      if (!previousError || !isSameError(previousError, data.error)) {
        publishToConsole(data, compilers, '[ALERT]', 'error')
        await publishToSlack(options.slackWebhook, data, compilers, '', 'danger')
      }
    }
    throw error
  }
}
