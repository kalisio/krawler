import makeDebug from 'debug'
import { stores, tasks, jobs } from './services/index.js'

const debug = makeDebug('krawler')

export default function init (options = {}) {
  return function () {
    debug('Initializing krawler plugin')
  }
}

init.stores = stores
init.tasks = tasks
init.jobs = jobs
