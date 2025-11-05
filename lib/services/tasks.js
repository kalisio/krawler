import _ from 'lodash'
import makeDebug from 'debug'
import Service from './service.js'
import { getStore, addOutput, writeStreamToStore, bufferToStream } from '../utils.js'
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
    let { id, type, options, storageOptions, response } = data
    if (!type) type = 'noop'
    if (!options) options = {}
    if (data.skip) {
      debug('Skipping task ' + id)
      return data
    }
    debug('Creating task ' + id)
    const store = await getStore(this.storesService, params, data)
    // Check if it already exists in case we don't want to overwrite
    const overwrite = _.get(data, 'overwrite', true)
    if (!overwrite) {
      const exists = await new Promise((resolve, reject) => {
        store.exists(id, (error, exists) => {
          if (error) reject(error)
          else resolve(exists)
        })
      })
      if (exists) {
        debug(`Skipping reading data for task ${id} as it already exists`)
        return data
      }
    }
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
    return new Promise((resolve, reject) => {
      let statusCode
      taskStream
        .on('timeout', reject)
        .on('response', (response) => {
          statusCode = response.statusCode
          if (response.statusCode > 299) {
            const error = new Error('Request rejected with HTTP code ' + statusCode)
            error.statusCode = statusCode
            reject(error)
          }
        })
      writeStreamToStore(taskStream, store, {
        key: id,
        params: storageOptions
      })
        .then(() => {
          // We allow to force a default content, useful if nothing has actual been written (ie no content)
          if (statusCode) {
            const content = _.get(response, statusCode, _.get(response, statusCode.toString()))
            if (content) {
              return writeStreamToStore(bufferToStream(content), store, {
                key: id,
                params: storageOptions
              })
                .then(() => {
                  addOutput(data, id, options.outputType)
                  resolve(data)
                })
                .catch(reject)
            }
          }
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
