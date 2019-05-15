import _ from 'lodash'
import path from 'path'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import rest from '@feathersjs/express/rest'
import socketio from '@feathersjs/socketio'
import { disallow } from 'feathers-hooks-common'
import mubsub from 'mubsub'
import program from 'commander'
import { CronJob } from 'cron'
import makeDebug from 'debug'
import * as hooks from './hooks'
import { stores, tasks, jobs } from './services'
import { Healthcheck } from './utils'
import plugin from './plugin'

const debug = makeDebug('krawler:cli')

// Create default services used by CLI
export let StoresService = stores()
export let TasksService = tasks()
export let JobsService = jobs()
export let app
let server

// Register all default hooks
_.forOwn(hooks, (hook, name) => hooks.registerHook(name, hook))

export async function createApp (job, options = {}) {
  if (options.proxy) process.env.HTTP_PROXY = options.proxy
  if (options.proxyHttps) process.env.HTTPS_PROXY = options.proxyHttps
  if (options.debug) process.env.DEBUG = 'krawler*'
  if (options.user) process.env.USER_NAME = options.user
  if (options.password) process.env.USER_PASSWORD = options.password

  debug('Initializing krawler application')
  app = express(feathers())
  // Enable CORS, security, compression, and body parsing
  app.use(cors())
  app.use(helmet())
  app.use(compress())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  const apiPrefix = (options.api ? options.apiPrefix : '')
  debug('API prefix ' + apiPrefix)
  app.configure(rest())
  app.configure(socketio({
    path: apiPrefix + 'ws',
    transports: ['websocket']
  }))
  if (options.sync) {
    app.sync = mubsub(options.sync)
    let channel = app.sync.channel('krawler-events')
    app.on('krawler', (event) => {
      channel.publish(event.name, event.data)
    })
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
    if (options.cron) {
      if (Healthcheck.error) res.status(500).json(_.pick(Healthcheck, ['error']))
      else res.status(200).json(_.omit(Healthcheck, ['error']))
    } else {
      res.status(200).json({ isRunning: true })
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
    app.service(apiPrefix + '/stores').hooks({ before: { all: [ disallow('external') ] } })
    app.service(apiPrefix + '/tasks').hooks({ before: { all: [ disallow('external') ] } })
    app.service(apiPrefix + '/jobs').hooks({ before: { all: [ disallow('external') ] } })
  }
  // Process hooks
  _.forOwn(job.hooks, (value, key) => {
    let service = app.service(apiPrefix + '/' + key)
    hooks.activateHooks(value, service)
  })
  // Run the app, this is required to correctly setup Feathers
  const port = options.port || 3030
  if (options.api) console.log('Server listening to ' + port)
  server = app.listen(port)
  if (options.sync) {
    server.on('close', () => app.sync.close())
  }
  await new Promise((resolve, reject) => {
    server.on('listening', resolve)
    server.on('error', reject)
  })
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
    return app.service('jobs').create(job)
    .then(tasks => {
      console.log('Job terminated, ' + tasks.length + ' tasks ran')
      console.timeEnd('Running time')
      Healthcheck.isRunning = false
      Healthcheck.error = null
      // Compute the error ratio for fault-tolerant jobs
      Healthcheck.nbFailedTasks = 0
      Healthcheck.nbSuccessfulTasks = 0
      tasks.forEach(task => {
        if (task.error) Healthcheck.nbFailedTasks++
        else Healthcheck.nbSuccessfulTasks++
      })
      Healthcheck.successRate = Healthcheck.nbSuccessfulTasks / (Healthcheck.nbSuccessfulTasks + Healthcheck.nbFailedTasks)
      // When not running job continuously stop the server
      if (options.cron) {
        return Promise.resolve(tasks)
      } else {
        return new Promise((resolve, reject) => {
          server.close(() => resolve(tasks))
        })
      }
    })
    .catch(error => {
      console.error(error.message)
      Healthcheck.isRunning = false
      Healthcheck.error = error
      // When not running job continuously stop the server
      if (!options.cron) {
        server.close()
      }
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
  return runJob(job, options)
}

export function processOptions () {
  program
    .version(require('../package.json').version)
    .usage('<jobfile> [options]')
    .option('-d, --debug', 'Verbose output for debugging')
    .option('-a, --api', 'Setup as web app by exposing an API')
    .option('-ap, --api-prefix [prefix]', 'When exposed as an API change the prefix (defaults to /api)', '/api')
    .option('-po, --port [port]', 'Change the port to be used (defaults to 3030)', 3030)
    .option('-c, --cron [pattern]', 'Schedule job using a cron pattern')
    .option('-r, --run', 'Force a first run on launch when scheduling job using a cron pattern')
    .option('-P, --proxy [proxy]', 'Proxy to be used for HTTP (and HTTPS)')
    .option('-PS, --proxy-https [proxy-https]', 'Proxy to be used for HTTPS')
    .option('-u, --user [user]', 'User name to be used for authentication')
    .option('-p, --password [password]', 'User password to be used for authentication')
    .option('-s, --sync [uri]', 'Activate sync module with given connection URI')
    .parse(process.argv)

  let jobfile = program.args[0]
  // When relative path is given assume it relative to working dir
  if (!path.isAbsolute(jobfile)) jobfile = path.join(process.cwd(), jobfile)
  // Read job file
  let job = require(jobfile)
  program.jobfile = jobfile
  program.job = job
  if (program.api) {
    program.mode = 'setup'
  }

  return program
}

export function cli (job, options = {}) {
  if (options.mode === 'setup') return createApp(job, options)
  else if (options.mode === 'runJob') return runJob(job, options)
  else return run(job, options)
}
