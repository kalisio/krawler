const _ = require('lodash')
const template = require('./jobfile')

module.exports = _.merge({
  id: 'SPZO-6000-20000',
  longitude: -71.93878056,
  latitude: -13.53572222,
  resolution: 6000,
  halfWidth: 20000
}, template)

