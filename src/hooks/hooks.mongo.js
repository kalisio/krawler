import _ from 'lodash'
import { MongoClient, MongoError } from 'mongodb'
import makeDebug from 'debug'

const debug = makeDebug('krawler:hooks:mongo')

// Connect to the mongo database
export function connectMongo (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'connectMongo' hook should only be used as a 'before' hook.`)
    }

    debug('Connecting to MongoDB for ' + hook.data.id)
    let client = await MongoClient.connect(options.url, _.omit(options, ['url', 'dbName']))
    client.db = client.db(options.dbName || options.url.substring(options.url.lastIndexOf('/') + 1))
    _.set(hook.data, options.clientPath || 'client', client)
    debug('Connected to MongoDB for ' + hook.data.id)
    return hook
  }
}

// Disconnect from the database
export function disconnectMongo (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'disconnectMongo' hook should only be used as a 'after' hook.`)
    }
    let client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error(`You must be connected to MongoDB before using the 'disconnectMongo' hook`)
    }

    debug('Disconnecting from MongoDB for ' + hook.data.id)
    await client.logout()
    _.unset(hook, options.clientPath || 'data.client')
    debug('Disconnected from MongoDB for ' + hook.data.id)
    return hook
  }
}

// Drop a collection
export function dropMongoCollection (options = {}) {
  return async function (hook) {
    let client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error(`You must be connected to MongoDB before using the 'dropMongoCollection' hook`)
    }

    // Drop the collection
    let collection = _.get(options, 'collection', _.snakeCase(hook.result.id))
    debug('Droping the ' + collection + ' collection')
    try {
      await client.db.dropCollection(collection)
    } catch (error) {
      // If collection does not exist we do not raise
      if (error instanceof MongoError && error.code === 26) {
        debug(collection + ' collection does not exist, skipping drop')
        return hook
      } else {
        // Rethrow
        throw error
      }
    }
    return hook
  }
}

// Create a collection
export function createMongoCollection (options = {}) {
  return async function (hook) {
    let client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error(`You must be connected to MongoDB before using the 'createMongoCollection' hook`)
    }

    // Create the collection
    let collection = _.get(options, 'collection', _.snakeCase(hook.result.id))
    debug('Creating the ' + collection + ' collection')
    collection = await client.db.createCollection(collection)
    // Add index if required
    if (options.index) {
      collection.ensureIndex(options.index)
    }
    return hook
  }
}

// Insert a JSON
export function writeMongoCollection (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'writeMongoCollection' hook should only be used as a 'after' hook.`)
    }
    let client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error(`You must be connected to MongoDB before using the 'writeMongoCollection' hook`)
    }

    // Defines the chunks
    let geojson = _.get(hook, options.dataPath || 'result.data', {})
    let chunks = []
    if (geojson.type === 'FeatureCollection') {
      chunks = _.chunk(geojson.features, _.get(options, 'chunkSize', 10))
    } else if (geojson.type === 'Feature') {
      chunks.push([geojson])
    }

    // Write the chunks
    let collection = _.get(options, 'collection', _.snakeCase(hook.result.id))
    debug('Inserting GeoJSON in the ' + collection + ' collection')
    collection = client.db.collection(collection)
    for (let i = 0; i < chunks.length; ++i) {
      await collection.bulkWrite(chunks[i].map(chunk => {
        return { insertOne: { document: chunk } }
      }))
    }
    return hook
  }
}
