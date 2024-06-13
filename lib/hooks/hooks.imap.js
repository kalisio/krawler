import util from 'util'
import _ from 'lodash'
import { ImapFlow } from 'imapflow'
import makeDebug from 'debug'
import { callOnHookItems } from '../utils.js'

const debug = makeDebug('krawler:hooks:imap')

// Connect to the IMAP server
export function connectIMAP (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'connectIMAP\' hook should only be used as a \'before\' hook.')
    }
    let client = _.get(hook.data, options.clientPath || 'client')
    if (client) {
      debug(`[IMAP] ${hook.data.id} is already connected`)
      return hook
    }
    debug(`[IMAP] connecting ${hook.data.id}`)
    client = new ImapFlow(options)
    await client.connect()
    _.set(hook.data, options.clientPath || 'client', client)
    debug(`[IMAP] ${hook.data.id} is now connected`)
    return hook
  }
}

// Disconnect from IMAP server
export function disconnectIMAP (options = {}) {
  return async function (hook) {
    if ((hook.type !== 'after') && (hook.type !== 'error')) {
      throw new Error('The \'disconnectIMAP\' hook should only be used as a \'after/error\' hook.')
    }
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) {
      debug(`[IMAP] ${hook.data.id} is alredy disconnected`)
      return hook
    }
    debug(`[IMAP] disconnecting ${hook.data.id}`)
    await client.logout()
    _.unset(hook.data, options.clientPath || 'client')
    debug(`[IMAP] ${hook.data.id} is now disconnected`)
    return hook
  }
}

// List mailboxes
export function listIMAPMailboxes (options = {}) {
  async function listMailboxes (item, hook) {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'listIMAP\' hook')

    debug(`[IMAP] listing mailboxes for ${hook.data.id}`)
    const mailboxes = await client.list(options)
    console.log(mailboxes)
    _.set(hook, options.dataPath || 'result.data', mailboxes)
    return hook
  }
  return callOnHookItems(options)(listMailboxes)
}

// List mailboxes
export function fetchIMAPMessages (options = {}) {
  async function fetchMessage (item, hook) {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'listIMAP\' hook')

    debug(`[IMAP] fetching messages for ${hook.data.id}`)
    let lock = await client.getMailboxLock(options.mailbox)
    try {
      let messages = []
      for await (const message of client.fetch(options.range, options.query, _.omit(options, ['mailbox', 'range', 'query', 'clientPath']))) {
        messages.push(message)
      } 
      console.log(messages)
      _.set(hook, options.dataPath || 'result.data', messages)
    } finally {
      // Make sure lock is released, otherwise next `getMailboxLock()` never returns
      lock.release();
    }
    return hook
  }
  return callOnHookItems(options)(fetchMessage)
}