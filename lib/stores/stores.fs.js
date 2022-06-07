import store from 'fs-blob-store'
import makeDebug from 'debug'

const debug = makeDebug('krawler:stores')

// Create the fs store
function createStore (options, id) {
  debug('Creating FS store ' + id + ' with following parameters', options)
  return store(options)
}

export default createStore
