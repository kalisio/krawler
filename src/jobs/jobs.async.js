// Create the async job
function createJob (options = {}, store = null, tasks) {
  return new Promise(async (resolve, reject) => {
    const workersLimit = options.workersLimit || 4
    let i = 0
    // The set of workers/tasks for current step
    // We launch the workers in sequence, one step of the sequence contains a maximum number of workersLimit workers
    let workers = []
    let taskResults = []
    while (i < tasks.length) {
      // Add a worker to current step of the sequence
      if (store) {
        workers.push(this.tasksService.create(tasks[i], { store }))
      } else {
        workers.push(this.tasksService.create(tasks[i]))
      }
      // When we reach the worker limit wait until the step finishes and jump to next one
      if ((workers.length >= workersLimit) ||
           (i === tasks.length - 1)) {
        try {
          let results = await Promise.all(workers)
          taskResults = taskResults.concat(results)
        } catch (error) {
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
