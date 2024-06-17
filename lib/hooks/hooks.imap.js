import _ from 'lodash'
import path from 'path'
import fs from 'fs'
import { ImapFlow } from 'imapflow'
import makeDebug from 'debug'
import { callOnHookItems, getStoreFromHook } from '../utils.js'

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
  return callOnHookItems(options)(async (item, hook) => {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'listIMAPMailboxes\' hook')

    debug(`[IMAP] ${hook.data.id}: listing mailboxes`)
    const mailboxes = await client.list(options)
    _.set(hook, options.dataPath || 'result.data', mailboxes)
  })
}

// List messages for a given mailbox
export function fetchIMAPMessages (options = {}) {
  return callOnHookItems(options)(async (item, hook) => {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'fetchIMAPMessages\' hook')

    debug(`[IMAP] ${hook.data.id}: fetching messages`)
    let lock = await client.getMailboxLock(options.mailbox)
    try {
      let messages = []
      for await (const message of client.fetch(options.range, options.query, _.omit(options, ['mailbox', 'range', 'query', 'clientPath']))) {
        messages.push(message)
      } 
      _.set(hook, options.dataPath || 'result.data', messages)
    } finally {
      // Make sure lock is released, otherwise next `getMailboxLock()` never returns
      lock.release();
    }
  })
}

// Downalod message attachment for a given mailbox
export function downloadIMAPAttachments (options = {}) {
  return callOnHookItems(options)(async (item, hook) => {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'downloadIMAPContent\' hook')
    const store = await getStoreFromHook(hook, 'downloadIMAPAttachment', options)

    debug(`[IMAP] ${hook.data.id}: download attachments`)
    let lock = await client.getMailboxLock(options.mailbox)
    try {
      let attachment = []
      const message = await client.fetchOne(options.range, { bodyStructure: true })
      const parts = _.get(message.bodyStructure, 'childNodes')
      const filteredParts = _.filter(parts, part => part.type === options.type)
      for (const part of filteredParts) {
        // see example https://github.com/postalsys/imapflow/blob/master/examples/example.js#L242
        let {meta, content} = await client.download(message.seq, part.part, _.omit(options, ['mailbox', 'range', 'part', 'type', 'clientPath']))
        if (content) {
          let stream = fs.createWriteStream(path.join(store.path, meta.filename))
          await new Promise(resolve => {
              content.pipe(stream);
              stream.once('finish', () => {
                debug(`[IMAP] written attachement ${meta.filename}`)
                resolve()
              })
          })
          attachment.push(meta.filename)
        }
      }
      if (attachment.length === 1) attachment = attachment[0]
      else if (attachment.length === 0) attachment = null
      _.set(hook, options.dataPath || 'result.data', attachment)
      console.log(hook)
    } finally {
      // Make sure lock is released, otherwise next `getMailboxLock()` never returns
      lock.release()
    }
  })
}

// Flag messages
export function flagIMAPMessages (options = {}) {
  return callOnHookItems(options)(async (item, hook) => {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'deleteIMAPMessages\' hook')

    debug(`[IMAP] ${hook.data.id}: flag messages`)
    let lock = await client.getMailboxLock(options.mailbox)
    try {
      await client.messageFlagsAdd(options.range, options.flags, _.omit(options, ['mailbox', 'range', 'flags', 'clientPath']))
    } finally {
      // Make sure lock is released, otherwise next `getMailboxLock()` never returns
      lock.release()
    }
  })
}

// Unflag messages
export function unflagIMAPMessages (options = {}) {
  return callOnHookItems(options)(async (item, hook) => {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'deleteIMAPMessages\' hook')

    debug(`[IMAP] ${hook.data.id}: unflag messages`)
    let lock = await client.getMailboxLock(options.mailbox)
    try {
      await client.messageFlagsRemove(options.range, options.flags, _.omit(options, ['mailbox', 'range', 'flags', 'clientPath']))
    } finally {
      // Make sure lock is released, otherwise next `getMailboxLock()` never returns
      lock.release()
    }
  })
}

// Delete messages
export function deleteIMAPMessages (options = {}) {
  return callOnHookItems(options)(async (item, hook) => {
    const client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) throw new Error('You must provide client parameters to use the \'deleteIMAPMessages\' hook')

    debug(`[IMAP] ${hook.data.id}: delete messages`)
    let lock = await client.getMailboxLock(options.mailbox)
    try {
      await client.messageDelete(options.range, _.omit(options, ['mailbox', 'range', 'clientPath']))
    } finally {
      // Make sure lock is released, otherwise next `getMailboxLock()` never returns
      lock.release();
    }
  })
}