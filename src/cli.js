import program from 'commander'
import _ from 'lodash'
import path from 'path'
import feathers from 'feathers'
import feathersHooks from 'feathers-hooks'
import makeDebug from 'debug'
import * as hooks from './hooks'
import plugin from '.'

const debug = makeDebug('krawler:cli')

export function activateHooks (serviceHooks, service) {
  // Iterate over hook types (before, after)
  _.forOwn(serviceHooks, (hooksDefinition, stage) => {
    // Iterate over hooks to create the hook pipeline
    let pipeline = []
    _.forOwn(hooksDefinition, (hookOptions, hookName) => {
      // Jump from name/options to the real hook function
      // First built-in hooks
      let hook = hooks[hookName]
      // Then custom ones
      if (!hook) hook = hooks.getHook(hookName)
      if (typeof hook === 'function') {
        pipeline.push(hook(hookOptions))
      } else {
        let message = 'Unknown hook ' + hookName
        debug(message)
        console.error(message)
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
  app.use('stores', plugin.stores())
  app.use('tasks', plugin.tasks())
  app.use('jobs', plugin.jobs())
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

export default function cli () {
  program
    .version(require('../package.json').version)
    .usage('<jobfile> [options]')
    .option('-d, --debug', 'Verbose output for debugging')
    .option('-P, --proxy [proxy]', 'Proxy to be used for HTTP (and HTTPS)')
    .option('-PS, --proxy-https [proxy-https]', 'Proxy to be used for HTTPS')
    .option('-u, --user [user]', 'User name to be used for authentication')
    .option('-p, --password [password]', 'User password to be used for authentication')
    .parse(process.argv)

  run(path.join(process.cwd(), program.args[0]), program)
}

if (require.main === module) {
  cli()
}
