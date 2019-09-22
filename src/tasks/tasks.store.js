import makeDebug from 'debug'

const debug = makeDebug('krawler:tasks')

// Create the store stream for a task
async function createStoreStream (options, id) {
  debug('Reading ' + id + ' from store with following parameters', options)

  // Input store config given in task options
  const store = await this.storesService.get(options.store)
  return store.createReadStream(Object.assign({ key: id }, options))
}

export default createStoreStream
