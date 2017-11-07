const _ = require('lodash')
const template = require('./jobfile')

module.exports = _.merge({
  id: 'EFHK-6000-20000',
  longitude: 24.96333333,
  latitude: 60.31722222,
  resolution: 6000,
  halfWidth: 20000,
  /*
  origin: [24.96333333 - 0.1, 60.31722222 - 0.1],
  resolution: [0.1, 0.1],
  size: [2, 2],
  */
}, template)

