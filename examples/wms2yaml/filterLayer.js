const _ = require('lodash')
const hooks = require('../../lib').hooks

// Create a custom hook to filter the layers exposed by the WMS service against the layers we desire
let hook = (options = {}) => {
  return (hook) => {
    let layers = _.get(hook, options.dataPath)
    let result = []
    options.variables.forEach(variable => {
      let layer = _.find(layers, { 'Name': variable.name })
      if (! _.isNil(layer)) {
        /* Scripts to be used if we need to process the dimensions
        let refDate = undefined
        let deadline = undefined
        let times = []
        let elevations = []
        let dimensions = _.get(layer, 'Dimension')
        dimensions.forEach(dimension => {
          let name = dimension['$']['name']
          if (name === 'reference_time') {
            refDate = new Date(_.last(dimension['_'].split(',')))
          } else if (name === 'time') {
            times = dimension['_'].split(',')
          } else if (name === 'elevation') {
            elevations = dimension['_'].split(',')
          } else {
            console.log('Undefined dimension')
          }
        })*/
        let variableLayer = {
          id: hook.data.id + '_' + variable.name,
          name: layer.Name,
          title: layer.Title,
          originUrl: hook.data.options.url,
          proxyUrl: hook.data.options.proxyUrl,
          style: variable.style 
        }
        result.push(variableLayer)
      }
    })
      
    _.set(hook, options.dataPath, result)
    return hook
  }
}

hooks.registerHook('filterLayer', hook)