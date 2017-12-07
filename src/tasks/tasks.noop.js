import makeDebug from 'debug'

const debug = makeDebug('krawler:tasks')

// Create the store stream for a task
async function createNoopStream (options, id) {
  debug('No operation  ' + id + ' with following parameters', options)
  return undefined
}

export default createNoopStream
