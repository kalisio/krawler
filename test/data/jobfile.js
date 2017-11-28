import path from 'path'

module.exports = {
  id: 'job',
  store: {
    id: 'job-store',
    type: 'fs',
    options: { path: path.join(__dirname, '..', 'output') }
  },
  tasks: [{
    id: 'RJTT-30-18000-2-1.tif',
    type: 'store',
    options: {
      store: {
        id: 'task-store',
        type: 'fs',
        options: { path: __dirname }
      }
    }
  }],
  hooks: {
    tasks: {
      after: {
        readGeoTiff: {
          dataPath: 'result.data',
          fields: ['bbox', 'value']
        },
        // For debug purpose
        /*
        writeJson: {}
        */
        writeCSV: {
          dataPath: 'result.data',
          fields: [
            {
              label: 'Latmin',
              value: 'bbox[1]'
            },
            {
              label: 'Lonmin',
              value: 'bbox[0]'
            },
            {
              label: 'Latmax',
              value: 'bbox[3]'
            },
            {
              label: 'Lonmax',
              value: 'bbox[2]'
            },
            {
              label: 'Elev',
              value: 'value'
            }
          ]
        }
      }
    }
  }
}
