import { createRequestStream as createHttpRequestStream } from './tasks.http.js'

// Create the request stream for a task
function createRequestStream (options) {
  return createHttpRequestStream(Object.assign({
    // Default URL
    url: 'https://lz4.overpass-api.de/api/interpreter'
  }, options))
}

export default createRequestStream
