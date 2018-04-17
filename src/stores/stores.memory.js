import store from 'memory-blob-store'
import makeDebug from 'debug'

const debug = makeDebug('krawler:stores')

// Create the memory store
function createStore (options, id) {
  debug('Creating memory store ' + id + ' with following parameters', options)
  return store(options)
}

export default createStore
