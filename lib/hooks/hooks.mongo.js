import _ from 'lodash'
import mongo from 'mongodb'
import makeDebug from 'debug'
// import { getItems } from 'feathers-hooks-common'
import {
  template, templateObject, templateQueryObject, transformJsonObject, getStoreFromHook,
  getChunks, mergeErrors
} from '../utils.js'

const { MongoClient, MongoError, GridFSBucket } = mongo
const debug = makeDebug('krawler:hooks:mongo')

// Utility function to create/drop indices
async function dropIndex (collection, collectionName, index) {
  try {
    debug('Dropping index on collection ' + collectionName, index)
    await collection.dropIndex(index)
  } catch (error) {
    // If index does not exist we do not raise
    if (error instanceof MongoError && error.code === 27) {
      debug(collectionName + ' collection index does not exist, skipping drop')
    } else {
      // Rethrow
      throw error
    }
  }
}
async function createIndex (collection, collectionName, index) {
  try {
    // As arguments or single object ?
    if (Array.isArray(index)) {
      debug('Creating index on collection ' + collectionName, ...index)
      await collection.createIndex(...index)
    } else {
      debug('Creating index on collection ' + collectionName, index)
      await collection.createIndex(index)
    }
  } catch (error) {
    // If index already exists with different options we do not raise
    if (error instanceof MongoError && error.code === 85) {
      debug(collectionName + ' collection index does already exist with different options, skipping create')
    } else {
      // Rethrow
      throw error
    }
  }
}

// Connect to the mongo database
export function connectMongo (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    let client = _.get(item, options.clientPath || 'client')
    if (client) {
      debug('Already connected to MongoDB for ' + item.id)
      return hook
    }
    debug('Connecting to MongoDB for ' + item.id)
    client = await MongoClient.connect(options.url, _.merge(_.omit(options, ['hook', 'url', 'dbName', 'clientPath']), { useNewUrlParser: true }))
    let dbName = options.dbName
    if (!dbName) {
      // Extract database name.  Need to remove the connections options if any
      const indexOfDBName = options.url.lastIndexOf('/') + 1
      const indexOfOptions = options.url.indexOf('?')
      if (indexOfOptions === -1) dbName = options.url.substring(indexOfDBName)
      else dbName = options.url.substring(indexOfDBName, indexOfOptions)
    }
    client.db = client.db(dbName)
    _.set(item, options.clientPath || 'client', client)
    debug('Connected to MongoDB for ' + item.id)
    return hook
  }
}

// Disconnect from the database
export function disconnectMongo (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      debug('Already disconnected from MongoDB for ' + item.id)
      return hook
    }

    debug('Disconnecting from MongoDB for ' + item.id)
    await client.close()
    _.unset(item, options.clientPath || 'client')
    debug('Disconnected from MongoDB for ' + item.id)
    return hook
  }
}

// Drop a collection
export function dropMongoCollection (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'dropMongoCollection\' hook')
    }

    // Drop the collection
    const collection = template(item, _.get(options, 'collection', _.snakeCase(item.id)))
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
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'createMongoCollection\' hook')
    }

    const collectionName = template(item, _.get(options, 'collection', _.snakeCase(item.id)))
    // Check if already exist (strict mode requires a callback)
    let collection = await new Promise((resolve, reject) => {
      client.db.collection(collectionName, { strict: true }, (error, collection) => {
        // If it does not exist we will create it
        if (error) resolve(null)
        else resolve(collection)
      })
    })
    // Create the collection if required
    if (!collection) {
      debug('Creating the ' + collectionName + ' collection')
      collection = await client.db.createCollection(collectionName)
    }
    // Add index if required
    if (options.index) {
      await createIndex(collection, collectionName, options.index)
    } else if (options.indices) { // Or multiple indices
      // As arguments or single object ?
      for (let i = 0; i < options.indices.length; i++) {
        const index = options.indices[i]
        await createIndex(collection, collectionName, index)
      }
    }
    return hook
  }
}

// Drop an index
export function dropMongoIndex (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'dropMongoCollection\' hook')
    }

    const collectionName = template(item, _.get(options, 'collection', _.snakeCase(item.id)))
    // Check if already exist (strict mode requires a callback)
    const collection = await new Promise((resolve, reject) => {
      client.db.collection(collectionName, { strict: true }, (error, collection) => {
        // If it does not exist we will create it
        if (error) resolve(null)
        else resolve(collection)
      })
    })
    if (!collection) {
      debug(collection + ' collection does not exist, skipping dropping index')
      return hook
    }
    // Drop index if required
    if (options.index) {
      await dropIndex(collection, collectionName, options.index)
    } else if (options.indices) { // Or multiple indices
      for (let i = 0; i < options.indices.length; i++) {
        const index = options.indices[i]
        await dropIndex(collection, collectionName, index)
      }
    }
    return hook
  }
}

// Create an index
export function createMongoIndex (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'createMongoCollection\' hook')
    }

    const collectionName = template(item, _.get(options, 'collection', _.snakeCase(item.id)))
    // Check if already exist (strict mode requires a callback)
    const collection = await new Promise((resolve, reject) => {
      client.db.collection(collectionName, { strict: true }, (error, collection) => {
        // If it does not exist we will create it
        if (error) resolve(null)
        else resolve(collection)
      })
    })
    // Create the collection if required
    if (!collection) {
      debug(collection + ' collection does not exist, skipping creating index')
      return hook
    }
    // Add index if required
    if (options.index) {
      await createIndex(collection, collectionName, options.index)
    } else if (options.indices) { // Or multiple indices
      for (let i = 0; i < options.indices.length; i++) {
        const index = options.indices[i]
        await createIndex(collection, collectionName, index)
      }
    }
    return hook
  }
}

// Retrieve JSON documents from a collection
export function readMongoCollection (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'readMongoCollection\' hook')
    }

    const collectionName = template(item, _.get(options, 'collection', _.snakeCase(item.id)))
    const collection = client.db.collection(collectionName)
    const templatedQuery = templateQueryObject(item, options.query || {}, _.omit(options, ['query']))
    const query = collection.find(templatedQuery)
    if (options.project) query.project(options.project)
    if (options.sort) query.sort(options.sort)
    if (options.limit) query.limit(options.limit)
    if (options.skip) query.skip(options.skip)
    debug(`Querying collection ${collectionName} with`, templatedQuery)
    let json = await query.toArray()
    // Allow transform after read
    if (options.transform) {
      const templatedTransform = templateObject(item, options.transform)
      json = transformJsonObject(json, templatedTransform)
    }

    _.set(hook, options.dataPath || 'result.data', json)
    return hook
  }
}

// Insert JSON document(s) in a collection
export function writeMongoCollection (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'writeMongoCollection\' hook')
    }

    const collectionName = template(item, _.get(options, 'collection', _.snakeCase(item.id)))
    const collection = client.db.collection(collectionName)
    // Defines the chunks
    const chunks = getChunks(hook, options)

    // Write the chunks
    const errors = []
    for (let i = 0; i < chunks.length; ++i) {
      debug(`Inserting ${chunks[i].length} JSON document in the ${collectionName} collection `)
      try {
        await collection.bulkWrite(chunks[i].map(chunk => {
          return { insertOne: { document: chunk } }
        }), options)
      } catch (error) {
        // Raise on first error ?
        if (options.raiseOnChunkError) throw error
        // Otherwise continue until all chunks have been processed
        errors.push(error)
      }
    }
    if (errors.length > 0) {
      throw mergeErrors(errors)
    }
    return hook
  }
}

// Update JSON document(s) in a collection
export function updateMongoCollection (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'updateMongoCollection\' hook')
    }

    const collectionName = template(item, _.get(options, 'collection', _.snakeCase(item.id)))
    const collection = client.db.collection(collectionName)
    // Defines the chunks
    const chunks = getChunks(hook, options)

    // Write the chunks
    const errors = []
    for (let i = 0; i < chunks.length; ++i) {
      debug(`Updating ${chunks[i].length} JSON document in the ${collectionName} collection `)
      try {
        await collection.bulkWrite(chunks[i].map(chunk => {
          return {
            updateOne: {
              filter: templateQueryObject(chunk, options.filter || {}, _.omit(options, ['filter'])),
              upsert: options.upsert || false,
              hint: options.hint,
              update: { $set: _.omit(chunk, ['_id']) } // _id is immutable in Mongo
            }
          }
        }), options)
      } catch (error) {
        // Raise on first error ?
        if (options.raiseOnChunkError) throw error
        // Otherwise continue until all chunks have been processed
        errors.push(error)
      }
    }
    if (errors.length > 0) {
      throw mergeErrors(errors)
    }
    return hook
  }
}

// Create aggregation
export function createMongoAggregation (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'createMongoAggregation\' hook')
    }

    const collectionName = template(item, _.get(options, 'collection', _.snakeCase(item.id)))
    const collection = client.db.collection(collectionName)
    let pipeline = options.pipeline
    if (_.isNil(pipeline)) {
      throw new Error('You must define a pipeline to use the \'createMongoAggregation\' hook')
    }
    if (!Array.isArray(pipeline)) pipeline = [pipeline]
    const stages = []
    pipeline.forEach(stage => {
      stages.push(templateQueryObject(item, stage))
    })
    debug(`Creating aggregation on collection ${collectionName} with the pipeline `, stages)
    const cursor = await collection.aggregate(stages, _.omit(options, ['pipeline', 'collection', 'transform', 'dataPath']))
    let result = await cursor.toArray()
    // Allow transform after aggregation
    if (options.transform) {
      const templatedTransform = templateObject(item, options.transform)
      result = transformJsonObject(result, templatedTransform)
    }
    _.set(hook, options.dataPath || 'result.data', result)
    return hook
  }
}

// Delete documents in a collection
export function deleteMongoCollection (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'deleteMongoCollection\' hook')
    }

    const collectionName = template(item, _.get(options, 'collection', _.snakeCase(item.id)))
    const collection = client.db.collection(collectionName)
    const templatedQuery = templateQueryObject(item, options.filter || {}, _.omit(options, ['filter']))
    debug(`Deleting documents in collection ${collectionName} with`, templatedQuery)
    await collection.deleteMany(templatedQuery)
    return hook
  }
}

// Create a GridFS bucket
export function createMongoBucket (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'createMongoCollection\' hook')
    }

    const bucketName = template(item, _.get(options, 'bucket', _.snakeCase(item.id)))
    // Check if already exist (strict mode requires a callback)
    let bucket = await new Promise((resolve, reject) => {
      client.db.collection(bucketName + '.files', { strict: true }, (error, collection) => {
        // If it does not exist we will create it
        if (error) resolve(null)
        else resolve(collection)
      })
    })

    if (!bucket) {
      debug('Creating the ' + bucketName + ' bucket')
      bucket = new GridFSBucket(client.db, Object.assign({
        chunkSizeBytes: 8 * 1024 * 1024,
        bucketName
      }, options))
      _.set(client, `buckets.${bucketName}`, bucket)
    }
    return hook
  }
}

// Read file from a bucket
export function readMongoBucket (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'readMongoBucket\' hook')
    }

    const bucketName = template(item, _.get(options, 'bucket', _.snakeCase(item.id)))
    const bucket = _.get(client, `buckets.${bucketName}`)
    const filePath = template(item, options.key || item.id)
    const store = await getStoreFromHook(hook, 'writeMongoBucket', options)
    debug(`Extracting ${filePath} from the ${bucketName} bucket `)
    return new Promise((resolve, reject) => {
      bucket.openDownloadStreamByName(filePath)
        .pipe(store.createWriteStream(filePath))
        .on('error', reject)
        .on('finish', _ => resolve(hook))
    })
  }
}

// Insert file in a bucket
export function writeMongoBucket (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'writeMongoBucket\' hook')
    }

    const bucketName = template(item, _.get(options, 'bucket', _.snakeCase(item.id)))
    const bucket = _.get(client, `buckets.${bucketName}`)
    const templatedMetadata = templateQueryObject(item, options.metadata)
    const filePath = template(item, options.key || item.id)
    const store = await getStoreFromHook(hook, 'writeMongoBucket', options)
    debug(`Inserting ${filePath} in the ${bucketName} bucket `)
    return new Promise((resolve, reject) => {
      store.createReadStream(filePath)
        .pipe(bucket.openUploadStream(filePath, { metadata: templatedMetadata }))
        .on('error', reject)
        .on('finish', _ => resolve(hook))
    })
  }
}

// Delete file in a bucket
export function deleteMongoBucket (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'deleteMongoBucket\' hook')
    }

    const bucketName = template(item, _.get(options, 'bucket', _.snakeCase(item.id)))
    const bucket = _.get(client, `buckets.${bucketName}`)
    const filePath = template(item, options.key || item.id)

    const results = await bucket.find({ filename: filePath }).toArray()
    if (results.length > 0) {
      debug(`Deleting ${filePath} in the ${bucketName} bucket `)
      await bucket.delete(results[0]._id)
    } else throw Error(`Cannot delete ${filePath} in the ${bucketName} bucket`)
    return hook
  }
}

// Drop a bucket
export function dropMongoBucket (options = {}) {
  return async function (hook) {
    const item = hook.data // getItems(hook)
    const client = _.get(item, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error('You must be connected to MongoDB before using the \'readMongoBucket\' hook')
    }

    const bucketName = template(item, _.get(options, 'bucket', _.snakeCase(item.id)))
    const bucket = _.get(client, `buckets.${bucketName}`)
    await bucket.drop()
    debug(`Dropping the ${bucketName} bucket `)
    return hook
  }
}
