const _ = require('lodash')
const template = require('./jobfile')

const longitude = 24.96333333
const latitude = 60.31722222
const resolution = 30
const halfWidth = 18000
const blockResolution = 9000

const job = _.merge({
  id: 'EFHK-' + resolution + '-' + halfWidth,
  longitude, latitude, resolution, halfWidth, blockResolution
}, template)

module.exports = job

