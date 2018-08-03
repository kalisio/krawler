import _ from 'lodash'
import makeDebug from 'debug'
import util from 'util'
import Tar from 'tar'
import { addOutput, callOnHookItems, template, templateObject } from '../utils'

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
