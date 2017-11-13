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
      coverageid: 'Kalisio:GMTED2010_15',
      longitudeLabel: 'Long',
      latitudeLabel: 'Lat',
      auth: {
        user: 'username',
        password: 'password'
      }
    }
  }, 
  hooks: {
    tasks: {
      /*
      before: {
        basicAuth: { type: 'Proxy-Authorization' }
      },
      */
      after: {
        //geotiff2json: {},
        computeStatistics: { max: true }
      }
    },
    jobs: {
      before: {
        basicAuth: { type: 'Proxy-Authorization', path: 'taskTemplate.options' },
        generateGrid: {},
        generateGridTasks: {}
      },
      after: {
        generateCSV: {
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
        }
      }
    }
  }
}
