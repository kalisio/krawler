import _ from 'lodash'
import feathers from 'feathers'
import feathersHooks from 'feathers-hooks'
import makeDebug from 'debug'
import * as hooks from './hooks'
import { stores, tasks, jobs } from './services'
import plugin from './plugin'

const debug = makeDebug('krawler:cli')

// Create default services used by CLI
export let StoresService = stores()
export let TasksService = tasks()
export let JobsService = jobs()

function parallel(hooks) {
  return async function (hookObject) {
    return Promise.all(hooks.map(hook => hook(hookObject))).then(_ => hookObject)
  }
}

function getHookFunction(hookName) {
  // Jump from name to the real hook function
  // First built-in hooks
  let hook = hooks[hookName]
  // Then custom ones
  if (!hook) hook = hooks.getHook(hookName)
  if (typeof hook !== 'function') {
    let message = 'Unknown hook ' + hookName
    debug(message)
    throw new Error(message)
  }
  return hook
}

export function activateHooks (serviceHooks, service) {
  // Iterate over hook types (before, after)
  _.forOwn(serviceHooks, (hooksDefinition, stage) => {
    // Iterate over hooks to create the hook pipeline
    let pipeline = []
    _.forOwn(hooksDefinition, (hookOptions, hookName) => {
      // Check for parallel execution hook
      if (hookName == 'parallel') {
        try {
          // In this case we have an array of hooks to be run in parallel
          // Each item contains the hook name as a 'hook' property and hook options
          let hooks = hookOptions.map(item => {
            // Jump from name/options to the real hook function
            let hook = getHookFunction(item.hook)
            return hook(item)
          })
          pipeline.push(parallel(hooks))
        } catch (error) {
          console.error(error.message)
        }
      } else {
        // Jump from name/options to the real hook function
        let hook
        try {
          // If hook name is given as 'hook' option property use it
          // otherwise us key as hook name
          hook = getHookFunction(_.get(hookOptions, 'hook', hookName))
          pipeline.push(hook(hookOptions))
        } catch (error) {
          console.error(error.message)
        }
      }
    })
    // Replace hooks in place so that we can use it directly with Feathers after
    serviceHooks[stage] = { create: pipeline } // We only have create operation to manage
  })
  // Setup hooks on service
  if (service) service.hooks(serviceHooks)
}

export function run (jobfile, options = {}) {
  if (options.proxy) process.env.HTTP_PROXY = options.proxy
  if (options['proxy-https']) process.env.HTTPS_PROXY = options['proxy-https']
  if (options.debug) process.env.DEBUG = 'krawler*'
  if (options.user) process.env.USER_NAME = options.user
  if (options.password) process.env.USER_PASSWORD = options.password

  debug('Initializing krawler application')
  let app = feathers()
  app.configure(feathersHooks())
  app.configure(plugin())
  app.use('stores', StoresService)
  app.use('tasks', TasksService)
  app.use('jobs', JobsService)
  // Read job file
  let job = (typeof jobfile === 'object' ? jobfile : require(jobfile))
  // Process hooks
  _.forOwn(job.hooks, (value, key) => {
    let service = app.service(key)
    activateHooks(value, service)
  })
  delete job.hooks
  // Run the app, this is required to correctly setup Feathers
  let server = app.listen(3030)
  // Run the job
  console.log('Launching job ' + job.id + ', please wait...')
  console.time('Running time')
  return app.service('jobs').create(job)
  .then(tasks => {
    console.log('Job terminated, ' + tasks.length + ' tasks ran')
    console.timeEnd('Running time')
    return new Promise((resolve, reject) => {
      server.close(_ => resolve(tasks))
    })
  })
  .catch(error => {
    console.error(error.message)
    server.close()
  })
}
