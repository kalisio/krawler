const _ = require('lodash')
const template = require('./jobfile')

module.exports = _.merge({
  id: 'RJTT-6000-20000',
  longitude: 139.7811111,
  latitude: 35.55333333,
  resolution: 6000,
  halfWidth: 20000
}, template)

