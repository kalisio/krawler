const path = require('path')
const _ = require('lodash')
const fs = require('fs-extra')
const sift = require('sift')
const turf = require('@turf/turf')

// By default we generate a list of geolocated patients
// Finest granularity now is departement level, we use their centroids
// We can also compute a heatmap, in that case each departement has a count with patients
const heatmap = ((process.argv.length > 3) && (process.argv[3] === 'heatmap'))
console.log('Computing patients ' + (heatmap ? 'heatmap' : 'map'))
// Read departemnts DB
const departements = fs.readJsonSync(path.join(__dirname, 'departements-france.geojson'))
departements.features.forEach(feature => {
  // Compute centroid of real geometry and update in place
  const centroid = turf.centroid(feature.geometry)
  feature.geometry = centroid.geometry
})

module.exports = {
  id: 'job',
  store: 'memory',
  tasks: [{
    id: (heatmap ? 'patients-heatmap-france' : 'patients-france'),
    type: 'http',
    options: {
      url: 'https://raw.githubusercontent.com/lperez31/coronavirus-france-dataset/master/patient.csv'
    }
  }],
  hooks: {
    tasks: {
      after: {
        readCSV: {
          headers: true
        },
        apply: {
          function: (item) => {
            const nbPatients = item.data.length
            let count = 0
            if (heatmap) {
              departements.features.forEach(feature => {
                // Find corresponding patients, we use JSON parsing to manage unicode
                const match = sift({ departement: JSON.parse(feature.properties.nom) }, item.data)
                if (match.length) {
                  count += match.length
                  feature.properties.Confirmed = match.length
                  feature.properties.Deaths = match.filter(patient => patient.deceased_date).length
                }
              })
              item.data = departements.features.map(feature => ({
                'Country/Region': 'France',
                'Province/State': JSON.parse(feature.properties.nom),
                Confirmed: feature.properties.Confirmed,
                Deaths: feature.properties.Deaths,
                Longitude: feature.geometry.coordinates[0],
                Latitude: feature.geometry.coordinates[1]
              }))
            } else {
              item.data.forEach(patient => {
                // Find corresponding departement
                const match = sift({ 'properties.nom': patient.departement }, departements.features)
                if (match.length) {
                  count++
                  const departement = match[0]
                  patient.Longitude = departement.geometry.coordinates[0]
                  patient.Latitude = departement.geometry.coordinates[1]
                }
              })
            }
            console.log(`Geolocated ${count} patients on ${nbPatients} patients`)
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
          key: 'covid-19/<%= id %>.json',
          storageOptions: {
            ACL: 'public-read'
          }
        }
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
