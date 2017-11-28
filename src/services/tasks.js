import makeDebug from 'debug'
import Service from './service'
import defaultTaskGenerators from '../tasks'

const debug = makeDebug('krawler:tasks')

class TasksService extends Service {
  constructor (options = {}) {
    super(defaultTaskGenerators)
    this.storesService = options.storesService || 'stores'
  }

  setup (app, path) {
    this.storesService = app.service(this.storesService)
  }

  create (data, params = {}) {
    let { id, type, options, store, storageOptions } = data

    return new Promise(async (resolve, reject) => {
      let message = 'Can\'t find or create store ' + store
      let storage = params.store
      // Store might be directly provided
      if (!storage || (typeof storage !== 'object')) {
        try {
          storage = await this.storesService.get(store)
        } catch (error) {
        }
      }
      if (!storage) {
        debug(message)
        reject(new Error(message))
        return
      }
      // Providing 'type-stream' as input type means we don't want to directly write the read stream
      // to the store but simply open it and return it for hooks to process
      const streamed = type.endsWith('-stream')
      let taskStream = await this.generate(streamed ? type.replace('-stream', '') : type, options, id)
      if (!taskStream) {
        message = 'Can\'t find task generator for task type ' + type
        debug(message)
        reject(new Error(message))
        return
      }
      if (streamed) {
        resolve(Object.assign({ stream: taskStream }, data))
      } else {
        taskStream
        .on('timeout', reject)
        .on('error', reject)
        .pipe(storage.createWriteStream({
          key: id,
          params: storageOptions
        }, error => {
          if (error) reject(error)
        }))
        .on('finish', () => resolve(data))
        .on('error', reject)
      }
    })
  }

  remove (id, params) {
    return new Promise(async (resolve, reject) => {
      let message = 'Can\'t find or create store'
      let storage = params.store
      if (!storage && params.query) {
        storage = params.query
        message += storage
      }
      // Store might be directly provided
      if (!storage || (typeof storage !== 'object')) {
        try {
          storage = await this.storesService.get(storage)
        } catch (error) {
        }
      }
      if (!storage) {
        debug(message)
        reject(new Error(message))
        return
      }

      storage.remove({
        key: id
      }, error => error ? reject(error) : resolve())
    })
  }
}

export default function init (options) {
  return new TasksService(options)
}

init.Service = TasksService
