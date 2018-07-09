import _ from 'lodash'
import makeDebug from 'debug'
import util from 'util'
import Tar from 'tar'
import Docker from 'dockerode'
import { addOutput, getStoreFromHook, writeStreamToStore, callOnHookItems, template, templateObject } from '../utils'

const exec = util.promisify(require('child_process').exec)
const debug = makeDebug('krawler:hooks:system')

export function tar (options = {}) {
  if (_.isNil(options.files)) {
    throw new Error(`You must provide a list of files to tar for the 'tar' hook`)
  }
  async function tarc (item) {
    const templatedOptions = templateObject(item, options, ['file', 'cwd', 'files'])
    debug(`Tar ${item.id} with options`, templatedOptions)
    return Tar.c(templatedOptions, templatedOptions.files)
    .then(() => {
      addOutput(item, templatedOptions.file, options.outputType)
    })
  }
  return callOnHookItems(tarc)
}

export function untar (options = {}) {
  if (_.isNil(options.file)) {
    throw new Error(`You must provide a tar file for the 'untar' hook`)
  }
  async function tarx (item) {
    const templatedOptions = templateObject(item, options, ['file', 'cwd', 'files'])
    debug(`Untar ${item.id} with options`, templatedOptions)
    return Tar.x(templatedOptions, templatedOptions.files)
  }
  return callOnHookItems(tarx)
}

export function runCommand (options = {}) {
  async function run (item) {
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

  async function create (item) {
    const templatedOptions = templateObject(item, options, ['Cmd', 'Env'])
    debug('Creating docker container', templatedOptions)
    let container = await docker.createContainer(templatedOptions)
    _.set(item, options.containerPath || 'container', container)
  }
  return callOnHookItems(create)
}

export function runContainerCommand (options = {}) {
  async function run (item, hook) {
    let container = _.get(item, options.containerPath || 'container')
    if (_.isNil(container)) {
      throw new Error(`You must run a docker container before using the 'runContainerCommand' hook`)
    }
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
      await writeStreamToStore(result, store, {
        key: item.id + '.tar',
        params: options.storageOptions
      })
      addOutput(item, item.id + '.tar', options.outputType)
    }
  }
  return callOnHookItems(run)
}
