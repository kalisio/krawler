import _ from 'lodash'
import feathers from '@feathersjs/client'
import io from 'socket.io-client'
import fetch from 'node-fetch'
import makeDebug from 'debug'
// import { getItems } from 'feathers-hooks-common'
import { template, templateObject, templateQueryObject, transformJsonObject, getChunks } from '../utils.js'

const debug = makeDebug('krawler:hooks:feathers')

// Connect to the feathers API
export function connectFeathers (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    let client = _.get(item, options.clientPath || 'client')
    if (client) {
      debug('Already connected to Feathers for ' + item.id)
      return hook
    }
    debug('Connecting to Feathers for ' + item.id)
    client = feathers()
    if (options.transport === 'websocket') {
      const socket = io(options.origin, {
        transports: ['websocket'],
        path: options.path
      })
      client.configure(feathers.socketio(socket))
    } else {
      client.configure(feathers.rest(options.origin).fetch(fetch))
    }
    if (options.authentication) {
      client.configure(feathers.authentication({
        path: options.authentication.path || '/authentication'
      }))
      client.authenticate(_.omit(options.authentication, ['path']))
    }
    _.set(item, options.clientPath || 'client', client)
    debug('Connected to Feathers for ' + item.id)
    return hook
  }
}

// Disconnect from the API
export function disconnectFeathers (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      debug('Already disconnected from Feathers for ' + item.id)
      return hook
    }

    debug('Disconnecting from Feathers for ' + item.id)
    // If authenticated disconnect
    if (typeof client.logout === 'function') await client.logout()
    _.unset(item, options.clientPath || 'client')
    debug('Disconnected from Feathers for ' + item.id)
    return hook
  }
}

// Perform a service operation
export function callFeathersServiceMethod (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to Feathers before using the \'callFeathersServiceMethod\' hook')
    }

    const serviceName = template(item, _.get(options, 'service', _.snakeCase(item.id)))
    const methodName = template(item, _.get(options, 'method', 'find'))
    const service = client.service(serviceName)
    // Either we have the complete params object or only the query shortcut
    const templatedQuery = templateQueryObject(item,
      _.get(options, 'params.query', _.get(options, 'query', {})))
    // Defines the data object or chunks otherwise
    const data = (options.data ? templateObject(item, options.data) : getChunks(hook, options))
    // Avoid templating the special query object already managed above
    const params = (options.params ? templateObject(item, _.omit(options.params, ['query'])) : {})
    params.query = templatedQuery
    const id = options.id || item.id
    let json
    switch (methodName) {
      case 'find':
        debug(`Performing ${methodName} on service ${serviceName} with`, params)
        json = await service[methodName](params)
        break
      case 'get':
        debug(`Performing ${methodName} on service ${serviceName} with`, id, params)
        json = await service[methodName](id, params)
        break
      case 'remove':
        debug(`Performing ${methodName} on service ${serviceName} with`, id, params)
        json = await service[methodName](id, params)
        break
      case 'patch':
      case 'update':
        debug(`Performing ${methodName} on service ${serviceName} with`, id, data, params)
        json = await service[methodName](id, data, params)
        break
      case 'create':
      default: // Should manage custom methods
        debug(`Performing ${methodName} on service ${serviceName} with`, data, params)
        if (options.data) json = await service[methodName](data, params)
        else {
          json = []
          for (let i = 0; i < data.length; ++i) {
            let results = await service[methodName](data[i], params)
            // Manage pagination
            if (results.data) results = results.data
            json = json.concat(results)
          }
        }
        break
    }
    // Manage pagination
    if (json.data) json = json.data
    debug(`${methodName} on service ${serviceName} returned ${json.length} results`)
    // Except if explicitely defined otherwise read operations store results while write operations do not
    const updateResult = (_.has(options, 'updateResult') ? _.get(options, 'updateResult') : ['find', 'get'].includes(methodName))
    if (updateResult) {
      // Allow transform after read
      if (options.transform) {
        const templatedTransform = templateObject(item, options.transform)
        json = transformJsonObject(json, templatedTransform)
      }

      _.set(hook, options.dataPath || 'result.data', json)
    }
    return hook
  }
}
