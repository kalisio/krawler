#!/usr/bin/env node

// import cluster from 'cluster'
import { Healthcheck } from './healthcheck.js'
import { processOptions, cli } from './cli.js'

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
const options = await processOptions()
try {
  await cli(options.job, options)
  if (!options.cron && !options.api) process.exit(Healthcheck.error)
} catch (error) {
  process.exit(1)
}
