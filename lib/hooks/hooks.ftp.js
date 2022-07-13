import makeDebug from 'debug'
import _ from 'lodash'
import path from 'path'
import fs from 'fs'
import util from 'util'
import { exec as _exec } from 'child_process'
import { callOnHookItems, template, getStoreFromHook, addOutput } from '../utils.js'

const exec = util.promisify(_exec)
const debug = makeDebug('krawler:hooks:ftp')

// Helper function to wrap lftp cli
async function runFtpCommand (client, commands) {
  let user = client.user
  let pass = client.pass
  let port = client.port
  let host = client.host
  if (client.proxy) {
    user = user + '@' + client.proxy.user + '@' + host
    pass = pass + '@' + client.proxy.pass
    port = client.proxy.port
    host = client.proxy.host
  }
  // append 'exit' to exit lftp process at end of commands
  commands.push('bye')
  const cli = `lftp -u "${user}","${pass}" -p ${port} ${host} -e "${commands.join('; ')}"`
  return await exec(cli)
}

// List files on the remote directory
export function listFTP (options = {}) {
  async function list (item, hook) {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'listFTP\' hook')
    const remoteDir = template(item, options.remoteDir || options.key || (item.id))
    debug('Listing dir ' + remoteDir)

    // Run the command
    const commands = [`cd ${remoteDir}`, 'cls -1']
    const { stdout, stderr } = await runFtpCommand(client, commands)
    if (stderr) {
      console.error(stderr.toString())
    }
    if (stdout) {
      _.set(hook, options.dataPath || 'result.data', stdout.split('\n'))
    }
    return hook
  }

  return callOnHookItems(options)(list)
}

// List files on the remote directory
export function globFTP (options = {}) {
  async function glob (item, hook) {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'listFTP\' hook')
    const remoteDir = template(item, options.remoteDir || options.key || (item.id))
    const pattern = options.pattern || '*'
    debug('Glob dir ' + remoteDir + ' with pattern ' + pattern)

    // Run the command
    const commands = [`cd ${remoteDir}`, `glob -f echo ${pattern}`]
    const { stdout, stderr } = await runFtpCommand(client, commands)
    if (stderr) {
      console.error(stderr.toString())
    }
    if (stdout) {
      // split the file list into files and remove \n
      const files = _.map(_.split(stdout, ' '), file => _.trim(file))
      _.set(hook, options.dataPath || 'result.data', files)
    }
    return hook
  }

  return callOnHookItems(options)(glob)
}

// Get a file on the FTP server
export function getFTP (options = {}) {
  async function get (item, hook) {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'getFTP\' hook')
    const store = await getStoreFromHook(hook, 'getFTP', options)
    const remoteFile = template(item, options.remoteFile || options.key || (item.id))
    const localFile = template(item, options.localFile) || path.basename(remoteFile)
    debug('Getting file ' + remoteFile + ' to ' + localFile)

    // Ensure the local path exists
    const localDir = path.join(store.path, path.dirname(localFile))
    if (!fs.existsSync(localDir)) {
      debug('Creating local dir ' + localDir)
      fs.mkdirSync(localDir, { recursive: true })
    }

    // Run the command
    const commands = [`get ${remoteFile} -o ${path.join(store.path, localFile)}`]
    const { stdout, stderr } = await runFtpCommand(client, commands)
    if (options.stderr && stderr) {
      console.error(stderr.toString())
    }
    if (options.stdout && stdout) {
      console.log(stdout.toString())
    }
    debug(remoteFile + ' copied with success')
    addOutput(item, localFile, options.outputType)
    return hook
  }

  return callOnHookItems(options)(get)
}

// Put a file on the FTP server
export function putFTP (options = {}) {
  async function put (item, hook) {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'putFTP\' hook')
    const store = await await getStoreFromHook(hook, 'putFTP', options)
    const localFile = path.join(store.path, template(item, options.localFile || options.key || (item.id)))
    const remoteFile = template(item, options.remoteFile) || path.basename(localFile)
    debug('Putting file ' + localFile + ' to ' + remoteFile)

    // Run the command
    const commands = [`put ${localFile} -O ${remoteFile}`]
    const { stdout, stderr } = await runFtpCommand(client, commands)
    if (stderr) {
      console.error(stderr.toString())
    }
    if (stdout) {
      debug(localFile + ' copied with success')
    }
    return hook
  }

  return callOnHookItems(options)(put)
}
