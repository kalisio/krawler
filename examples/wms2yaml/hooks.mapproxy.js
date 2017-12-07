const _ = require('lodash')
const hooks = require('../../lib').hooks

// Create a custom hook
let hook = (options = {}) => {
  return (hook) => {
    // retrieve the layers
    let capabilities = _.get(hook, options.dataPath)
    let layers = _.get(capabilities, 'WMS_Capabilities.Capability.Layer.Layer')
    // build the tasks
    let tasks = []
    options.layerNames.forEach(layerName => {
      let layer = _.find(layers, { 'Name': layerName })
      let refDate = undefined
      let deadline = undefined
      let times = []
      let elevations = []
      let dimensions = _.get(layer, 'Dimension')
      dimensions.forEach(dimension => {
        let name = dimension['$']['name']
        if (name === 'reference_time') {
          refDate = new Date(_.last(dimension['_'].split(',')))
          deadline = new Date(refDate)
          deadline.setHours(deadline.getHours() + options.deadline)
        } else if (name === 'time') {
          times = dimension['_'].split(',')
        } else if (name === 'elevation') {
          elevations = dimension['_'].split(',')
        } else {
          console.log('Undefined dimension')
        }
      })
      // define the task
      let task = {
        name: layerName,
        title: layer.Title,
        elevations: elevations,
        dates: times.map(time => new Date(time)).filter(date => (date >= refDate) && (date <= deadline))
      }
      tasks.push(task)
    })
    hook.data.tasks = tasks
    return hook
  }
}
hooks.registerHook('generateTasks', hook)