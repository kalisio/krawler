const _ = require('lodash')
const template = require('./jobfile')

const longitude = 139.7811111
const latitude = 35.55333333
const resolution = 30
const halfWidth = 18000
const blockResolution = 9000

const job = _.merge({
  id: 'RJTT-' + resolution + '-' + halfWidth,
  longitude, latitude, resolution, halfWidth, blockResolution
}, template)

module.exports = job
