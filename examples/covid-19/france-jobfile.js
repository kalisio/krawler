const path = require('path')
const _ = require('lodash')
const fs = require('fs-extra')
const sift = require('sift')
const turf = require('@turf/turf')
const moment = require('moment')

// Read departemnts DB
const departements = fs.readJsonSync(path.join(__dirname, 'departements-france.geojson'))
departements.features.forEach(feature => {
  // Compute centroid of real geometry and update in place
  const centroid = turf.centroid(feature.geometry)
  feature.geometry = centroid.geometry
})

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
  id: `departements-france-${date.format('YYYY-MM-DD')}`,
  store: 'memory',
  options: { faultTolerant: true },
  tasks,
  hooks: {
    tasks: {
      after: {
        readYAML: {
          objectPath: 'donneesDepartementales'
        },
        /* DEBUG
        writeJsonFS: {
          hook: 'writeJson',
          store: 'fs'
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
        apply: {
          dataPath: 'result.data',
          function: (data) => {
            const nbDepartements = departements.features.length
            let count = 0
            departements.features.forEach(feature => {
              // Find corresponding data, we use JSON parsing to manage unicode
              const match = data.find(element => element.nom === feature.properties.nom)
              if (match) {
                count++
                feature.properties.Confirmed = match.casConfirmes
                feature.properties.Deaths = match.deces
              }
            })
            // Update data in-place
            data.splice(0, data.length)
            departements.features.forEach(feature => {
              if (feature.properties.Confirmed || feature.properties.Deaths) data.push({
                'Country/Region': 'France',
                'Province/State': feature.properties.nom,
                Confirmed: feature.properties.Confirmed,
                Deaths: feature.properties.Deaths,
                Longitude: feature.geometry.coordinates[0],
                Latitude: feature.geometry.coordinates[1]
              })
            })
            console.log(`Found data for ${count} departements on ${nbDepartements} departements`)
          }
        },
        convertToGeoJson: {
          latitude: 'Latitude',
          longitude: 'Longitude'
        },
        writeJsonFS: {
          hook: 'writeJson',
          store: 'fs'
        },
        writeJsonS3: {
          hook: 'writeJson',
          store: 's3',
          key: `covid-19/<%= id %>.json`,
          storageOptions: {
            ACL: 'public-read'
          }
        },
        clearOutputs: {},
        removeStores: ['memory', 'fs', 's3']
      }
    }
  }
}
