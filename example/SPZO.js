const _ = require('lodash')
const template = require('./jobfile')

const longitude = -71.93878056
const latitude = -13.53572222
const resolution = 1000
const halfWidth = 20000

const job = _.merge({
  id: 'SPZO-' + resolution + '-' + halfWidth,
  longitude, latitude, resolution, halfWidth
}, template)

module.exports = job
