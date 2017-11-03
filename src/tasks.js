import makeDebug from 'debug'
import _ from 'lodash'
import * as stores from './stores'
import defaultTaskGenerators from './tasks.default'

const debug = makeDebug('krawler:tasks')

class Service {
  constructor (options = {}) {
    this.taskGenerators = {}
    _.forOwn(defaultTaskGenerators, (value, key) => {
      this.registerTaskGenerator(key, value)
    })
  }

  registerTaskGenerator (type, generator) {
    this.taskGenerators[type] = generator
  }

  unregisterTaskGenerator (type) {
    delete this.taskGenerators[type]
  }

  generateTask (type, options) {
    let generator = this.taskGenerators[type]
    if (!generator) return null
    else return generator(type, options)
  }

  create (data, params = {}) {
    let { id, type, options, store, storageOptions } = data

    return new Promise((resolve, reject) => {
      const message = 'Can\'t find store ' + store
      store = stores.getStore(store)
      if (!store) {
        reject(new Error(message))
        return
      }
      let taskStream = this.generateTask(type, options)
      if (!taskStream) {
        reject(new Error('Can\'t find task generator for task type ' + type))
        return
      }
      taskStream
        .on('timeout', reject)
        .on('error', reject)
        .pipe(store.createWriteStream({
          key: id,
          params: storageOptions
        }, (error) =>
          error
            ? reject(error)
            : resolve(data)
        ))
        .on('error', reject)
    })
  }

  remove (id, params) {
    return new Promise((resolve, reject) => {
      const query = params.query
      let store = query.store || params.store
      const message = 'Can\'t find store ' + store
      if (typeof store === 'string') store = stores.getStore(store)
      if (!store) {
        reject(new Error(message))
        return
      }
      store.remove({
        key: id
      }, error => error ? reject(error) : resolve())
    })
  }
}

export default function init (options) {
  return new Service(options)
}

init.Service = Service
