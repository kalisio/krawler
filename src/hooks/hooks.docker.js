import _ from 'lodash'
import makeDebug from 'debug'
import util from 'util'
import Docker from 'dockerode'
import { addOutput, getStoreFromHook, writeStreamToStore, callOnHookItems, template, templateObject } from '../utils'

export function connectDocker (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'connectDocker' hook should only be used as a 'before' hook.`)
    }

    debug('Connecting to Docker for ' + hook.data.id)
    let client = new Docker(options)
    _.set(hook.data, options.clientPath || 'client', client)
    debug('Connected to Docker for ' + hook.data.id)
    return hook
  }
}

// Disconnect from the database
export function disconnectDocker (options = {}) {
  return async function (hook) {
    if ((hook.type !== 'after') && (hook.type !== 'error')) {
      throw new Error(`The 'disconnectDocker' hook should only be used as a 'after/error' hook.`)
    }
    let client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error(`You must be connected to Docker before using the 'disconnectDocker' hook`)
    }

    debug('Disconnecting from Docker for ' + hook.data.id)
    _.unset(hook, options.clientPath || 'data.client')
    debug('Disconnected from Docker for ' + hook.data.id)
    return hook
  }
}

export function pullDockerImage (options = {}) {
  async function pull (item) {
    let client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error(`You must be connected to Docker before using the 'pullImage' hook`)
    }
    let image = _.get(item, options.imagePath || 'image')
    if (_.isNil(image)) {
      throw new Error(`You must provide an image name for the 'pullDockerImage' hook`)
    }

    debug('Pulling docker image', item)

    await new Promise((resolve, reject) => {
      client.pull(options.image, _.isNil(options.auth) ? null : options.auth, (err, stream) => {
        if (err) reject(err)
        client.modem.followProgress(stream, (err, output) => {
          if (err) reject(err)
          resolve()
        })
      })
    })
  }
  return callOnHookItems(pull)
}

export function createDockerContainer (options = {}) {
  async function create (item) {
    let client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error(`You must be connected to Docker before using the 'createDockerContainer' hook`)
    }
    
    debug('Creating container', item)

    const templatedOptions = templateObject(item, options, ['Cmd', 'Env'])
    debug('Creating docker container', templatedOptions)
    let container = await docker.createContainer(templatedOptions)
    _.set(item, options.containerPath || 'container', container)
  }
  return callOnHookItems(create)
}

export function runDockerContainerCommand (options = {}) {
  async function run (item, hook) {
    let container = _.get(item, options.containerPath || 'container')
    if (_.isNil(container)) {
      throw new Error(`You must run a docker container before using the 'runDockerContainerCommand' hook`)
    }

    debug('Running container command', item)

    let args = []
    if (options.arguments) args = (Array.isArray(options.arguments) ? options.arguments : [options.arguments])
    args = _.clone(args)
    // Take care to clone the array because we update it in place and don't want to alter original options
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
      await result.inspect()
    } else if (options.command === 'remove') {
      _.unset(item, options.containerPath || 'container')
    } else if (options.command === 'getArchive') {
      let store = await getStoreFromHook(hook, 'runContainerCommand', options)
      let tarName = template(item, options.key || (item.id + '.tar'))
      await writeStreamToStore(result, store, {
        key: tarName,
        params: options.storageOptions
      })
      addOutput(item, item.id + '.tar', options.outputType)
    }
  }
  return callOnHookItems(run)
}
