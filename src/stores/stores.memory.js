import store from 'memory-blob-store'
import makeDebug from 'debug'

const debug = makeDebug('krawler:stores')

// Create the memory store
function createStore (options, id) {
  debug('Creating memory store ' + id + ' with following parameters', options)
  const memoryStore = store(options)
  // We add a specific property to retrieve in-memory buffer
  memoryStore.buffers = memoryStore.store
  return memoryStore
}

export default createStore
