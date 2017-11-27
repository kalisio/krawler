const _ = require('lodash')
const template = require('./jobfile')

const longitude = -71.93878056
const latitude = -13.53572222
const resolution = 30
const halfWidth = 18000
const blockResolution = 9000

const job = _.merge({
  id: 'SPZO-' + resolution + '-' + halfWidth,
  longitude, latitude, resolution, halfWidth, blockResolution
}, template)

module.exports = job
