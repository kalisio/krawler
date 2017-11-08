const _ = require('lodash')
const template = require('./jobfile')

const longitude = 24.96333333
const latitude = 60.31722222
const resolution = 1000
const halfWidth = 20000

const job = _.merge({
  id: 'EFHK-' + resolution + '-' + halfWidth,
  longitude, latitude, resolution, halfWidth
}, template)

module.exports = job

