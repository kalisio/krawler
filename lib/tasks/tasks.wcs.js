import _ from 'lodash'
import { createRequestStream as createHttpRequestStream } from './tasks.http.js'

// Create the request stream for a task
function createRequestStream (options) {
  options = Object.assign({
    // Default values
    service: 'WCS',
    request: 'GetCoverage'
  }, options)
  // Convert from a json subset key/value to standard, eg height: 10 => height(10)
  if (options.subsets) {
    options.subset = []
    _.forOwn(options.subsets, (value, key) => {
      if (!_.isNil(value)) options.subset.push(key + '(' + value + ')')
    })
    delete options.subsets
  }
  return createHttpRequestStream(options)
}

export default createRequestStream
