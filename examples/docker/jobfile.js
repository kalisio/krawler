const path = require('path')
const fs = require('fs')
const outputPath = path.join(__dirname, '..', 'output')

module.exports = {
  id: 'docker',
  store: 'fs',
  options: {
    workersLimit: 4
  },
  tasks: [{
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [ [ 102.0, 0.0 ], [ 103.0, 1.0 ], [ 104.0, 0.0 ], [ 105.0, 1.0 ] ]
          }
        }
      ]
    }
  }],
  hooks: {
    tasks: {
      before: {
        generateId: {},
        create: {
          hook: 'createContainer',
          host: 'localhost',
          port: process.env.DOCKER_PORT || 2375,
          Image: 'kalisio/gift-leaflet-print',
          Entrypoint: 'ash',
          AttachStdout: true,
          AttachStderr: true,
          Tty: true,
          Env: [ 'GEOJSON_FILE=<%= id %>.json' ]
        },
        start: {
          hook: 'runContainerCommand',
          command: 'start'
        }
      },
      after: {
        writeGeoJson: {},
        tar: {
          cwd: outputPath,
          file: path.join(outputPath, '<%= id %>.tar'),
          files: [ '<%= id %>.json' ]
        },
        copyGeoJson: {
          hook: 'runContainerCommand',
          command: 'putArchive',
          arguments: [ path.join(outputPath, '<%= id %>.tar'), { path: '/opt/testcafe/data' } ]
        },
        print: {
          hook: 'runContainerCommand',
          command: 'exec',
          arguments: {
            Cmd: [ '/opt/testcafe/docker/testcafe-docker.sh', '\'chromium --no-sandbox\'', '/opt/testcafe/src/index.js' ],
            AttachStdout: true,
            AttachStderr: true,
            Tty: true
          }
        },
        copyImage: {
          hook: 'runContainerCommand',
          command: 'getArchive',
          arguments: { path: '/home/user/Downloads/.' }
        },
        destroy: {
          hook: 'runContainerCommand',
          command: 'remove',
          arguments: { force: true }
        },
        untar: {
          cwd: outputPath,
          file: path.join(outputPath, '<%= id %>.tar')
        }
      }
    },
    jobs: {
      before: {
        createStores: {
          id: 'fs',
          options: {
            path: outputPath
          }
        }
      },
      after: {
        clearOutputs: {},
        removeStores: 'fs'
      }
    }
  }
}
