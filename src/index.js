import program from 'commander'
import path from 'path'
// import cluster from 'cluster'
import { krawler, run } from './cli'
import plugin from './plugin'

export * as hooks from './hooks'
export * as utils from './utils'
export * as services from './services'
export * as stores from './stores'
export * as jobs from './jobs'
export * as tasks from './tasks'
export * from './cli'

export default plugin

function cli (mode) {
  program
    .version(require('../package.json').version)
    .usage('<jobfile> [options]')
    .option('-d, --debug', 'Verbose output for debugging')
    .option('-P, --proxy [proxy]', 'Proxy to be used for HTTP (and HTTPS)')
    .option('-PS, --proxy-https [proxy-https]', 'Proxy to be used for HTTPS')
    .option('-u, --user [user]', 'User name to be used for authentication')
    .option('-p, --password [password]', 'User password to be used for authentication')
    .parse(process.argv)

  let job = krawler(path.join(process.cwd(), program.args[0]), program)
  if (mode === 'run') run(job)
  return job
}

/* WIP: cluster mode, the main issue is that stores are created by a job before hook
   thus are not availalbe on workers not running the job but running only tasks
if (cluster.isMaster) {
  for (let i = 0; i < 2; i++) {
    cluster.fork()
  }
  cluster.once('listening', (worker, address) => worker.send('runJob'))
} else {
  if (require.main === module) {
    let job = cli('setup')
    // Launch job on first available worker
    process.on('message', message => { if (message === 'runJob') run(job) })
  }
}
*/
if (require.main === module) {
  cli('run')
}

