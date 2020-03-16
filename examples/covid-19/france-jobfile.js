const path = require('path')
const moment = require('moment')
console.log(process.argv)

// By default try to grap latest data
let date = moment.utc().subtract(1, 'day')
// Check for CLI option otherwise
if (process.argv.length > 3) {
  if (moment(process.argv[3]).isValid()) date = moment(process.argv[3])
}
const regions = [
  'auvergne-rhone-alpes',
  'bourgogne-franche-comte',
  'bretagne',
  'centre-val-de-loire',
  'corse',
  'grand-est',
  'hauts-de-france',
  'ile-de-france',
  'normandie',
  'nouvelle-aquitaine',
  'occitanie',
  'pays-de-la-loire',
  'provence-alpes-cote-dazur'
]

let tasks = []
regions.forEach(region => {
  tasks.push({
    id: `${region}-${date.format('YYYY-MM-DD')}`,
    region,
    type: 'http',
    options: {
      url: 'https://raw.githubusercontent.com/opencovid19-fr/data/master/agences-regionales-sante/' +
           `${region}/${date.format('YYYY-MM-DD')}.yaml`
    }
  })
})

module.exports = {
  id: 'job',
  store: 'memory',
  options: { faultTolerant: true },
  tasks,
  hooks: {
    tasks: {
      after: {
        readYAML: {
          objectPath: 'donneesDepartementales'
        },
        transformJson: {
          mapping: { nom: 'Province/State', casConfirmes: 'Confirmed', deces: 'Deaths' },
          merge: {
            'Country/Region': 'France',
            time: date.format()
          }
        }/* DEBUG,
        writeJsonFS: {
          hook: 'writeJson',
          store: 'fs'
        },
        writeJsonS3: {
          hook: 'writeJson',
          store: 's3',
          key: 'covid-19/<%= id %>',
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
        mergeJson: {
          by: 'code'
        },
        writeJsonFS: {
          hook: 'writeJson',
          store: 'fs',
          key: `departements-france-${date.format('YYYY-MM-DD')}.json`
        }/*,
        writeJsonS3: {
          hook: 'writeJson',
          store: 's3',
          key: `departements-france-${date.format('YYYY-MM-DD')}.json`,
          storageOptions: {
            ACL: 'public-read'
          }
        }*/,
        clearOutputs: {},
        removeStores: ['memory', 'fs', 's3']
      }
    }
  }
}
