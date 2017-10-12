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
    debug('Launching job with following template', taskTemplate)
    return new Promise((resolve, reject) => {
      Promise.all(
        tasks.map(task => {
          let newTask = Object.assign({}, task)
          _.merge(newTask, taskTemplate)
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
