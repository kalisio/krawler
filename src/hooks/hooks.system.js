import _ from 'lodash'
import { getItems, replaceItems } from 'feathers-hooks-common'
import makeDebug from 'debug'
import util from 'util'

const exec = util.promisify(require('child_process').exec)
const debug = makeDebug('krawler:hooks:system')

export function runCommand (options = {}) {
  async function run(item) {
    let compiler = _.template(options.command)
    let command = compiler(item)
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
  return async function (hook) {
    // Retrieve the items from the hook
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    if (isArray) {
      for (let i = 0; i < items.length; i++) {
        await run(items[i])
      }
    } else {
      await run(items)
    }
    // Replace the items within the hook
    replaceItems(hook, items)
    return hook
  }
}
