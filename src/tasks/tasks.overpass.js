import _ from 'lodash'
import request from 'request'
import makeDebug from 'debug'

const debug = makeDebug('krawler:tasks')

const defaultUrl = 'https://www.overpass-api.de/api/interpreter'

// Build the request parameters to download data from input data source
function getRequestParameters (options) {
  let queryParameters = _.merge({}, _.omit(options, ['url', 'headers', 'timeout']))
  // Setup request with URL & params
  debug('Requesting ' + options.url || defaultUrl + ' with following parameters', queryParameters)
  return {
    url: options.url || defaultUrl,
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
