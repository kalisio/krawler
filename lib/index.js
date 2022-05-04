#!/usr/bin/env node

// import cluster from 'cluster'
import esMain from 'es-main'
import { processOptions, cli } from './cli.js'
import plugin from './plugin.js'

export * as hooks from './hooks/index.js'
export * as utils from './utils.js'
export * from './grid.js'
export * as services from './services/index.js'
export * as stores from './stores/index.js'
export * as jobs from './jobs/index.js'
export * as tasks from './tasks/index.js'
export * from './cli.js'

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

if (esMain(import.meta)) {
  // The script was run directly.
  const options = processOptions()
  cli(options.job, options)
}
