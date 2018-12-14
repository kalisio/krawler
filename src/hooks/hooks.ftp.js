import util from 'util'
import _ from 'lodash'
import pg from 'pg'
import makeDebug from 'debug'
import { template } from '../utils'

const debug = makeDebug('krawler:hooks:pg')

// Connect to the postgres database
export function connectFTP (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'connectFTP' hook should only be used as a 'before' hook.`)
    }

    /*debug('Connecting to FTP server for ' + hook.data.id)
    let client = new pg.Client(options)
    await client.connect()
    _.set(hook.data, options.clientPath || 'client', client)
    debug('Connected to PG for ' + hook.data.id) */
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

    /*debug('Disconnecting from PG for ' + hook.data.id)
    await client.end()
    _.unset(hook.data, options.clientPath || 'client')
    debug('Disconnected from PG for ' + hook.data.id) */
    return hook
  }
}

