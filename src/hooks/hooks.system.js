import _ from 'lodash'
import makeDebug from 'debug'
import util from 'util'
import Tar from 'tar'
import spawn from 'cross-spawn'
import { addOutput, callOnHookItems, template, templateObject } from '../utils'

const exec = util.promisify(require('child_process').exec)
const debug = makeDebug('krawler:hooks:system')

export function tar (options = {}) {
  if (_.isNil(options.files)) {
    throw new Error('You must provide a list of files to tar for the \'tar\' hook')
  }
  async function tarc (item) {
    const templatedOptions = templateObject(item, options, ['file', 'cwd', 'files'])
    debug(`Tar ${item.id} with options`, templatedOptions)
    return Tar.c(templatedOptions, templatedOptions.files)
      .then(() => {
        addOutput(item, templatedOptions.file, options.outputType)
      })
  }
  return callOnHookItems(options)(tarc)
}

export function untar (options = {}) {
  if (_.isNil(options.file)) {
    throw new Error('You must provide a tar file for the \'untar\' hook')
  }
  async function tarx (item) {
    const templatedOptions = templateObject(item, options, ['file', 'cwd', 'files'])
    debug(`Untar ${item.id} with options`, templatedOptions)
    return Tar.x(templatedOptions, templatedOptions.files)
  }
  return callOnHookItems(options)(tarx)
}

export function runCommand (options = {}) {
  async function run (item) {
    let command = template(item, options.command)
    // Could actually be a set of commands so we unify the way to handle both cases
    let commands
    if (!options.spawn) { // When using exec commands are strings
      commands = (Array.isArray(command) ? command : [command])
    } else { // When using spawn commands are already arrays of strings
      commands = (Array.isArray(command[0]) ? command : [command])
    }
    for (let i = 0; i < commands.length; i++) {
      let command = commands[i]
      let result
      debug('Running command', command)
      if (options.spawn) {
        result = await spawn(command.shift(), command, options.options)
      } else {
        result = await exec(command, options.options)
      }
      const { stdout, stderr } = result
      if (options.stdout && stdout) {
        if (i > 0) item.stdout += stdout
        else item.stdout = stdout
        console.log(stdout.toString())
      }
      if (options.stderr && stderr) {
        if (i > 0) item.stderr += stderr
        else item.stderr = stderr
        console.error(stderr.toString())
      }
    }
  }
  return callOnHookItems(options)(run)
}
