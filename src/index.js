#!/usr/bin/env node

// import cluster from 'cluster'
import { processOptions, cli } from './cli'
import plugin from './plugin'

export * as hooks from './hooks'
export * as utils from './utils'
export * as services from './services'
export * as stores from './stores'
export * as jobs from './jobs'
export * as tasks from './tasks'
export * from './cli'

export default plugin

/* WIP: cluster mode, the main issue is that stores are created by a job before hook
   thus are not availalbe on workers not running the job but running only tasks
if (cluster.isMaster) {
  for (let i = 0; i < 2; i++) {
    cluster.fork()
  }
  cluster.once('listening', (worker, address) => worker.send('runJob'))
} else {
  if (require.main === module) {
    let options = processOptions()
    options.mode = 'setup'
    cli(options.job, options)
    // Launch job on first available worker
    process.on('message', message => {
      if (message === 'runJob') {
        options.mode = 'runJob'
        cli(options.job, options)
      }
    })
  }
}
*/
if (require.main === module) {
  const options = processOptions()
  cli(options.job, options)
}
