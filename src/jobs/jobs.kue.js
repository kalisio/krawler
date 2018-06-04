import kue from 'kue'
// import cluster from 'cluster'
import makeDebug from 'debug'

const debug = makeDebug('krawler:jobs')
let queue
function initialize () {
  if (queue) return
  queue = kue.createQueue()
  /* WIP: cluster mode, any worker can pick any tasks, the main issue is how to share stores between workers ?
  queue.process('task', async (task, done) => {
    try {
      let result = await this.tasksService.create(task.data)
      done()
    } catch (error) {
      done(error)
      return
    }
  })
  */
}

// Create the kue job
function createJob (options = {}, store = null, tasks, id) {
  // Initialize queue on first job
  initialize()
  debug(`Creating kue job ${id} with following options`, options)
  return new Promise((resolve, reject) => {
    const workersLimit = options.workersLimit || 4
    let i = 0
    let taskResults = []
    /* WIP: cluster mode
    tasks.forEach(task => {
      let kueTask = queue.create('task', task)
      .attempts(options.attemptsLimit || 5)
      .removeOnComplete(true)
      .save()
      // When the max attempts has been tried
      kueTask.on('failed', (error) => reject(error))
    })
    */
    tasks.forEach(task => {
      let kueTask = queue.create('task-' + id, task)
      .attempts(options.attemptsLimit || 5)
      .removeOnComplete(true)
      .save()
      // When the max attempts has been tried
      kueTask.on('failed', (error) => queue.shutdown(err => reject(err || error)))
    })
    queue.process('task-' + id, workersLimit, async (task, done) => {
      let result
      let params = {}
      const faultTolerant = options.faultTolerant || task.data.faultTolerant
      if (store) params.store = store
      try {
        result = await this.tasksService.create(task.data, params)
      } catch (error) {
        if (faultTolerant) {
          console.log(error)
          result = task.data
        } else {
          done(error)
          return
        }
      }
      i++
      taskResults.push(result)
      done(result)
      // When all tasks have been ran release the queue
      if (i === tasks.length) {
        queue.shutdown(err => {
          if (err) reject(err)
          else resolve(taskResults)
        })
      }
    })
  })
}

export default createJob
