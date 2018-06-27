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
        template: {
          appUrl: 'http://kargo-www.s3-website.eu-central-1.amazonaws.com/',
          width: 1024, height: 768, format: 'Current Size', baseLayer: 'PlanetSat', overlayLayer: ''
        },
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
          Env: [ 'APP_URL=<%= appUrl %>', 'SCREEN_WIDTH=<%= width %>', 'SCREEN_HEIGHT=<%= height %>', 'PRINT_FORMAT=<%= format %>',
            'BASE_LAYER=<%= baseLayer %>', 'OVERLAY_LAYER=<%= overlayLayer %>', 'GEOJSON_FILE=<%= id %>.json' ]
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
          arguments: [ path.join(outputPath, '<%= id %>.tar'), { path: '/tmp' } ]
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
        copyToFS: { // Because the output file is always map.png rename it according to task ID
          hook: 'copyToStore',
          input: { key: 'map.png', store: 'fs' },
          output: { key: '<%= id %>.png', store: 'fs' }
        },
        copyToS3: {
          hook: 'copyToStore',
          input: { key: '<%= id %>.png', store: 'fs' },
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
        }/*, If used as a web service stores need to persist across requests
        removeStores: ['fs', 's3']*/
      },
      error: {
        // In case of error clear everything
        destroy: {
          hook: 'runContainerCommand',
          command: 'remove',
          arguments: { force: true }
        },
        clearOutputs: {},
        clearData: {}
      }
    }
  }
}
