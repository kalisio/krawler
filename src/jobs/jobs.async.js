import _ from 'lodash'
import makeDebug from 'debug'

const debug = makeDebug('krawler:jobs')

// Create the async job
function createJob (options = {}, store = null, tasks, id) {
  debug(`Creating async job ${id} with following options`, options)
  const runTask = async (task, params) => {
    const faultTolerant = options.faultTolerant || task.faultTolerant
    const attempts = task.attemptsLimit || options.attemptsLimit || 1
    for (let i = 1; i <= attempts; i++) {
      try {
        // If different options are provided for attempts use them
        if ((i > 1) && task.attemptsOptions) _.merge(task, task.attemptsOptions[i - 2])
        await this.tasksService.create(task, params)
      } catch (error) {
        // On the last retry stop
        if (i === attempts) {
          if (faultTolerant) {
            console.log(error)
          } else {
            throw error
          }
        }
      }
    }
    return task
  }
  return new Promise(async (resolve, reject) => {
    const workersLimit = options.workersLimit || 4
    let i = 0
    // The set of workers/tasks for current step
    // We launch the workers in sequence, one step of the sequence contains a maximum number of workersLimit workers
    let workers = []
    let taskResults = []
    while (i < tasks.length) {
      let task = tasks[i]
      let params = {}
      if (store) params.store = store
      // Add a worker to current step of the sequence
      workers.push(runTask(task, params))
      // When we reach the worker limit wait until the step finishes and jump to next one
      if ((workers.length >= workersLimit) ||
          (i === tasks.length - 1)) {
        try {
          let results = await Promise.all(workers)
          taskResults = taskResults.concat(results)
          debug(results.length + ' tasks ran', results)
        } catch (error) {
          debug('Some tasks failed', error)
          reject(error)
          return
        }
        workers = []
      }
      i++
    }
    resolve(taskResults)
  })
}

export default createJob
