// import errors from 'feathers-errors'
import program from 'commander'
import makeDebug from 'debug'
import tasks from './tasks'

const debug = makeDebug('krawler')

export default function init () {
  
}

init.tasks = tasks

if (require.main === module) {
  program
    .version(require('../package.json').version)
    .usage('<jobfile> [options]')
    .parse(process.argv)

  debug('Initializing krawler command')
  let jobfile = program.args[0]
} else {
  debug('Initializing krawler plugin')
}
