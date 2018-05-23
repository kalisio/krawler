import _ from 'lodash'
import path from 'path'
import feathers from 'feathers'
import feathersHooks from 'feathers-hooks'
import socketio from 'feathers-socketio'
import program from 'commander'
import { CronJob } from 'cron'
import makeDebug from 'debug'
import * as hooks from './hooks'
import { stores, tasks, jobs } from './services'
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
  if (options['proxy-https']) process.env.HTTPS_PROXY = options['proxy-https']
  if (options.debug) process.env.DEBUG = 'krawler*'
  if (options.user) process.env.USER_NAME = options.user
  if (options.password) process.env.USER_PASSWORD = options.password

  debug('Initializing krawler application')
  app = feathers()
  app.configure(feathersHooks())
  app.configure(socketio({
    transports: ['websocket']
  }))
  app.configure(plugin())
  app.use('stores', StoresService)
  app.use('tasks', TasksService)
  app.use('jobs', JobsService)
  // Process hooks
  _.forOwn(job.hooks, (value, key) => {
    let service = app.service(key)
    hooks.activateHooks(value, service)
  })
  // Run the app, this is required to correctly setup Feathers
  server = await app.listen(3030)
  return server
}

export function getApp () {
  return app
}

export function getServer () {
  return server
}

export function runJob (job, options = {}) {
  let isRunning // Flag indicating if job is currently running
  // Function to effectively run the job
  function runJobWithOptions () {
    console.log('Launching job ' + job.id + ', please wait...')
    console.time('Running time')
    isRunning = true
    return app.service('jobs').create(job)
    .then(tasks => {
      console.log('Job terminated, ' + tasks.length + ' tasks ran')
      console.timeEnd('Running time')
      isRunning = false
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
      if (!isRunning) runJobWithOptions()
      else console.log('Skipping scheduled job as previous one is not yet finished')
    })
  }
  // Run job
  if (cronJob) {
    cronJob.start()
  }
  return runJobWithOptions()
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
    .option('-c, --cron [pattern]', 'Schedule job using a cron pattern')
    .option('-P, --proxy [proxy]', 'Proxy to be used for HTTP (and HTTPS)')
    .option('-PS, --proxy-https [proxy-https]', 'Proxy to be used for HTTPS')
    .option('-u, --user [user]', 'User name to be used for authentication')
    .option('-p, --password [password]', 'User password to be used for authentication')
    .parse(process.argv)

  let jobfile = program.args[0]
  // When relative path is given assume it relative to working dir
  if (!path.isAbsolute(jobfile)) jobfile = path.join(process.cwd(), jobfile)
  // Read job file
  let job = require(jobfile)
  program.jobfile = jobfile
  program.job = job
  return program
}

export function cli (job, options = {}) {
  if (options.mode === 'setup') return createApp(job, options)
  else if (options.mode === 'runJob') return runJob(job, options)
  else return run(job, options)
}
