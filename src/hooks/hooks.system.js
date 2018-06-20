import _ from 'lodash'
import { getItems, replaceItems } from 'feathers-hooks-common'
import makeDebug from 'debug'
import util from 'util'
import Docker from 'dockerode'
import { getStoreFromHook, writeStreamToStore } from '../utils'

const exec = util.promisify(require('child_process').exec)
const debug = makeDebug('krawler:hooks:system')

function callOnHookItems(f) {
  return async function (hook) {
    // Retrieve the items from the hook
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    if (isArray) {
      for (let i = 0; i < items.length; i++) {
        await f(items[i], hook)
      }
    } else {
      await f(items, hook)
    }
    // Replace the items within the hook
    replaceItems(hook, items)
    return hook
  }
}

export function runCommand (options = {}) {
  async function run(item) {
    let compiler = _.template(options.command)
    const context = Object.assign(item, process)
    let command = compiler(context)
    debug('Running command', command)
    const { stdout, stderr } = await exec(command)
    if (options.stdout) {
      item.stdout = stdout
      console.log(stdout)
    }
    if (options.stderr) {
      item.stderr = stderr
      console.log(stderr)
    }
  }
  return callOnHookItems(run)
}

export function createContainer (options = {}) {
  let docker = new Docker(options)

  async function create(item) {
    debug('Creating docker container', options)
    let container = await docker.createContainer(options)
    _.set(item, options.containerPath || 'container', container)
  }
  return callOnHookItems(create)
}

export function runContainerCommand (options = {}) {
  async function run(item, hook) {
    let container = _.get(item, options.containerPath || 'container')
    if (_.isNil(container)) {
      throw new Error(`You must run a docker container before using the 'runContainerCommand' hook`)
    }
    let args = []
    if (options.arguments) args = (Array.isArray(options.arguments) ? options.arguments : [options.arguments])
    debug(`Running docker container ${container.id} command`, options.command, args)
    let result = await container[options.command](...args)
    if (options.command === 'exec') {
      result = await result.start()
      //result.output.pipe(process.stdout)
      container.modem.demuxStream(result.output, process.stdout, process.stderr)
      await result.inspect()
    } else if (options.command === 'remove') {
      _.unset(item, options.containerPath || 'container')
    } else if (options.command === 'getArchive') {
      let store = await getStoreFromHook(hook, 'runContainerCommand', options)
      await writeStreamToStore(result, store, {
        key: item.id,
        params: Object.assign({}, options.storageOptions) // See https://github.com/kalisio/krawler/issues/7
      })
    }
  }
  return callOnHookItems(run)
}
