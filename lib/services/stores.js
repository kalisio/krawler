import makeDebug from 'debug'
import Service from './service.js'
import defaultStoreGenerators from '../stores/index.js'

const debug = makeDebug('krawler:stores')

class StoresService extends Service {
  constructor (options = {}) {
    super(defaultStoreGenerators)
    this.stores = {}
  }

  setup (app, path) {
    super.setup(app, path)
  }

  async create (data, params = {}) {
    const { id, type, options } = data

    let store = this.stores[id]
    if (store) {
      const message = 'Store with id ' + id + ' already exist'
      debug(message)
      throw new Error(message)
    }
    // Often the store has the same name as its type, in that case it can be omitted
    store = await this.generate(type || id, options, id)
    if (!store) {
      const message = 'Can\'t find store generator for store type ' + type
      debug(message)
      throw new Error(message)
    }
    this.stores[id] = store
    return store
  }

  async get (id, params) {
    const store = this.stores[id]
    if (!store) {
      const message = 'Can\'t find store with ID ' + id
      debug(message)
      throw new Error(message)
    } else {
      return store
    }
  }

  async remove (id, params) {
    const store = this.stores[id]
    if (!store) {
      const message = 'Can\'t find store for removal with ID ' + id
      debug(message)
      throw new Error(message)
    } else {
      delete this.stores[id]
      return store
    }
  }
}

export default function init (options) {
  return new StoresService(options)
}

init.Service = StoresService
