import _ from 'lodash'
import makeDebug from 'debug'
import Service from './service'
import defaultJobGenerators from '../jobs'

const debug = makeDebug('krawler:jobs')

class JobsService extends Service {
  constructor (options = {}) {
    super(defaultJobGenerators)
    this.tasksService = options.tasksService || 'tasks'
  }

  setup (app, path) {
    this.tasksService = app.service(this.tasksService)
  }

  async create (data, params = {}) {
    let { type, id, options, store, taskTemplate, tasks } = data
    // Store config given for all tasks of the job
    if (typeof store === 'object') {
      try {
        // Check if store does not already exist
        store = await this.tasksService.storesService.get(store.id)
      } catch (error) {
        try {
          // If not create it the first time
          store = await this.tasksService.storesService.create(store)
        } catch (error) {
          return Promise.reject(error)
        }
      }
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
    // FIXME: clear tasks temporary files, for now generate this bug
    // EBUSY: resource busy or locked
    // .then(tasks => Promise.all(tasks.map(task => this.tasksService.remove(task.id, { store }))))
  }
}

export default function init (options) {
  return new JobsService(options)
}

init.Service = JobsService
