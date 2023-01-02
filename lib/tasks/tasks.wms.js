import { createRequestStream as createHttpRequestStream } from './tasks.http.js'

// Create the request stream for a task
function createRequestStream (options) {
  return createHttpRequestStream(Object.assign({
    // Default values
    service: 'WMS',
    request: 'GetMap'
  }, options))
}

export default createRequestStream
