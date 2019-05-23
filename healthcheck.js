const request = require('request')
const program = require('commander')
const utils = require('util')
const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')

program
    .usage('[options]')
    .option('-a, --api', 'Setup as web app by exposing an API')
    .option('-ap, --api-prefix [prefix]', 'When exposed as an API change the prefix (defaults to /api)', '/api')
    .option('-po, --port [port]', 'Change the port to be used (defaults to 3030)', 3030)
    .option('-sr, --success-rate [rate]', 'Change the success rate for fault-tolerant jobs to be considered as successful (defaults to 1)', 1)
    .option('-md, --max-duration [duration]', 'Change the maximum run duration in seconds for fault-tolerant jobs to be considered as failed (defaults to unset)', -1)
    .option('-nsj, --nb-skipped-jobs [nb]', 'Change the number of skipped runs for fault-tolerant jobs to be considered as failed (defaults to 3)', 3)
    .option('-sw, --slack-webhook [url]', 'Slack webhook URL to post messages on failure', process.env.SLACK_WEBHOOK_URL)
    .option('-mt, --message-template [template]', 'Message template used on failure', 'Job <%= jobId %>: <%= error.message %>')
    .option('-lt, --link-template [template]', 'Link template used on failure', '')
    .option('-d, --debug', 'Verbose output for debugging')
    .parse(process.argv)

const logFile = path.join(__dirname, 'healthcheck.log')

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

async function publishToSlack (data, compilers, pretext, color = 'danger') {
  if (!program.slackWebhook) return
  try {
    const message = compilers.message(data)
    const link = compilers.link(data)
    let attachment = {
      title: message,
      color: color
    }
    if (link) {
      attachment.title_link = link
    }
    await utils.promisify(request.post)({
      url: program.slackWebhook,
      body: JSON.stringify({
        text: `*${pretext} krawler healthcheck*`,
        attachments: [attachment]
      })
    })
  } catch (error) {
    // Allowed to fail to make healthcheck robust
    console.error(error)
  }
}

function isSameError (previousError, error) {
  return (_.has(previousError, 'code') && _.has(error, 'code') ?
    _.isEqual(_.get(previousError, 'code'), _.get(error, 'code')) :
    _.isEqual(_.get(previousError, 'message'), _.get(error, 'message')))
}

async function healthcheck () {
  const endpoint = `http://localhost:${program.port}${program.api ? program.apiPrefix : ''}/healthcheck`
  const compilers = {
    message: _.template(program.messageTemplate),
    link: _.template(program.linkTemplate)
  }
  let previousError
  try {
    const previousHealthcheck = readFromLog()
    previousError = previousHealthcheck.error
    const response = await utils.promisify(request.get)(endpoint)
    let data = JSON.parse(response.body)
    if (program.debug) {
      console.log('Current healthcheck output read from service', data)
      console.log('Previous healthcheck output read from log', previousHealthcheck)
    }
    if (response.statusCode === 200) {
      // Fault-tolerant jobs always return 200, we use more criteria to check for health status
      if (_.has(data, 'successRate') && (data.successRate < program.successRate)) {
        data.error = { code: 'HEALTHCHECK_SUCCESS_RATE', message: `Insufficient success rate (${data.successRate.toFixed(2)})` }
      }
      if (data.nbSkippedJobs >= program.nbSkippedJobs) {
        data.error = { code: 'HEALTHCHECK_SKIPPED_JOBS', message: `Too much skipped jobs (${data.nbSkippedJobs})` }
      }
      if ((program.maxDuration > 0) && (data.duration > program.maxDuration)) {
        data.error = { code: 'HEALTHCHECK_DURATION', message: `Too much slow execution (${data.duration}s)` }
      }
    }
    writeToLog(data)
    // Add env available for templates
    Object.assign(data, process.env)
    if (data.error) {
      // Only notify on new errors
      if (!previousError || !_.isSameError(previousError, data.error)) {
        publishToConsole(data, compilers, '[NEW ALERT]', 'error')
        await publishToSlack(data, compilers, '[NEW ALERT]', 'danger')
      }
      process.exit(1)
    } else {
      // Only notify on closing errors
      if (previousError) {
        data.error = previousError
        publishToConsole(data, compilers, '[CLOSED ALERT]', 'log')
        await publishToSlack(data, compilers, '[CLOSED ALERT]', 'good')
      }
      process.exit(0)
    }
  } catch (error) {
    // Set jobId variable available in context so that templates will not fail
    let data = Object.assign({ jobId: '' }, _.pick(error, ['error.code', 'error.message']))
    writeToLog(data)
    // Add env available for templates
    Object.assign(data, process.env)
    // Only notify on new errors
    if (!previousError || !_.isSameError(previousError, data.error)) {
      publishToConsole(data, compilers, '[NEW ALERT]', 'error')
      await publishToSlack(data, compilers, '[NEW ALERT]', 'danger')
    }
    process.exit(1)
  }
}

healthcheck()
