// import errors from 'feathers-errors'
import _ from 'lodash'
import makeDebug from 'debug'

const debug = makeDebug('krawler:jobs')

class Service {
  constructor (options = {}) {
    this.id = options.id || 'id'
  }

  setup (app, path) {
    this.tasksService = app.service('tasks')
  }

  create (data, params = {}) {
    let { taskTemplate, tasks } = data
    // The task template ID is used as a template string for the task ID
    let compiler = _.template(taskTemplate.id)
    debug('Launching job with following template', taskTemplate)
    return new Promise((resolve, reject) => {
      Promise.all(
        tasks.map(task => {
          let newTask = Object.assign({ id: compiler({ taskId: task.id }) }, _.omit(task, ['id']))
          _.merge(newTask, _.omit(taskTemplate, ['id']))
          return this.tasksService.create(newTask)
        })
      )
      .then(tasks => resolve(tasks))
      .catch(error => reject(error))
    })
  }
}

export default function init (options) {
  return new Service(options)
}

init.Service = Service
