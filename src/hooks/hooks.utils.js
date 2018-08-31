import uuid from 'uuid/v1'
import sift from 'sift'
import _ from 'lodash'
import makeDebug from 'debug'
import { callOnHookItems, templateObject, templateQueryObject, transformJsonObject } from '../utils'

const debug = makeDebug('krawler:hooks:utils')

// Generate UUID
export function generateId (options = {}) {
  return callOnHookItems(item => {
    item.id = uuid()
    debug('Generated uuid', item.id)
  })
}

// Apply a template
export function template (options = {}) {
  return callOnHookItems(item => {
    const templatedOptions = templateObject(item, options)
    // Use templated property if not provided in item
    _.forOwn(templatedOptions, function (value, key) {
      if (!_.has(item, key)) _.set(item, key, value)
    })
    debug('Templated item', item)
  })
}

// Set the skip flag based on item properties
export function discardIf (options = {}) {
  return callOnHookItems(item => {
    const templatedFilter = templateQueryObject(item, options)
    // Check if hooks have to be executed or not depending on item properties
    const discard = !_.isEmpty(sift(templatedFilter, [item]))
    if (discard) {
      debug('Discarding ' + item.id + ' due to filter', templatedFilter)
      item.skip = true
    }
  })
}

// Emit event
export function emitEvent (options = {}) {
  return callOnHookItems((item, hook) => {
    let event = { type: options.type }
    event.data = transformJsonObject(item, options)
    hook.service.emit('krawler', event)
    debug('Emitted event for item ', item.id)
  })
}
