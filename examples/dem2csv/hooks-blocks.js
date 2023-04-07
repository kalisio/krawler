import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  tasks: {
    after: {
      // Because each task is not a JSON object but a GeoTiff we need to convert to JSON before exporting them to CSV
      readGeoTiff: {
        dataPath: 'result.data',
        fields: ['bbox', 'value']
      },
      // For debug purpose
      /*
      writeJson: {}
      */
      writeCSV: {
        dataPath: 'result.data',
        header: true,
        transform: {
          dataPath: 'result.data',
          mapping: {
            'bbox.1': 'Latmin',
            'bbox.0': 'Lonmin',
            'bbox.3': 'Latmax',
            'bbox.2': 'Lonmax',
            value: 'Elev'
          },
          omit: ['bbox']
        },
      },
      clearData: { dataPath: 'result.data' }
    }
  },
  jobs: {
    before: {
      createStores: [{
        id: 'job-store',
        type: 'fs',
        storePath: 'taskTemplate.store',
        options: { path: path.join(__dirname, '..', 'output') }
      }],
      basicAuth: { type: 'Proxy-Authorization', optionsPath: 'taskTemplate.options' },
      generateGrid: {},
      generateGridTasks: { resample: true }
    },
    after: {
      mergeCSV: { parse: { header: true }, unparse: { header: true } },
      clearOutputs: {},
      removeStores: ['job-store']
    }
  }
}
