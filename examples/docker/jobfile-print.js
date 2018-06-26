const path = require('path')
const fs = require('fs')
const outputPath = path.join(__dirname, '..', 'output')

module.exports = {
  hooks: {
    stores: {
      before: {
        disallow: 'external'
      }
    },
    tasks: {
      before: {
        disallow: 'external',
        generateId: {},
        create: {
          hook: 'createContainer',
          host: 'localhost',
          port: process.env.DOCKER_PORT || 2375,
          Image: 'kalisio/leaflet-print',
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
          arguments: [ path.join(outputPath, '<%= id %>.tar'), { path: '/opt/testcafe' } ]
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
        },
        copyToStore: {
          input: { key: 'map.png', store: 'fs' },
          output: { key: '<%= id %>.png', store: 's3', params: { ACL: 'public-read' } }
        }
      }
    },
    jobs: {
      before: {
        template: {
          store: 'fs',
          options: {
            workersLimit: 4
          }
        },
        createStores: [{
          id: 'fs',
          options: {
            path: outputPath
          }
        }, {
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
        clearData: {},
        template: {
          link: 'https://s3.eu-central-1.amazonaws.com/<%= env.S3_BUCKET %>/<%= id %>.png'
        },
        removeStores: ['fs', 's3']
      }
    }
  }
}
