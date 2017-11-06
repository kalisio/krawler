import store from 'fs-blob-store'

// Create the fs store
function createStore (options) {
  return store(options)
}

export default createStore
