import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
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
          header: true
        },
        transformJson: {
          unitMapping: {
            pop: { asNumber: true }
          }
        },
        convertToGeoJson: {
          latitude: 'lat',
          longitude: 'lng'
        },
        writeJson: {},
        dropPGTable: {},
        createPGTable: {},
        writePGTable: {
          chunkSize: 50
        }
      }
    },
    jobs: {
      before: {
        createJobStore: {
          hook: 'createStore',
          id: 'job-store',
          type: 'fs',
          options: { path: path.join(__dirname, '..', 'output') }
        },
        // If S3 is configured read from it
        createS3Store: {
          hook: 'createStore',
          match: { predicate: () => process.env.S3_BUCKET },
          id: 'task-store',
          type: 's3',
          options: {
            client: {
              accessKeyId: process.env.S3_ACCESS_KEY,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
            },
            bucket: process.env.S3_BUCKET
          }
        },
        // Otherwise use local filesystem
        createFsStore: {
          hook: 'createStore',
          match: { predicate: () => !process.env.S3_BUCKET },
          id: 'task-store',
          type: 'fs',
          options: { path: path.join(__dirname) }
        },
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
        clearOutputs: {},
        removeStores: ['job-store', 'task-store']
      }
    }
  }
}
