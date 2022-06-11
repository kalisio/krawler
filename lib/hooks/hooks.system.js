import _ from 'lodash'
import makeDebug from 'debug'
import util from 'util'
import Tar from 'tar'
import envsub from 'envsub'
import spawn from 'cross-spawn'
import { exec as _exec } from 'child_process'
import { addOutput, callOnHookItems, template, templateObject } from '../utils.js'

const exec = util.promisify(_exec)
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
    const command = template(item, options.command)
    // Could actually be a set of commands so we unify the way to handle both cases
    let commands
    if (!options.spawn) { // When using exec commands are strings
      commands = (Array.isArray(command) ? command : [command])
    } else { // When using spawn commands are already arrays of strings
      commands = (Array.isArray(command[0]) ? command : [command])
    }
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      let result
      debug('Running command', command)
      if (options.spawn) {
        result = spawn(command.shift(), command, options.options)
        const exitCode = await new Promise((resolve, reject) => {
          result.on('close', resolve)
        })
        if (exitCode) {
          throw new Error(result.stderr)
        }
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

export function envsubst (options = {}) {
  if (_.isNil(options.templateFile)) {
    throw new Error('You must provide a template file for the \'envusb\' hook')
  }
  if (_.isNil(options.outputFile)) {
    throw new Error('You must provide an output file for the \'envusb\' hook')
  }
  async function envsubc (item) {
    const templatedOptions = templateObject(item, options, ['templateFile', 'outputFile'])
    debug(`envusb ${item.id} with options`, templatedOptions)
    return envsub({
      templateFile: templatedOptions.templateFile,
      outputFile: templatedOptions.outputFile,
      options: templatedOptions
    })
      .then(() => {
        addOutput(item, templatedOptions.outputFile, options.outputType)
      })
  }
  return callOnHookItems(options)(envsubc)
}
