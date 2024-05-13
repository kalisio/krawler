import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import { pathToFileURL, fileURLToPath } from 'url'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import socketio from '@feathersjs/socketio'
import common from 'feathers-hooks-common'
import distribution from '@kalisio/feathers-distributed'
import mubsub from 'mubsub-es'
import program from 'commander'
import cron from 'cron'
import makeDebug from 'debug'
import * as hooks from './hooks/index.js'
import { stores, tasks, jobs } from './services/index.js'
import { healthcheck, Healthcheck } from './healthcheck.js'
import plugin from './plugin.js'

const { CronJob } = cron
const { disallow } = common
const { rest } = express
const debug = makeDebug('krawler:cli')
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Create default services used by CLI
export const StoresService = stores()
export const TasksService = tasks()
export const JobsService = jobs()
export let app
let server

// Register all default hooks
_.forOwn(hooks, (hook, name) => hooks.registerHook(name, hook))

export async function createApp (job, options = {}) {
  debug('Initializing krawler application')
  app = express(feathers())
  // Enable CORS, security, compression, and body parsing
  app.use(cors())
  app.use(helmet())
  app.use(compress())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  const apiPrefix = (options.api ? options.apiPrefix : '')
  debug('API prefix ' + apiPrefix)
  app.configure(rest())
  app.configure(socketio({
    path: apiPrefix + 'ws',
    transports: ['websocket']
  }))
  // Env var can be overridden by option
  const sync = options.sync || process.env.SYNC_DB_URL
  if (sync) {
    app.sync = mubsub(sync)
    const channel = app.sync.channel('krawler-events')
    app.on('krawler', (event) => {
      channel.publish(event.name, event.data)
    })
  }
  // Let krawler retirve distributed services
  if (_.has(job, 'options.distribution')) {
    app.configure(distribution(Object.assign({
      // Distribute no services simply use remote ones by default
      services: (service) => false,
      key: 'krawler',
      healthcheckPath: apiPrefix + '/distribution/'
    }, _.get(job, 'options.distribution'))))
  }
  app.configure(plugin())
  // In API mode everything is open, otherwise only health check is
  app.use('/', (req, res, next) => {
    if (options.api) next()
    else if (req.originalUrl.endsWith('/healthcheck')) next()
    else res.sendStatus(401)
  })
  // Add a healthcheck for cron jobs
  app.get(apiPrefix + '/healthcheck', (req, res, next) => {
    if (Healthcheck.error) {
      res.status(500).json(_.pick(Healthcheck, ['jobId', 'error.code', 'error.message']))
    } else {
      res.status(200).json(_.omit(Healthcheck, ['error']))
    }
  })
  // Setup default services used by CLI
  TasksService.storesService = apiPrefix + '/stores'
  JobsService.storesService = apiPrefix + '/stores'
  JobsService.tasksService = apiPrefix + '/tasks'
  app.use(apiPrefix + '/stores', StoresService)
  app.use(apiPrefix + '/tasks', TasksService)
  app.use(apiPrefix + '/jobs', JobsService)
  // In API mode everything is open, otherwise only health check is
  if (!options.api) {
    app.service(apiPrefix + '/stores').hooks({ before: { all: [disallow('external')] } })
    app.service(apiPrefix + '/tasks').hooks({ before: { all: [disallow('external')] } })
    app.service(apiPrefix + '/jobs').hooks({ before: { all: [disallow('external')] } })
  } else {
    // Keep track of options and task template as in this case the job is not executed
    // but only the hooks are processed when initializing the app
    JobsService.jobOptions = job.options
    JobsService.taskTemplate = job.taskTemplate
  }
  // Process hooks
  _.forOwn(job.hooks, (value, key) => {
    const service = app.service(apiPrefix + '/' + key)
    hooks.activateHooks(value, service)
  })
  // Run the app, this is required to correctly setup Feathers
  const port = options.port || 3030
  if (options.api) console.log('Server listening to ' + port)
  server = await app.listen(port)
  if (sync) {
    server.on('close', () => app.sync.close())
  }
  return server
}

export function getApp () {
  return app
}

export function getServer () {
  return server
}

export function runJob (job, options = {}) {
  // Function to effectively run the job
  function runJobWithOptions () {
    console.log(`Launching job ${job.id} at ${(new Date()).toISOString()}, please wait...`)
    console.time('Running time')
    Healthcheck.jobId = job.id
    Healthcheck.isRunning = true
    const hrstart = process.hrtime()
    return app.service('jobs').create(job)
      .then(tasks => {
        console.log('Job terminated, ' + tasks.length + ' tasks ran')
        const hrend = process.hrtime(hrstart)
        console.timeEnd('Running time')
        Healthcheck.isRunning = false
        Healthcheck.duration = hrend[0] + (hrend[1] / 1e9)
        Healthcheck.error = null
        // Compute the error ratio for fault-tolerant jobs
        Healthcheck.nbFailedTasks = 0
        Healthcheck.nbSuccessfulTasks = 0
        tasks.forEach(task => {
          if (task.error) Healthcheck.nbFailedTasks++
          else Healthcheck.nbSuccessfulTasks++
        })
        const nbTotalTasks = (Healthcheck.nbSuccessfulTasks + Healthcheck.nbFailedTasks)
        // Job with 0 tasks is always succesful
        Healthcheck.successRate = (nbTotalTasks > 0 ? Healthcheck.nbSuccessfulTasks / nbTotalTasks : 1)
        return Promise.resolve(tasks)
      })
      .catch(error => {
        console.error(error.message)
        Healthcheck.isRunning = false
        Healthcheck.error = error
      })
  }

  // Setup CRON job if required
  let cronJob
  if (options.cron) {
    console.log('Scheduling job with cron pattern ' + options.cron)
    cronJob = new CronJob(options.cron, () => {
      // If last job has not yet finished skip this call as we are late
      if (!Healthcheck.isRunning) {
        Healthcheck.nbSkippedJobs = 0
        runJobWithOptions()
      } else {
        console.log('Skipping scheduled job as previous one is not yet finished')
        Healthcheck.nbSkippedJobs++
      }
    })
    // In case the server is forced to exit stop the job as well
    server.on('close', () => {
      cronJob.stop()
      console.log('Stopped scheduled job with cron pattern')
    })
  }
  // Run job
  if (cronJob) {
    cronJob.start()
    // Force run on start ?
    if (options.run) return runJobWithOptions()
  } else {
    return runJobWithOptions()
  }
}

export async function run (job, options = {}) {
  await createApp(job, options)
  const tasks = await runJob(job, options)
  // Check if run has to be considered as successful
  // If CRON the healthcheck command should be used instead
  if (!options.cron) {
    let healthcheckError
    try {
      await healthcheck(options)
    } catch (error) {
      healthcheckError = error
    }
    // When not running job continuously stop the server as well
    await server.close()
    if (healthcheckError) throw healthcheckError
    return tasks
  }
}

export async function processOptions () {
  const packageInfo = fs.readJsonSync(path.join(__dirname, '..', 'package.json'))

  program
    .version(packageInfo.version)
    .usage('<jobfile> [options]')
    .allowUnknownOption()
    .option('-d, --debug', 'Verbose output for debugging')
    .option('-a, --api', 'Setup as web app by exposing an API')
    .option('-ap, --api-prefix [prefix]', 'When exposed as an API change the prefix (defaults to /api)', '/api')
    .option('-po, --port [port]', 'Change the port to be used (defaults to 3030)', process.env.PORT ? Number(process.env.PORT) : 3030)
    .option('-c, --cron [pattern]', 'Schedule job using a cron pattern')
    .option('-r, --run', 'Force a first run on launch when scheduling job using a cron pattern')
    .option('-P, --proxy [proxy]', 'Proxy to be used for HTTP (and HTTPS)')
    .option('-PS, --proxy-https [proxy-https]', 'Proxy to be used for HTTPS')
    .option('-u, --user [user]', 'User name to be used for authentication')
    .option('-p, --password [password]', 'User password to be used for authentication')
    .option('-s, --sync [uri]', 'Activate sync module with given connection URI')
    .option('-sr, --success-rate [rate]', 'Change the success rate for fault-tolerant jobs to be considered as successful (defaults to 1)', process.env.SUCCESS_RATE ? Number(process.env.SUCCESS_RATE) : 1)
    .option('-md, --max-duration [duration]', 'Change the maximum run duration in seconds for fault-tolerant jobs to be considered as failed (defaults to unset)', process.env.MAX_DURATION ? Number(process.env.MAX_DURATION) : -1)
    .option('-sw, --slack-webhook [url]', 'Slack webhook URL to post messages on failure', process.env.SLACK_WEBHOOK_URL)
    .option('-mt, --message-template [template]', 'Message template used on failure', process.env.MESSAGE_TEMPLATE || 'Job <%= jobId %>: <%= error.message %>')
    .option('-lt, --link-template [template]', 'Link template used on failure', process.env.LINK_TEMPLATE || '')
    .parse(process.argv)

  // Setup env vars before reading job file so that we can safely use them inside.
  if (program.proxy) process.env.HTTP_PROXY = program.proxy
  if (program.proxyHttps) process.env.HTTPS_PROXY = program.proxyHttps
  if (program.debug) process.env.DEBUG = 'krawler*'
  if (program.user) process.env.USER_NAME = program.user
  if (program.password) process.env.USER_PASSWORD = program.password

  let jobfile = program.args[0]
  // When relative path is given assume it relative to working dir
  if (!path.isAbsolute(jobfile)) jobfile = path.join(process.cwd(), jobfile)
  // Read job file
  let job = await import(pathToFileURL(jobfile))
  job = job.default
  program.jobfile = jobfile
  program.job = job
  if (program.api) {
    program.mode = 'setup'
  }

  return program
}

export function cli (job, options = { port: 3030 }) {
  if (options.mode === 'setup') return createApp(job, options)
  else if (options.mode === 'runJob') return runJob(job, options)
  else return run(job, options)
}
