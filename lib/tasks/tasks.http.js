import _ from 'lodash'
import request from 'request'
import makeDebug from 'debug'

const debug = makeDebug('krawler:tasks')

// Build the request parameters to download data from input data source
export function getRequestParameters (options) {
  const queryParameters = _.merge({}, _.omit(options, ['url', 'method', 'body', 'headers', 'timeout', 'auth', 'oauth', 'jar']))
  const requestParameters = {
    url: options.url,
    body: options.body,
    headers: options.headers,
    timeout: options.timeout,
    jar: options.jar,
    qs: queryParameters,
    qsStringifyOptions: { arrayFormat: 'repeat' }
  }
  // Setup request with URL & params
  debug('Requesting with the following parameters', requestParameters)
  return requestParameters
}

// Create the request stream for a task
export function createRequestStream (options) {
  const method = options.method || 'GET'
  return request(Object.assign({ method }, getRequestParameters(options)))
}

export default createRequestStream
