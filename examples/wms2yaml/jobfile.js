const path = require('path')

module.exports = {
  id: 'job',
  store: {
    id: 'job-store',
    type: 'fs',
    options: { path: path.join(__dirname, 'output') }
  },
  tasks: [{
    id: 'wms',
    type: 'wms',
    options: {
      url: 'http://geoserver.kalisio.xyz/geoserver/Kalisio/wms',
      version: '1.3.0',
      request: 'GetCapabilities'
    }
  }],
  hooks: {
    tasks: {
      after: {
        readXML: {
          schemas: [
            {organisation: 'w3c', name: 'XLink_1_0'}, 
            {organisation: 'ogc', name: 'WMS_1_3_0'}
          ]
        },
        writeYAML: {}
      }
    }
  }
}
