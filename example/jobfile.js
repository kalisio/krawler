module.exports = {
  options: {
    workersLimit: 50
  },
  store: {
    id: 'job-store',
    type: 'fs',
    options: { path: './data' }
  },
  taskTemplate: {
    store: 'job-store',
    id: '<%= taskId %>.tif',
    type: 'wcs',
    options: {
      url: 'http://geoserver.kalisio.xyz/geoserver/Kalisio/wcs',
      version: '2.0.1',
      format: 'image/tiff',
      coverageid: 'Kalisio:GMTED2010_15'
    }
  }, 
  hooks: {
    tasks: {
      after: {
        computeStatistics: { max: true }
        //geotiff2json: {}
      }
    },
    jobs: {
      before: {
        generateGrid: {},
        generateGridTasks: {}
      },
      after: {
        generateCSV: [
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
      }
    }
  }
}
