const _ = require('lodash')
const template = require('./jobfile')

const longitude = 139.7811111
const latitude = 35.55333333
const resolution = 1000
const halfWidth = 20000

const job = _.merge({
  id: 'RJTT-' + resolution + '-' + halfWidth,
  longitude, latitude, resolution, halfWidth
}, template)

module.exports = job
