import aws from 'aws-sdk'
import store from 's3-blob-store'
import makeDebug from 'debug'

const debug = makeDebug('krawler:stores')

// Create the fs store
function createStore (options, id) {
  debug('Creating S3 store ' + id + ' with following parameters', options)
  const s3 = new aws.S3(options.client)
  return store({
    client: s3,
    bucket: options.bucket
  })
}

export default createStore
