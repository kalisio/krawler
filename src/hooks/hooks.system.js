import _ from 'lodash'
import { getItems, replaceItems } from 'feathers-hooks-common'
import makeDebug from 'debug'
import util from 'util'
import Docker from 'dockerode'
import { getStoreFromHook, writeStreamToStore } from '../utils'

const exec = util.promisify(require('child_process').exec)
const debug = makeDebug('krawler:hooks:system')

// Call a given function on each hook item
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

// Template a string or array of strings property according to a given item
function template(item, property) {
  const isArray = Array.isArray(property)
  let strings = (isArray ? property : [property])
  strings = strings.map(string => { 
    let compiler = _.template(string)
    // Add env into templating context
    const context = Object.assign(item, process)
    return compiler(context)
  })

  const result = (isArray ? strings : strings[0])
  return result
}

function templateObject(item, object, properties) {
  return _.mapValues(object, (value, key) => (properties.includes(key) ? template(item, value) : value))
}

export function runCommand (options = {}) {
  async function run(item) {
    let command = template(item, options.command)
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
    for (let i = 0; i < args.length; i++) {
      const arg = args[i]
      // Any string parameter will be templated (e.g. covers path for putArchive)
      if (typeof arg === 'string') args[i] = template(item, arg)
      // For now we only allow a couple of options to be templated
      else if (typeof arg === 'object') args[i] = templateObject(item, args[i], ['Cmd', 'Env', 'path'])
    }
    debug(`Running docker container ${container.id} command`, options.command, args)
    let result = await container[options.command](...args)
    if (options.command === 'exec') {
      result = await result.start()
      container.modem.demuxStream(result.output, process.stdout, process.stderr)
      // Need to wait for output stream end to be sure the command has been executed
      await new Promise((resolve, reject) => {
        result.output
        .on('end', () => resolve())
        .on('error', (error) => reject(error))
      })
      console.log(await result.inspect())
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
