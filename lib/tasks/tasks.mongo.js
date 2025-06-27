import _ from 'lodash'
import makeDebug from 'debug'
import mongo from 'mongodb'
import { Transform } from 'stream'
const debug = makeDebug('krawler:tasks')

// Create the mongo stream for a task
function createMongoStream (options, id) {
  const client = _.get(options, options.clientPath || 'client')
  if (_.isNil(client)) {
    throw new Error('You must be connected to MongoDB before creating a mongo task')
  }
  const collectionName = _.get(options, 'collection', _.snakeCase(id))
  const collection = client.db.collection(collectionName)
  const query = collection.find(options.query || {})
  if (options.project) query.project(options.project)
  if (options.sort) query.sort(options.sort)
  if (options.limit) query.limit(options.limit)
  if (options.skip) query.skip(options.skip)
  debug('Reading ' + id + ' from mongo with following query', options.query)
  const transform = new Transform({
    objectMode: true,
    firstChunkReceived: false,
    transform(chunk, encoding, callback) {
      const objectAsJson = JSON.stringify(chunk)
      // We'd like to write a JSON array otherwise this will not be a valid JSON file
      callback(null, Buffer.from(this.firstChunkReceived ? ',' + objectAsJson : '[' + objectAsJson))
      this.firstChunkReceived = true
    },
    flush(callback) {
      // We'd like to write a JSON array otherwise this will not be a valid JSON file
      callback(null, Buffer.from(']'))
    }
  })
  return query.stream().pipe(transform)
}

export default createMongoStream
