import makeDebug from 'debug'

const debug = makeDebug('krawler:jobs')

// Create the async job
function createJob (options = {}, store = null, tasks, id) {
  debug(`Creating async job ${id} with following options`, options)
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
      const faultTolerant = options.faultTolerant || task.faultTolerant
      if (store) params.store = store
      // Add a worker to current step of the sequence
      workers.push(this.tasksService.create(task, params).catch(error => {
        if (faultTolerant) {
          console.log(error)
          return task
        } else {
          throw error
        }
      }))
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
