const path = require('path')
const fs = require('fs')
const flightpath = require('./flightpath')
const inputPath = __dirname
const outputPath = path.join(__dirname, '..', 'output')

module.exports = {
  id: 'docker',
  store: 'fs',
  options: {
    workersLimit: 4
  },
  tasks: [{
    id: 'krawler-icon'
  }],
  hooks: {
    tasks: {
      before: {
        tar: {
          cwd: inputPath,
          file: path.join(outputPath, '<%= id %>.tar'),
          files: [ '<%= id %>.png' ]
        },
        create: {
          hook: 'createContainer',
          host: 'localhost',
          port: process.env.DOCKER_PORT || 2375,
          Image: 'v4tech/imagemagick',
          Cmd: ['/bin/sh'],
          AttachStdout: true,
          AttachStderr: true,
          Tty: true
        },
        start: {
          hook: 'runContainerCommand',
          command: 'start'
        }
      },
      after: {
        copyInputImage: {
          hook: 'runContainerCommand',
          command: 'putArchive',
          arguments: [ path.join(outputPath, '<%= id %>.tar'), { path: '/tmp' } ]
        },
        convert: {
          hook: 'runContainerCommand',
          command: 'exec',
          arguments: {
            Cmd: [ 'convert', '/tmp/<%= id %>.png', '/tmp/<%= id %>.jpg' ],
            AttachStdout: true,
            AttachStderr: true,
            Tty: true
          }
        },
        copyOutputImage: {
          hook: 'runContainerCommand',
          command: 'getArchive',
          arguments: { path: '/tmp/.' }
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
        //clearOutputs: {},
        removeStores: 'fs'
      }
    }
  }
}
