const path = require('path')
require('./hooks.mapproxy')

module.exports = {
  id: 'ARPEGE',
  store: 'job-store',
  taskTemplate: {
    id: '<%= jobId %>_<%= taskId %>',
    type: 'noop',
    templateStore: 'template-store'
  },
  hooks: {
    tasks: {
      after: {
        writeTemplate: {
          dataPath: 'data',
          templateFile: 'mapproxy-template.yaml'
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
          id: 'template-store',
          type: 'fs',
          storePath: 'taskTemplate.templateStore',
          options: { path: __dirname }
        },
        ],
        getCapabilities: {
          url: 'https://geoservices.meteofrance.fr/services/MF-NWP-GLOBAL-ARPEGE-05-GLOBE-WMS',
          token: '__qEMDoIC2ogPRlSoRQLGUBOomaxJyxdEd__',
          service: 'WMS',
          version: '1.3.0',
          dataPath: 'taskTemplate.capabilities'
        },
        generateTasks: {
          layerNames: [
            'VERTICAL_VELOCITY_PRESSURE__ISOBARIC_SURFACE',
            'DEW_POINT_TEMPERATURE__ISOBARIC_SURFACE',
            'RELATIVE_HUMIDITY__ISOBARIC_SURFACE',
            'TEMPERATURE__ISOBARIC_SURFACE',
            'GEOPOTENTIAL__ISOBARIC_SURFACE',
            'PSEUDO_ADIABATIC_POTENTIAL_TEMPERATURE__ISOBARIC_SURFACE',
            'SPECIFIC_CLOUD_ICE_WATER_CONTENT__ISOBARIC_SURFACE',
            'WIND_SPEED__ISOBARIC_SURFACE',
            'ABSOLUTE_VORTICITY__ISOBARIC_SURFACE',
            'POTENTIAL_VORTICITY__ISOBARIC_SURFACE',
            'WIND__ISOBARIC_SURFACE',
            'TURBULENT_KINETIC_ENERGY__ISOBARIC_SURFACE'
          ],
          deadline: 60,
          dataPath: 'taskTemplate.capabilities'
        }
      },
      after: {
        removeStores: ['job-store', 'template-store']
      }
    }
  }
}
