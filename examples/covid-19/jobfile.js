const path = require('path')
const moment = require('moment')

// We perform download up to the latest available data
const yesterday = moment.utc().subtract(1, 'day')
// Use start = yesterday to only download last day data
// Otherwise starting from 2020-03-01 data are geolocated
const start = moment.utc('2020-03-01') // = yesterday

let tasks = []
let date = start
while (date.isSameOrBefore(yesterday)) {
  tasks.push({
    id: `csse_covid_19_daily_report_${date.format('MM-DD-YYYY')}`,
    type: 'http',
    options: {
      url: `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${date.format('MM-DD-YYYY')}.csv`
    }
  })
  date.add(1, 'day')
}

module.exports = {
  id: 'job',
  store: 'memory',
  tasks,
  hooks: {
    tasks: {
      after: {
        readCSV: {
          headers: true
        },
        convertToGeoJson: {
          latitude: 'Latitude',
          longitude: 'Longitude'
        },
        writeJsonFS: {
          hook: 'writeJson',
          store: 'fs'
        }/*,
        writeJsonS3: {
          hook: 'writeJson',
          store: 's3',
          storageOptions: {
            ACL: 'public-read'
          }
        }*/
      }
    },
    jobs: {
      before: {
        createStores: [{
          id: 'memory'
        }, {
          id: 'fs',
          options: { path: path.join(__dirname, '..', 'output') }
        },
        {
          id: 's3',
          options: {
            client: {
              accessKeyId: process.env.S3_ACCESS_KEY,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
            },
            bucket: process.env.S3_BUCKET
          }
        }]
      },
      after: {
        clearOutputs: {},
        removeStores: ['memory', 'fs', 's3']
      }
    }
  }
}
