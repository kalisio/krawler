import makeDebug from 'debug'

const debug = makeDebug('krawler:tasks')

// Create the store stream for a task
async function createStoreStream (options, id) {
  debug('Reading ' + id + ' from store with following parameters', options)

  // Input store config given for task
  let store = options.store
  if (typeof store === 'object') {
    try {
      // Check if store does not already exist
      store = await this.storesService.get(store.id)
    } catch (error) {
      try {
        // If not create it the first time
        store = await this.storesService.create(store)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }

  return store.createReadStream(Object.assign({ key: id }, options))
}

export default createStoreStream
