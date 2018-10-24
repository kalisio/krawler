import _ from 'lodash'
import request from 'request'
import makeDebug from 'debug'

const debug = makeDebug('krawler:tasks')

// Build the request parameters to download data from input data source
function getRequestParameters (options) {
  let queryParameters = _.merge({}, _.omit(options, ['url', 'headers', 'timeout', 'subsets']))
  queryParameters.service = 'WCS'
  // If request type if not provided set default value
  if (!queryParameters.request) queryParameters.request = 'GetCoverage'
  // Convert from a json subset key/value to standard, eg height: 10 => height(10)
  if (options.subsets) {
    queryParameters.subset = []
    _.forOwn(options.subsets, (value, key) => {
      if (!_.isNil(value)) queryParameters.subset.push(key + '(' + value + ')')
    })
  }
  // Setup request with URL & params
  debug('Requesting ' + options.url + ' with following parameters', queryParameters)
  return {
    url: options.url,
    headers: options.headers,
    timeout: options.timeout,
    qs: queryParameters,
    qsStringifyOptions: { arrayFormat: 'repeat' }
  }
}

// Create the request stream for a task
function createRequestStream (options) {
  return request.get(getRequestParameters(options))
}

export default createRequestStream
