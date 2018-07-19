const krawler = require('../../lib')
const hooks = krawler.hooks
const path = require('path')
const fs = require('fs')
const makeDebug = require('debug')
const _ = require('lodash')

const debug = makeDebug('krawler:examples')

// Configuration to get connected to secure Docker API
const dockerConfig = {
  host: '172.31.41.151',
  port: process.env.DOCKER_PORT || 2376,
  ca: fs.readFileSync('/home/ubuntu/.docker/ca.pem'),
  cert: fs.readFileSync('/home/ubuntu/.docker/cert.pem'),
  key: fs.readFileSync('/home/ubuntu/.docker/key.pem')
}

// Create a custom hook to generate tasks
let generateTasks = (options) => {
  return (hook) => {
    let tasks = []
    
    const width = 360 / options.grid.width
    const height = 180 / options.grid.height

    for (let i = 0; i < options.grid.width; i++) {
      for (let j = 0; j < options.grid.height; j++) {
        const minx = -180 + (i * width)
        const miny = -90 + (j * height)
        let task = {
          id: i + '-' + j,
          seed: {
            layer: options.layer,
            depth: options.depth,
            bbox: [minx, miny, minx + width, miny + height],
          },
          type: 'noop'
        }
        tasks.push(task)
      }
    }
    debug('Generated download tasks', tasks)
    hook.data.tasks = tasks
    return hook
  }
}
hooks.registerHook('generateTasks', generateTasks)

module.exports = {
  id: 'seeder',
  store: 'output-store',
  options: {
    workersLimit: 4
  },
  hooks: {
    tasks: {
      before: {
       
      },
      after: {
        generateSeedFile: {
          hook: 'writeTemplate',
          dataPath: 'result',
          templateStore: 'template-store',
          templateFile: 'seed.yaml'
        },
        createContainer: {
          host: '172.31.41.151',
          port: process.env.DOCKER_PORT || 2376,
          ca: fs.readFileSync('/home/ubuntu/.docker/ca.pem'),
          cert: fs.readFileSync('/home/ubuntu/.docker/cert.pem'),
          key: fs.readFileSync('/home/ubuntu/.docker/key.pem'),
          Image: 'yagajs/mapproxy:1.11-alpine',
          Cmd: ['mapproxy-seed', '-f', '/mapproxy/mapproxy.yaml', '-s', '/mapproxy/<%= id %>.yaml'],
          HostConfig: {
            Binds: ['/home/ubuntu/krawler/examples/seeder/mapproxy:/mapproxy']
          },
          NetworkingConfig: {
            EndpointsConfig: {
              "kargo": {}
            }
          },
          Env: [ 'AWS_ACCESS_KEY_ID=' + process.env.S3_ACCESS_KEY, 
                 'AWS_SECRET_ACCESS_KEY=' + process.env.S3_SECRET_ACCESS_KEY ]
        },
        startSeeder: {
          host: '172.31.41.151',
          port: process.env.DOCKER_PORT || 2376,
          ca: fs.readFileSync('/home/ubuntu/.docker/ca.pem'),
          cert: fs.readFileSync('/home/ubuntu/.docker/cert.pem'),
          key: fs.readFileSync('/home/ubuntu/.docker/key.pem'),
          hook: 'runContainerCommand',
          command: 'start',
        },
        removeSeeder: {
          host: '172.31.41.151',
          port: process.env.DOCKER_PORT || 2376,
          ca: fs.readFileSync('/home/ubuntu/.docker/ca.pem'),
          cert: fs.readFileSync('/home/ubuntu/.docker/cert.pem'),
          key: fs.readFileSync('/home/ubuntu/.docker/key.pem'),
          hook: 'runContainerCommand',
          command: 'remove',
          arguments: { force: true }
        }
      }
    },
    jobs: {
      before: {
        createStores: [
          {
            id: 'output-store',
            type: 'fs',
            storePath: 'output-store',
            options: { path: path.join(__dirname, '/mapproxy') }
          },
          {
            id: 'template-store',
            type: 'fs',
            storePath: 'template-store',
            options: { path: __dirname }
          }
        ],
        pullImage: {
          host: '172.31.41.151',
          port: process.env.DOCKER_PORT || 2376,
          ca: fs.readFileSync('/home/ubuntu/.docker/ca.pem'),
          cert: fs.readFileSync('/home/ubuntu/.docker/cert.pem'),
          key: fs.readFileSync('/home/ubuntu/.docker/key.pem'),
          image: 'yagajs/mapproxy:1.11-alpine'
        },
        generateTasks: {
          grid: {
            width: 1,
            height: 1
          },
          layer: 'osm-bright',
          depth: 3
        }
      },
      after: {
        removeStores: ['output-store', 'template-store']
      }
    }
  }
}
