import path from 'path'

module.exports = {
  id: 'job',
  // FIXME: when kue will run fine
  // In travis we test the kue job with a running Redis service
  // Avoid this on local env to avoid requiring a Redis server
  //type: (process.env.TRAVIS ? 'kue' : 'async'),
  store: 'job-store',
  tasks: [{
    id: 'RJTT-30-18000-2-1.tif',
    type: 'store',
    options: {
      store: 'task-store'
    }
  }],
  hooks: {
    tasks: {
      after: {
        readGeoTiff: {
          dataPath: 'result.data',
          fields: ['bbox', 'value'],
          outputType: 'intermediate'
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
          ],
          outputType: 'product'
        }
      }
    },
    jobs: {
      before: {
        createStores: [{
          id: 'job-store',
          type: 'fs',
          storePath: 'taskTemplate.store',
          options: { path: path.join(__dirname, '..', 'output') }
        },
        {
          id: 'task-store',
          type: 'fs',
          options: { path: __dirname }
        }]
      },
      after: {
        clearOutputs: {
          type: 'intermediate'
        },
        removeStores: ['job-store', 'task-store']
      }
    }
  }
}
