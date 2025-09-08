import _ from 'lodash'
import feathers from '@feathersjs/client'
import io from 'socket.io-client'
import fetch from 'node-fetch'
import makeDebug from 'debug'
// import { getItems } from 'feathers-hooks-common'
import {
  template, templateObject, templateQueryObject, transformJsonObject,
  getChunks, mergeErrors
} from '../utils.js'

const debug = makeDebug('krawler:hooks:feathers')
const StandardMethods = ['find', 'get', 'create', 'update', 'patch', 'remove']

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
    if (options.distributed) {
      // If we use distributed services then the client is the app itself
      client = hook.app
    } else {
      client = feathers()
      let transporter
      if (options.transport === 'websocket') {
        const socket = io(options.origin, {
          transports: ['websocket'],
          path: options.path
        })
        transporter = feathers.socketio(socket)
        client.configure(transporter)
      } else {
        transporter = feathers.rest(options.origin).fetch(fetch)
        client.configure(transporter)
      }
      // Register services up-front (required for custom methods)
      if (options.customMethods) {
        options.customMethods.forEach(entry => {
          const service = transporter.service(entry.servicePath)
          client.use(entry.servicePath, service, {
            methods: StandardMethods.concat(entry.methods)
          })
        })
      }
      if (options.authentication) {
        client.configure(feathers.authentication({
          path: options.authentication.path || '/authentication'
        }))
        const payload = _.omit(options.authentication, ['path'])
        await client.authenticate(payload)
      }
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

function isReadOperation (methodName) {
  return ['find', 'get'].includes(methodName)
}

function isDataOperation (methodName) {
  return ['create', 'patch', 'update'].includes(methodName)
}

function isCustomOperation (methodName) {
  return !StandardMethods.includes(methodName)
}

function templateParams (item, options) {
  // Either we have the complete params object or only the query shortcut
  const templatedQuery = templateQueryObject(item,
    _.get(options, 'params.query', _.get(options, 'query', {})))
  // Avoid templating the special query object already managed above
  const params = (options.params ? templateObject(item, _.omit(options.params, ['query'])) : {})
  params.query = templatedQuery
  return params
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
    const id = _.has(options, 'id') ? options.id : item.id
    // Defines the data object from options or as hook item chunks
    let data
    if (options.data) {
      data = templateObject(item, options.data)
    } else if (isDataOperation(methodName) || isCustomOperation(methodName)) {
      // For write operations allow transform before write by passing transform options for chunking
      data = getChunks(hook, options)
      // Take care that for single data we need to extract transformed item from first chunks
      if ((data.length === 1) && (data[0].length === 1)) data = data[0][0]
      // Only create supports chunks
      else if (methodName !== 'create') data = _.flatten(data)
    }
    // Params will be based on templating options with data for operations with data,
    // based on item (i.e. task) otherwise
    let params, json
    const errors = []
    switch (methodName) {
      case 'find':
        params = templateParams(item, options)
        debug(`Performing ${methodName} on service ${serviceName} with`, params)
        json = await service[methodName](params)
        break
      case 'get':
        params = templateParams(item, options)
        debug(`Performing ${methodName} on service ${serviceName} with`, id, params)
        json = await service[methodName](id, params)
        break
      case 'remove':
        params = templateParams(item, options)
        debug(`Performing ${methodName} on service ${serviceName} with`, id, params)
        json = await service[methodName](id, params)
        break
      case 'patch':
      case 'update':
        // In this case we allow templating based on individual items
        if (!Array.isArray(data)) {
          params = templateParams(data, options)
          debug(`Performing ${methodName} on service ${serviceName} with`, id, data, params)
          json = await service[methodName](id, data, params)
        } else { // Manage multiple items and associated results, in this case id should be null
          json = []
          for (let i = 0; i < data.length; ++i) {
            params = templateParams(data[i], options)
            debug(`Performing ${methodName} on service ${serviceName} with`, id, data[i], params)
            try {
              const result = await service[methodName](id, data[i], params)
              json.push(result)
            } catch (error) {
              // Raise on first error ?
              if (options.raiseOnItemError) throw error
              // Otherwise continue until all items have been processed
              errors.push(error)
            }
          }
        }
        break
      case 'create':
      default: // Should manage custom methods
        // In this case we allow templating based on individual items
        if (!Array.isArray(data)) {
          params = templateParams(data, options)
          debug(`Performing ${methodName} on service ${serviceName} with`, data, params)
          json = await service[methodName](data, params)
        } else { // Manage chunks and associated results
          json = []
          for (let i = 0; i < data.length; ++i) {
            params = templateParams(data[i], options)
            debug(`Performing ${methodName} on service ${serviceName} with`, data[i], params)
            try {
              let results = await service[methodName](data[i], params)
              // Manage pagination
              if (results.data) results = results.data
              json = json.concat(results)
            } catch (error) {
              // Raise on first error ?
              if (options.raiseOnChunkError) throw error
              // Otherwise continue until all chunks have been processed
              errors.push(error)
            }
          }
        }
        break
    }
    // Manage pagination for find or multi patch/update/remove
    if (json) {
      if (json.data) json = json.data
      if (!Array.isArray(json)) json = [json]
      debug(`${methodName} on service ${serviceName} returned ${json.length} result(s)`, json)
      // Allow transform after read
      if (isReadOperation(methodName) && options.transform) {
        const templatedTransform = templateObject(item, options.transform)
        json = transformJsonObject(json, templatedTransform)
      }
      // Except if explicitely defined otherwise read operations store results while write operations do not
      const updateResult = (_.has(options, 'updateResult') ? _.get(options, 'updateResult') : isReadOperation(methodName) || isCustomOperation(methodName))
      if (updateResult) _.set(hook, options.dataPath || 'result.data', json)
    }

    if (errors.length > 1) {
      throw mergeErrors(errors)
    } else if (errors.length > 0) {
      throw errors[0]
    }
    return hook
  }
}
