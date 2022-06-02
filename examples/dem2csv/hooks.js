import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  tasks: {
    before: {
      // Could be set for each task but better to set it on template if all tasks use the same options
      // basicAuth: { type: 'Proxy-Authorization' }
    },
    after: {
      // If we don't resample we need to compute max value on a zone because we don't have a single value anymore
      // If we resample we could use the value directly by converting to JSON
      computeStatistics: { max: true }
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
      // Because each task is a JSON object we can directly export them to CSV
      writeCSV: {
        fields: [
          {
            label: 'Latmin',
            value: 'bbox[1]'
          },
          {
            label: 'Lonmin',
            value: 'bbox[0]'
          },
          {
            label: 'Latmax',
            value: 'bbox[3]'
          },
          {
            label: 'Lonmax',
            value: 'bbox[2]'
          },
          {
            label: 'Elev',
            value: 'max'
          }
        ]
      },
      clearOutputs: {},
      removeStores: ['job-store']
    }
  }
}

