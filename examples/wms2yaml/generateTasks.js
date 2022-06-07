import _ from 'lodash'
import { hooks } from '../../lib/index.js'

// Create a custom hook
let hook = (options = {}) => {
  return (hook) => {
    // build a task for each model
    let tasks = []

    options.models.forEach(model => {
      let task = {
        id: model.id,
        options: {
          url: model.url,
          proxyUrl: options.proxyUrl
        }
      }
      tasks.push(task)
    })
    hook.data.tasks = tasks
    return hook
  }
}

hooks.registerHook('generateTasks', hook)