import program from 'commander'
import _ from 'lodash'
import path from 'path'
import feathers from 'feathers'
import feathersHooks from 'feathers-hooks'
import makeDebug from 'debug'
import * as hooks from './hooks'
import plugin from '.'

const debug = makeDebug('krawler')

function activateHooks (service, serviceHooks) {
  // Iterate over hook types (before, after)
  _.forOwn(serviceHooks, (hooksDefinition, stage) => {
    // Iterate over hooks to create the hook pipeline
    let pipeline = []
    _.forOwn(hooksDefinition, (hookOptions, hookName) => {
      // Jump from name/options to the real hook function
      pipeline.push(hooks[hookName](hookOptions))
    })
    // Replace hooks in place so that we can use it directly with Feathers after
    serviceHooks[stage] = { create: pipeline } // We only have create operation to manage
  })
  // Setup hooks on service
  service.hooks(serviceHooks)
}

export default function cli () {
  program
    .version(require('../package.json').version)
    .usage('<jobfile> [options]')
    .option('-u, --user', 'User name to be used for authentication')
    .option('-p, --password', 'User password to be used for authentication')
    .parse(process.argv)

  process.env.USER_NAME = program.user
  process.env.USER_PASSWORD = program.password

  debug('Initializing krawler application')
  let app = feathers()
  app.configure(feathersHooks())
  app.configure(plugin())
  app.use('stores', plugin.stores())
  app.use('tasks', plugin.tasks())
  app.use('jobs', plugin.jobs())
  // Read job file
  let jobfile = path.join(process.cwd(), program.args[0])
  let job = require(jobfile)
  // Process hooks
  _.forOwn(job.hooks, (value, key) => {
    let service = app.service(key)
    activateHooks(service, value)
  })
  delete job.hooks
  // Run the app, this is required to correctly setup Feathers
  let server = app.listen(3030)
  // Run the job
  console.log('Launching job ' + job.id + ', please wait...')
  console.time('Running time')
  app.service('jobs').create(job)
  .then(tasks => {
    console.log('Job terminated, ' + tasks.length + ' tasks ran')
    console.timeEnd('Running time')
    server.close()
  })
  .catch(error => {
    console.log(error.message)
    server.close()
  })
}

if (require.main === module) {
  cli()
}
