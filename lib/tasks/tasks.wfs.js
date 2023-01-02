import { createRequestStream as createHttpRequestStream } from './tasks.http.js'

// Create the request stream for a task
function createRequestStream (options) {
  return createHttpRequestStream(Object.assign({
    // Default values
    service: 'WFS',
    request: 'GetFeature'
  }, options))
}

export default createRequestStream
