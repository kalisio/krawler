import _ from 'lodash'
import makeDebug from 'debug'
import Service from './service'
import { getStore } from '../utils'
import defaultJobGenerators from '../jobs'

const debug = makeDebug('krawler:jobs')

class JobsService extends Service {
  constructor (options = {}) {
    super(defaultJobGenerators)
    this.tasksService = options.tasksService || 'tasks'
    this.storesService = options.storesService || 'stores'
  }

  setup (app, path) {
    this.tasksService = app.service(this.tasksService)
    this.storesService = app.service(this.storesService)
  }

  async create (data, params = {}) {
    let { type, id, options, taskTemplate, tasks } = data
    let store
    // If a store is found at job level it will be forwarded to all tasks
    // as params so that they don't have to seek for output store
    try {
      store = await getStore(this.storesService, params, data)
    } catch (error) {
      // Otherwise each task should specify its output store
    }

    // The task template ID is used as a template string for the task ID
    let compiler
    if (taskTemplate) {
      compiler = _.template(taskTemplate.id)
      debug('Launching job with following template', taskTemplate)
    }
    tasks = tasks.map(task => {
      let newTask = {}
      if (taskTemplate) {
        // Create a new task with compiled ID
        newTask.id = compiler({ jobId: data.id, taskId: task.id })
        // When there is nothing to interpolate the returned ID is empty
        if (!newTask.id) newTask.id = task.id
        // Then affect template and object
        _.merge(newTask, _.omit(taskTemplate, ['id']))
        _.merge(newTask, _.omit(task, ['id']))
      } else {
        // Simply copy input object when no template is given
        Object.assign(newTask, task)
      }
      return newTask
    })
    // Always default to async if no type given
    return this.generate(type || 'async', options, store, tasks, id)
  }

  async remove (id, params = {}) {
    let store = await getStore(this.storesService, params, params.query || {})

    return new Promise((resolve, reject) => {
      // Remove output data
      debug('Removing data for job ' + id + ' from store')
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
  return new JobsService(options)
}

init.Service = JobsService
