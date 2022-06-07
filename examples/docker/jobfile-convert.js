import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const inputPath = __dirname
const outputPath = path.join(__dirname, '..', 'output')

export default {
  hooks: {
    stores: {
      before: {
        disallow: 'external'
      }
    },
    tasks: {
      before: {
        disallow: 'external',
        tar: {
          cwd: inputPath,
          file: path.join(outputPath, '<%= id %>.tar'),
          files: [ '<%= id %>.png' ]
        },
        create: {
          hook: 'createDockerContainer',
          Image: 'v4tech/imagemagick',
          Cmd: ['/bin/sh'],
          AttachStdout: true,
          AttachStderr: true,
          Tty: true
        },
        start: {
          hook: 'runDockerContainerCommand',
          command: 'start'
        }
      },
      after: {
        copyInputImage: {
          hook: 'runDockerContainerCommand',
          command: 'putArchive',
          arguments: [ path.join(outputPath, '<%= id %>.tar'), { path: '/tmp' } ]
        },
        convert: {
          hook: 'runDockerContainerCommand',
          command: 'exec',
          arguments: {
            Cmd: [ 'convert', '/tmp/<%= id %>.png', '/tmp/<%= id %>.jpg' ],
            AttachStdout: true,
            AttachStderr: true,
            Tty: true
          }
        },
        copyOutputImage: {
          hook: 'runDockerContainerCommand',
          command: 'getArchive',
          arguments: { path: '/tmp/.' }
        },
        destroy: {
          hook: 'runDockerContainerCommand',
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
        template: {
          store: 'fs',
          options: {
            workersLimit: 4
          }
        },
        generateId: {},
        createStores: {
          id: 'fs',
          options: {
            path: outputPath,
            storePath: 'store'
          }
        },
        connectDocker: {
          host: 'localhost',
          port: process.env.DOCKER_PORT || 2375,
          // Required so that client is forwarded from job to tasks
          clientPath: 'taskTemplate.client'
        }
      },
      after: {
        clearOutputs: {},
        disconnectDocker: { clientPath: 'taskTemplate.client' },
        removeStores: 'fs'
      }
    }
  }
}
