const path = require('path')

module.exports = {
  id: 'job',
  store: 'job-store',
  tasks: [{
    id: 'world_cities.csv',
    type: 'store',
    options: {
      store: 'task-store'
    }
  }],
  hooks: {
    tasks: {
      after: {
        readCSV: {
          headers: true
        },
        convertToGeoJson: {
          latitude: 'lat',
          longitude: 'lng'
        },
        writeJson: {},
        dropMongoCollection: {},
        createMongoCollection: {},
        writeMongoCollection: {
          chunkSize: 50
        }
      }
    },
    jobs: {
      before: {
        createStores: [{
          id: 'job-store',
          type: 'fs',
          options: { path: path.join(__dirname, '..', 'output') }
        },
        {
          id: 'task-store',
          type: 's3',
          options: {
            client: {
              accessKeyId: process.env.S3_ACCESS_KEY,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
            },
            bucket: process.env.S3_BUCKET
          }
        }],
        connectMongo: {
          url: 'mongodb://127.0.0.1:27017/krawler-test',
          // Required so that client is forwarded from job to tasks
          clientPath: 'taskTemplate.client'
        }
      },
      after: {
        disconnectMongo: {
          clientPath: 'taskTemplate.client'
        },
        clearOutputs: {},
        removeStores: ['job-store', 'task-store']
      }
    }
  }
}
