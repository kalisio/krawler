import path from 'path'
import { fileURLToPath } from 'url'
import './generateTasks.js'
import './filterLayer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const token = '__qEMDoIC2ogPRlSoRQLGUBOomaxJyxdEd__'
const baseUrl = 'http://geoservices.meteofrance.fr/api/'
const proxyUrl = 'http://mapproxy.kalisio.xyz/service'

export default {
  id: 'MF',
  store: 'output-store',
  taskTemplate: {
    id: '<%= jobId %>-<%= taskId %>',
    store: 'output-store',
    templateStore: 'template-store',
    type: 'wms',
    options: {
      version: '1.3.0',
      request: 'GetCapabilities',
    }
  },
  hooks: {
    tasks: {
      after: {
        readXML: {
        },
        filterLayer: {
          variables: [
            { name: 'VERTICAL_VELOCITY_PRESSURE__ISOBARIC_SURFACE', style: 'VV__ISOBARIC__NO_SHADING' },
            { name: 'DEW_POINT_TEMPERATURE__ISOBARIC_SURFACE', style: 'TD__ISOBARIC__NO_SHADING' },
            { name: 'TEMPERATURE__ISOBARIC_SURFACE', style: 'T__ISOBARIC__NO_SHADING' },
            { name: 'TOTAL_WATER_PRECIPITATION__GROUND_OR_WATER_SURFACE', style: 'EAU__GROUND__NO_SHADING' },
            { name: 'SPECIFIC_CLOUD_ICE_WATER_CONTENT__ISOBARIC_SURFACE', style: 'CIWC__ISOBARIC__NO_SHADING' },
            { name: 'WIND_SPEED__ISOBARIC_SURFACE', style: 'FF__ISOBARIC__NO_SHADING' },
            { name: 'WIND_SPEED_GUST__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND', style: 'FF_RAF__HEIGHT__NO_SHADING' },
            { name: 'WIND__ISOBARIC_SURFACE', style: 'UV__ISOBARIC__BEAUF_NO_SHADING' },
            { name: 'TURBULENT_KINETIC_ENERGY__ISOBARIC_SURFACE', style: 'TKE__ISOBARIC__NO_SHADING' }
          ],
          dataPath: 'result.data.WMS_Capabilities.Capability.Layer.Layer'
        },
        parallel: [
          {
            hook: 'writeTemplate',
            dataPath: 'result.data.WMS_Capabilities.Capability.Layer',
            templateFile: 'mapproxy-template.yaml'
          },
          {
            hook: 'writeTemplate',
            dataPath: 'result.data.WMS_Capabilities.Capability.Layer',
            templateFile: 'leaflet-template.html'
          }
        ]
      }
    },
    jobs: {
      before: {
        createStores: [
          {
            id: 'output-store',
            type: 'fs',
            storePath: 'taskTemplate.outputStore',
            options: { path: path.join(__dirname, '..', 'output') }
          },
          {
            id: 'template-store',
            type: 'fs',
            storePath: 'taskTemplate.templateStore',
            options: { path: __dirname }
          }
        ],
        generateTasks: {
          models: [
            { id: 'ARPEGE_05', url:  baseUrl + token + '/MF-NWP-GLOBAL-ARPEGE-05-GLOBE-WMS' },
            { id: 'ARPEGE_01', url: baseUrl + token + '/MF-NWP-GLOBAL-ARPEGE-01-EUROPE-WMS' },
            { id: 'AROME_001', url: baseUrl + token + '/MF-NWP-HIGHRES-AROME-001-FRANCE-WMS' },
            { id: 'AROME_0025', url: baseUrl + token + '/MF-NWP-HIGHRES-AROME-0025-FRANCE-WMS' }
          ],
          proxyUrl: proxyUrl
        }
      },
      after: {
        removeStores: ['output-store', 'template-store']
      }
    }
  }
}
