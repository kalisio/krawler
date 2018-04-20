import _ from 'lodash'
import feathers from 'feathers'
import feathersHooks from 'feathers-hooks'
import socketio from 'feathers-socketio'
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

export function krawler (jobfile, options = {}) {
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
  // Read job file
  let job = (typeof jobfile === 'object' ? jobfile : require(jobfile))
  // Process hooks
  _.forOwn(job.hooks, (value, key) => {
    let service = app.service(key)
    hooks.activateHooks(value, service)
  })
  delete job.hooks
  // Run the app, this is required to correctly setup Feathers
  server = app.listen(3030)
  return job
}

export function run (job, options = {}) {
  // Run the job
  function runJob () {
    console.log('Launching job ' + job.id + ', please wait...')
    console.time('Running time')
    return app.service('jobs').create(job)
    .then(tasks => {
      console.log('Job terminated, ' + tasks.length + ' tasks ran')
      console.timeEnd('Running time')
      if (options.interval) {
        setTimeout(runJob, options.interval)
        return Promise.resolve(tasks)
      } else {
        return new Promise((resolve, reject) => {
          server.close(_ => resolve(tasks))
        })
      }
    })
    .catch(error => {
      console.error(error.message)
      server.close()
    })
  }

  return runJob()
}
