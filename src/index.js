import program from 'commander'
import makeDebug from 'debug'
import { stores, tasks, jobs } from './services'

export * as hooks from './hooks'

const debug = makeDebug('krawler')

export default function init () {

}

init.stores = stores
init.tasks = tasks
init.jobs = jobs

if (require.main === module) {
  program
    .version(require('../package.json').version)
    .usage('<jobfile> [options]')
    .parse(process.argv)

  debug('Initializing krawler command')
  // let jobfile = program.args[0]
} else {
  debug('Initializing krawler plugin')
}
