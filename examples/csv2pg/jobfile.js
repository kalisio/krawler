const path = require('path')
const aws = require('aws-sdk')
const pg = require('pg')

let s3Client = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
})
let s3Bucket = process.env.S3_BUCKET

module.exports = {
  id: 'job',
  store: {
    id: 'job-store',
    type: 'fs',
    options: { path: path.join(__dirname, 'output') }
  },
  tasks: [{
    id: 'world_cities.csv',
    type: 'store',
    options: {
      store: {
        id: 'task-store',
        type: 's3',
        options: { client: s3Client, bucket: s3Bucket }
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
        connectPG: {},
        dropPGTable: {},
        createPGTable: {},
        writePGTable: {
          chunkSize: 50
        },
        disconnectPG: {}
      }
    }
  }
}
