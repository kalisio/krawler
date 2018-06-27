import uuid from 'uuid/v1'
import _ from 'lodash'
import makeDebug from 'debug'
import { callOnHookItems, templateObject } from '../utils'

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
    _.forOwn(templatedOptions, function(value, key) {
	  if (!_.has(item, key)) _.set(item, key, value)
	})
    debug('Templated item', item)
  })
}
