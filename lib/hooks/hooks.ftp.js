import makeDebug from 'debug'
import _ from 'lodash'
import path from 'path'
import util from 'util'
import { exec as _exec } from 'child_process'
import { callOnHookItems, template, getStoreFromHook, addOutput } from '../utils.js'

const exec = util.promisify(_exec)
const debug = makeDebug('krawler:hooks:ftp')

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
  commands.push('exit')
  const cli = `lftp -u '${user}','${pass}' -p ${port} ${host} -e '${commands.join('; ')}'`
  return await exec(cli)
}

// List files on the remote directory
export function listFTP (options = {}) {
  async function list (item, hook) {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'listFTP\' hook')
    const remoteDir = template(item, options.remoteDir || options.key || (item.id))
    debug('Listing dir ' + remoteDir)

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

// Get a file on the FTP server
export function getFTP (options = {}) {
  async function get (item, hook) {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'getFTP\' hook')
    const outputStore = await getStoreFromHook(hook, 'getFTP', options)
    const remoteFile = template(item, options.remoteFile || options.key || (item.id))
    const localFile = template(item, options.localFile || path.join(outputStore.path, path.basename(remoteFile)))
    debug('Getting file ' + remoteFile + ' to ' + localFile)

    // Make sure we'll store the local file in the store
    const relativeLocalFile = path.relative(outputStore.path, localFile)
    const isInside = (relativeLocalFile && !relativeLocalFile.startsWith('..') && !path.isAbsolute(relativeLocalFile))
    if (!isInside) throw new Error('The local file is not relative to the store path')

    const commands = [`get ${remoteFile} -o ${localFile}`]
    const { stdout, stderr } = await runFtpCommand(client, commands)
    if (stderr) {
      console.error(stderr.toString())
    }
    if (stdout) {
      debug(remoteFile + ' copied with success')
      addOutput(item, relativeLocalFile, options.outputType)
    }
    return hook
  }

  return callOnHookItems(options)(get)
}

// Put a file on the FTP server
export function putFTP (options = {}) {
  async function put (item, hook) {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'putFTP\' hook')
    const inputStore = await await getStoreFromHook(hook, 'putFTP', options)
    const remoteFile = template(item, options.key || (item.id))
    const localFile = template(item, options.localFile || path.join(inputStore.path, path.basename(remoteFile)))
    debug('Putting file ' + localFile + ' to ' + remoteFile)

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
