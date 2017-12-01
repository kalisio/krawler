module.exports = {
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
            value: 'value'
          }
        ]
      }
    }
  },
  jobs: {
    before: {
      basicAuth: { type: 'Proxy-Authorization', optionsPath: 'taskTemplate.options' },
      generateGrid: {},
      generateGridTasks: { resample: true }
    },
    after: {
      mergeCSV: { headers: true },
      clearOutputs: {}
    }
  }
}
