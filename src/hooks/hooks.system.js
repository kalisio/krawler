import _ from 'lodash'
import { getItems, replaceItems } from 'feathers-hooks-common'
import makeDebug from 'debug'
import util from 'util'
import Docker from 'dockerode'

const exec = util.promisify(require('child_process').exec)
const debug = makeDebug('krawler:hooks:system')

function callOnHookItems(f) {
  return async function (hook) {
    // Retrieve the items from the hook
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    if (isArray) {
      for (let i = 0; i < items.length; i++) {
        await f(items[i])
      }
    } else {
      await f(items)
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

export function runContainer (options = {}) {
  let docker = new Docker(options)

  async function run(item) {
    /*
    let compiler = _.template(options.command)
    const context = Object.assign(item, process)
    let command = compiler(context)
    */
    let command = options.command
    let streams = []
    if (options.stdout) {
      streams.push(process.stdout)
    }
    if (options.stderr) {
      streams.push(process.stderr)
    }
    debug('Running docker container', options.image, command)
    let container = await docker.run(options.image, command, streams, options.createOptions, options.startOptions)
    _.set(item, options.containerPath || 'container', container)
  }
  return callOnHookItems(run)
}

export function runContainerCommand (options = {}) {
  async function run(item) {
    let container = _.get(item, options.containerPath || 'container')
    if (_.isNil(container)) {
      throw new Error(`You must run a docker container before using the 'runContainerCommand' hook`)
    }
    debug(`Running docker container ${container.id} command`, options.command)
    await container[options.command](options)
    if (options.command === 'remove') _.unset(item, options.containerPath || 'container')
  }
  return callOnHookItems(run)
}
