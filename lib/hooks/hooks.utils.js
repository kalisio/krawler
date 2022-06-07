import uuid from 'uuid/v1.js'
import sift from 'sift'
import _ from 'lodash'
import common from 'feathers-hooks-common'
import makeDebug from 'debug'
import { Healthcheck } from '../healthcheck.js'
import { callOnHookItems, templateObject, templateQueryObject, transformJsonObject } from '../utils.js'

const { getItems } = common
const debug = makeDebug('krawler:hooks:utils')

// Generate UUID
export function generateId (options = {}) {
  return callOnHookItems(options)(item => {
    item.id = uuid()
    debug('Generated uuid', item.id)
  })
}

// Apply a template
export function template (options = {}) {
  return callOnHookItems(options)(item => {
    const templatedOptions = templateObject(item, options)
    // Use templated property if not provided in item
    _.forOwn(templatedOptions, function (value, key) {
      if (!_.has(item, key)) _.set(item, key, value)
    })
    debug('Templated item', item)
  })
}

// Set the skip flag based on predicate or item properties filter
export function discardIf (options = {}) {
  return callOnHookItems(options)(async item => {
    const templatedFilter = templateQueryObject(item, _.omit(options, ['predicate']))
    // Check if hooks have to be executed or not depending on item properties
    let discard = !_.isEmpty(sift(templatedFilter, [item]))
    // If yes check for a user-given predicate function as well
    if (discard && (typeof options.predicate === 'function')) {
      discard = await options.predicate(item)
    }
    if (discard) {
      debug('Discarding ' + item.id + ' due to filter', templatedFilter)
      item.skip = true
    }
  })
}

// Emit event
export function emitEvent (options = {}) {
  return callOnHookItems(options)((item, hook) => {
    const templatedOptions = templateObject(item, options)
    const event = { name: templatedOptions.name }
    event.data = transformJsonObject(item, templatedOptions)
    hook.service.emit('krawler', event)
    debug('Emitted event for item ', item.id)
  })
}

// Apply a custom function on hook items
export function apply (options) {
  // If we don't use hook items use selector
  if (options.dataPath) {
    return async function (hook) {
      const item = _.get(hook, options.dataPath)
      if (item) {
        await options.function(item)
        debug('Applied function on item', item)
      }
      return hook
    }
  } else {
    return callOnHookItems(options)(async item => {
      await options.function(item)
      debug('Applied function on item', item)
    })
  }
}

// Apply a custom function on healthcheck state
export function healthcheck (options) {
  return async function (hook) {
    let hookObject = hook
    // Handle error hooks as usual
    if (hook.type === 'error') hookObject = hook.original
    // Retrieve the items from the hook and send it to healthcheck function
    options.function(getItems(hookObject), Healthcheck)
    debug('Applied function on Healthcheck', Healthcheck)
  }
}
