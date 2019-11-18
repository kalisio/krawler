import _ from 'lodash'
import makeDebug from 'debug'
import util from 'util'
import Tar from 'tar'
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
  return callOnHookItems(tarc)
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
  return callOnHookItems(tarx)
}

export function runCommand (options = {}) {
  async function run (item) {
    const command = template(item, options.command)
    const commands = (Array.isArray(command) ? command : [command])
    for (let i = 0; i < commands.length; i++) {
      debug('Running command', commands[i])
      const { stdout, stderr } = await exec(commands[i], options.options)
      if (options.stdout) {
        if (i > 0) item.stdout += stdout
        else item.stdout = stdout
        console.log(stdout)
      }
      if (options.stderr) {
        if (i > 0) item.stderr += stderr
        else item.stderr = stderr
        console.error(stderr)
      }
    }
  }
  return callOnHookItems(run)
}
