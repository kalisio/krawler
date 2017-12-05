import makeDebug from 'debug'
import Service from './service'
import { getStore, addOutput } from '../utils'
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

  async create (data, params = {}) {
    let { id, type, options, storageOptions } = data
    if (!options) options = {}

    let store = await getStore(this.storesService, params, data)
    // Providing 'type-stream' as input type means we don't want to directly write the read stream
    // to the store but simply open it and return it for hooks to process
    const streamed = type.endsWith('-stream')
    let taskStream = await this.generate(streamed ? type.replace('-stream', '') : type, options, id)
    if (!taskStream) {
      let message = 'Can\'t find task generator for task type ' + type
      debug(message)
      throw new Error(message)
    }
    if (streamed) {
      return Object.assign({ stream: taskStream }, data)
    }
    return new Promise((resolve, reject) => {
      taskStream
      .on('timeout', reject)
      .on('error', reject)
      .on('response', (response) => {
        if (response.statusCode !== 200) reject(new Error('Request rejected with HTTP code ' + response.statusCode))
      })
      .pipe(store.createWriteStream({
        key: id,
        params: storageOptions
      }, error => {
        if (error) reject(error)
      }))
      .on('finish', () => {
        addOutput(data, id, options.outputType)
        resolve(data)
      })
      .on('error', reject)
    })
  }

  async remove (id, params = {}) {
    let store = await getStore(this.storesService, params, params.query || {})

    return new Promise((resolve, reject) => {
      // Remove output data
      debug('Removing data for task ' + id + ' from store')
      store.remove(id, error => {
        // Continue cleanup on error
        if (error) {
          console.log(error)
          // reject(error)
          // return
        }

        resolve()
      })
    })
  }
}

export default function init (options) {
  return new TasksService(options)
}

init.Service = TasksService
