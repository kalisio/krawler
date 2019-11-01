import _ from 'lodash'
import path from 'path'
import JsFTP from 'jsftp'
import makeDebug from 'debug'
import { callOnHookItems, template, getStoreFromHook, addOutput } from '../utils'

const debug = makeDebug('krawler:hooks:ftp')

// Connect to an FTP server
export function connectFTP (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'connectFTP\' hook should only be used as a \'before\' hook.')
    }

    debug('Connecting to FTP server for ' + options)
    const client = new JsFTP(options)
    _.set(hook.data, options.clientPath || 'client', client)
    debug('Connected to FTP for ' + options)
    return hook
  }
}

// List files on the remote directory
export function listFTP (options = {}) {
  async function get (item, hook) {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must be connected to an FTP server before using the \'listFTP\' hook')
    const remoteDir = template(item, options.remoteDir || options.key || (item.id))

    debug('Listing dir ' + remoteDir)
    return new Promise((resolve, reject) => {
      client.list(remoteDir, (err, res) => {
        if (err) {
          reject(err)
        } else {
          debug('listing succeeded')
          _.set(hook, options.dataPath || 'result.data', res)
          resolve(hook)
        }
      })
    })
  }

  return callOnHookItems(get)
}

// Get a file on the FTP server
export function getFTP (options = {}) {
  async function get (item, hook) {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must be connected to an FTP server before using the \'getFTP\' hook')
    const outputStore = await getStoreFromHook(hook, 'getFTP', options)
    const remoteFile = template(item, options.remoteFile || options.key || (item.id))
    const localFile = template(item, options.localFile || path.join(outputStore.path, path.basename(remoteFile)))
    debug('Getting file ' + remoteFile + ' to ' + localFile)

    // Make sure we'll store the local file in the store
    const relativeLocalFile = path.relative(outputStore.path, localFile)
    const isInside = (relativeLocalFile && !relativeLocalFile.startsWith('..') && !path.isAbsolute(relativeLocalFile))
    if (!isInside) throw new Error('The local file is not relative to the store path')

    return new Promise((resolve, reject) => {
      client.get(remoteFile, localFile, (err, res) => {
        if (err) {
          reject(err)
        } else {
          debug(remoteFile + ' copied with success')
          addOutput(item, relativeLocalFile, options.outputType)
          resolve(hook)
        }
      })
    })
  }

  return callOnHookItems(get)
}

// Put a file on the FTP server
export function putFTP (options = {}) {
  async function put (item, hook) {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must be connected to an FTP server before using the \'putFTP\' hook')
    const inputStore = await await getStoreFromHook(hook, 'putFTP', options)
    const remoteFile = template(item, options.key || (item.id))
    const localFile = template(item, options.localFile || path.join(inputStore.path, path.basename(remoteFile)))

    debug('Putting file ' + localFile + ' to ' + remoteFile)
    return new Promise((resolve, reject) => {
      client.put(localFile, remoteFile, (err, res) => {
        if (err) {
          debug(err)
          reject(err)
        } else {
          debug(localFile + ' copied with success')
          resolve(hook)
        }
      })
    })
  }

  return callOnHookItems(put)
}

// Disconnect from the FTP server
export function disconnectFTP (options = {}) {
  return async function (hook) {
    if ((hook.type !== 'after') && (hook.type !== 'error')) {
      throw new Error('The \'disconnectPG\' hook should only be used as a \'after/error\' hook.')
    }
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to an FTP serrver before using the \'disconnectFTP\' hook')
    }

    debug('Disconnecting from FTP for ' + options)
    client.raw('quit', (err, data) => {
      if (err) {
        throw new Error('\'disconnectFTP\' hook errored: ' + err)
      }
    })
    _.unset(hook.data, options.clientPath || 'client')
    debug('Disconnected from FTP for ' + options)
    return hook
  }
}
