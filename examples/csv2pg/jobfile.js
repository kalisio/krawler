const path = require('path')

module.exports = {
  id: 'job',
  store: {
    id: 'job-store',
    type: 'fs',
    options: { path: path.join(__dirname, '..', 'output') }
  },
  tasks: [{
    id: 'world_cities.csv',
    type: 'store',
    options: {
      store: {
        id: 'task-store',
        type: 's3',
        options: {
          client: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
          },
          bucket: process.env.S3_BUCKET
        }
      }
    }
  }],
  hooks: {
    tasks: {
      after: {
        readCSV: {
          headers: true
        },
        // For debug purpose
        convertToGeoJson: {
          latitude: 'lat',
          longitude: 'lng'
        },
        dropPGTable: {},
        createPGTable: {},
        writePGTable: {
          chunkSize: 50
        }
      }
    },
    jobs: {
      before: {
        connectPG: {
          user: process.env.PG_USER,
          password: process.env.PG_PASSWORD,
          host: 'localhost',
          database: 'test',
          port: 5432,
          clientPath: 'taskTemplate.client'
        }
      },
      after: {
        disconnectPG: {
          clientPath: 'taskTemplate.client'
        },
        clearOutputs: {}
      }
    }
  }
}
