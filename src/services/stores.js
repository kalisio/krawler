import _ from 'lodash'
import makeDebug from 'debug'
import Service from './service'
import defaultStoreGenerators from '../stores'

const debug = makeDebug('krawler:stores')

class StoresService extends Service {
  constructor (options = {}) {
    super(options)
    this.stores = {}
    _.forOwn(defaultStoreGenerators, (value, key) => {
      this.registerGenerator(key, value)
    })
  }

  create (data, params = {}) {
    let { id, type, options } = data

    return new Promise((resolve, reject) => {
      let store = this.generate(type, options)
      if (!store) {
        const message = 'Can\'t find store generator for store type ' + type
        debug(message)
        reject(new Error(message))
        return
      }
      this.stores[id] = store
      resolve(store)
    })
  }

  get (id, params) {
    return new Promise((resolve, reject) => {
      let store = this.stores[id]
      if (!store) {
        const message = 'Can\'t find store with ID ' + id
        debug(message)
        reject(new Error(message))
        return
      }
      resolve(store)
    })
  }

  remove (id, params) {
    return new Promise((resolve, reject) => {
      let store = this.stores[id]
      if (!store) {
        const message = 'Can\'t find store for removal with ID ' + id
        debug(message)
        reject(new Error(message))
        return
      }
      delete this.stores[id]
      resolve(store)
    })
  }
}

export default function init (options) {
  return new StoresService(options)
}

init.Service = StoresService
