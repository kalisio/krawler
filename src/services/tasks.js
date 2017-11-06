import makeDebug from 'debug'
import _ from 'lodash'
import Service from './service'
import defaultTaskGenerators from '../tasks'

const debug = makeDebug('krawler:tasks')

class TasksService extends Service {
  constructor (options = {}) {
    super(options)
    _.forOwn(defaultTaskGenerators, (value, key) => {
      this.registerGenerator(key, value)
    })
  }

  setup (app, path) {
    this.storesService = app.service('stores')
  }

  create (data, params = {}) {
    let { id, type, options, store, storageOptions } = data

    return new Promise(async (resolve, reject) => {
      let message = 'Can\'t find store ' + store
      let storage = await this.storesService.get(store)
      if (!storage) {
        debug(message)
        reject(new Error(message))
        return
      }
      let taskStream = this.generate(type, options)
      if (!taskStream) {
        message = 'Can\'t find task generator for task type ' + type
        debug(message)
        reject(new Error(message))
        return
      }
      taskStream
        .on('timeout', reject)
        .on('error', reject)
        .pipe(storage.createWriteStream({
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
    return new Promise(async (resolve, reject) => {
      const query = params.query
      let store = query.store || params.store
      const message = 'Can\'t find store ' + store
      if (typeof store === 'string') store = await this.storesService.get(store)
      if (!store) {
        debug(message)
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
  return new TasksService(options)
}

init.Service = TasksService
