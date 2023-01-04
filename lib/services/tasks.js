import _ from 'lodash'
import makeDebug from 'debug'
import Service from './service.js'
import { getStore, addOutput, writeStreamToStore } from '../utils.js'
import defaultTaskGenerators from '../tasks/index.js'

const debug = makeDebug('krawler:tasks')

class TasksService extends Service {
  constructor (options = {}) {
    super(defaultTaskGenerators)
    this.storesService = options.storesService || 'stores'
  }

  setup (app, path) {
    super.setup(app, path)
    this.storesService = app.service(this.storesService)
  }

  // Internal create method, usefull to call it without hooks
  async _create (data, params = {}) {
    let { id, type, options, storageOptions } = data
    if (!type) type = 'noop'
    if (!options) options = {}
    if (data.skip) {
      debug('Skipping task ' + id)
      return data
    }
    debug('Creating task ' + id)
    // Providing 'type-stream' as input type means we don't want to directly write the read stream
    // to the store but simply open it and return it for hooks to process
    const streamed = type.endsWith('-stream')
    const taskStream = await this.generate(streamed ? type.replace('-stream', '') : type, options, id)
    // TO BE FIXED: just a trivial test for handling noop tasks
    if (_.isUndefined(taskStream)) {
      return data
    }
    if (!taskStream) {
      const message = 'Can\'t find task generator for task type ' + type
      debug(message)
      throw new Error(message)
    }
    if (streamed) {
      return Object.assign({ stream: taskStream }, data)
    }
    // Otherwise we target a store
    const store = await getStore(this.storesService, params, data)
    return new Promise((resolve, reject) => {
      taskStream
        .on('timeout', reject)
        .on('response', (response) => {
          const error = new Error('Request rejected with HTTP code ' + response.statusCode)
          error.statusCode = response.statusCode
          if (response.statusCode !== 200) reject(error)
        })
      writeStreamToStore(taskStream, store, {
        key: id,
        params: storageOptions
      })
        .then(() => {
          addOutput(data, id, options.outputType)
          resolve(data)
        })
        .catch(reject)
    })
  }

  async create (data, params = {}) {
    return this._create(data, params)
  }

  async remove (id, params = {}) {
    const store = await getStore(this.storesService, params, params.query || {})

    return new Promise((resolve, reject) => {
      // Remove output data
      debug('Removing data for task ' + id + ' from store')
      store.remove(id, error => {
        // Continue cleanup on error
        if (error) {
          console.error(error)
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
