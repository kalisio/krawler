import _ from 'lodash'
import JsFTP from 'jsftp'
import makeDebug from 'debug'

const debug = makeDebug('krawler:hooks:ftp')

// Connect to the postgres database
export function connectFTP (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'connectFTP' hook should only be used as a 'before' hook.`)
    }

    debug('Connecting to FTP server for ' + hook.data.id)
    const client = new JsFTP(options)
    _.set(hook.data, options.clientPath || 'client', client)
    debug('Connected to FTP for ' + hook.data.id)
    return hook
  }
}

// Disconnect from the database
export function disconnectFTP (options = {}) {
  return async function (hook) {
    if ((hook.type !== 'after') && (hook.type !== 'error')) {
      throw new Error(`The 'disconnectPG' hook should only be used as a 'after/error' hook.`)
    }
    let client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error(`You must be connected to an FTP serrver before using the 'disconnectFTP' hook`)
    }

    debug('Disconnecting from FTP for ' + hook.data.id)
    _.unset(hook.data, options.clientPath || 'client')
    debug('Disconnected from FTP for ' + hook.data.id)
    return hook
  }
}
