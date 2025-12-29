import _ from 'lodash'
import chai from 'chai'
import chailint from 'chai-lint'
import path, { dirname } from 'path'
import fs from 'fs-extra'
import fsStore from 'fs-blob-store'
import { hooks as pluginHooks } from '../lib/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

describe('krawler:hooks:mongo', () => {
  const inputStore = fsStore({ path: path.join(__dirname, 'data') })
  const outputStore = fsStore({ path: path.join(__dirname, 'output') })
  let geojson

  before(() => {
    chailint(chai, util)
    geojson = fs.readJsonSync(path.join(inputStore.path, 'geojson.json'))
    // Add invalid data breaking the unique index rule to check for error management
    geojson.features.unshift(_.cloneDeep(geojson.features[0]))
    geojson.features.push(_.cloneDeep(geojson.features[0]))
  })

  const mongoOptions = {
    url: 'mongodb://127.0.0.1:27017/<%= dbName %>'
  }

  const mongoHook = {
    type: 'before',
    data: {
      dbName: 'krawler-test'
    },
    params: {}
  }

  it('connect to MongoDB', async () => {
    await pluginHooks.connectMongo(mongoOptions)(mongoHook)
    expect(mongoHook.data.client).toExist()
    expect(mongoHook.data.client.db).toExist()
    expect(mongoHook.data.client.isConnected()).beTrue()
  })
  // Let enough time to proceed
    .timeout(5000)

  it('connect to MongoDB again', async () => {
    const result = await pluginHooks.connectMongo(mongoOptions)(mongoHook).then(ok => ok, no => no)
    expect(result).to.be.equal(mongoHook)
  })

  it('creates MongoDB collection', async () => {
    await pluginHooks.createMongoCollection({
      collection: 'geojson',
      indices: [{ geometry: '2dsphere' }, [{ id: 1 }, { unique: true }]]
    })(mongoHook)
    const collections = await mongoHook.data.client.db.listCollections({ name: 'geojson' }).toArray()
    expect(collections.length === 1).beTrue()
  })
  // Let enough time to proceed
    .timeout(5000)

  it('writes MongoDB collection', async () => {
    mongoHook.type = 'after'
    mongoHook.result = mongoHook.data
    mongoHook.result.data = geojson
    try {
      await pluginHooks.writeMongoCollection({
        collection: 'geojson',
        // Ensure we use multiple chunks for testing purpose
        chunkSize: 2,
        transform: {
          omit: ['properties.prop2'],
          inPlace: false
        }
      })(mongoHook)
    } catch (error) {
      expect(error).toExist()
      // console.log(error)
      expect(error.writeErrors).toExist()
      expect(error.writeErrors.length).to.equal(2)
      expect(error.result).toExist()
      expect(error.result.insertedIds).toExist()
      expect(error.result.insertedIds.length).to.equal(3)
      expect(error.result.nInserted).to.equal(1)
      // error.writeErrors.forEach(data => console.log(data))
      expect(error.name).to.equal('BulkWriteError')
    }
    const collection = mongoHook.data.client.db.collection('geojson')
    let results = await collection.find({}).toArray()
    expect(results.length).to.equal(3)
    results = await collection.find({
      geometry: { $near: { $geometry: { type: 'Point', coordinates: [102, 0.5] }, $maxDistance: 5000 } }
    }).toArray()
    expect(results.length).to.equal(1)
    expect(results[0].properties).toExist()
    expect(results[0].properties.prop0).to.equal('value0')
    expect(results[0].properties.prop2).beUndefined()
  })
  // Let enough time to proceed
    .timeout(5000)

  it('reads MongoDB collection', async () => {
    await pluginHooks.readMongoCollection({
      collection: 'geojson',
      query: {
        geometry: { $near: { $geometry: { type: 'Point', coordinates: [102, 0.5] }, $maxDistance: 500000 } }
      },
      project: { properties: 1 },
      skip: 1,
      limit: 2,
      dataPath: 'result.data'
    })(mongoHook)
    const results = mongoHook.result.data
    expect(results.length).to.equal(2)
    expect(results[0].geometry).beUndefined()
    expect(results[0].properties).toExist()
    expect(results[0].properties.prop0).to.equal('value0')
    expect(results[0].properties.prop1).toExist()
  })
  // Let enough time to proceed
    .timeout(5000)

  it('create MongoDB aggregation and skip some pipeline conversions', async () => {
    // 'inb' property is a number written in a string
    // request without skipping conversion => will not match
    await pluginHooks.createMongoAggregation({
      collection: 'geojson',
      pipeline: { $match: { 'properties.inb': '9999' } },
      dataPath: 'result.data'
    })(mongoHook)
    let results = mongoHook.result.data
    expect(results.length).to.equal(0)

    // request with skipping conversion => will match
    await pluginHooks.createMongoAggregation({
      collection: 'geojson',
      pipeline: { $match: { 'properties.inb': '9999' } },
      // we don't want conversions
      pipelineTemplateOptions: { skipAllConvert: true },
      dataPath: 'result.data'
    })(mongoHook)
    results = mongoHook.result.data
    expect(results.length).to.equal(1)
  })
  // Let enough time to proceed
    .timeout(5000)

  it('updates MongoDB collection with dotify', async () => {
    mongoHook.type = 'after'
    mongoHook.result.data = {
      type: 'FeatureCollection',
      features: geojson.features.map(feature => {
        feature.properties.prop0 = feature.id < 3 ? 'value1' : 'value0'
        return feature
      })
    }
    await pluginHooks.updateMongoCollection({
      collection: 'geojson',
      filter: { id: '<%= id %>' },
      dotify: true
    })(mongoHook)
    const collection = mongoHook.data.client.db.collection('geojson')
    const results = await collection.find({}).toArray()
    expect(results.length).to.equal(3)
    results.forEach(result => {
      if (result.id < 3) expect(result.properties.prop0).to.equal('value1')
      else expect(result.properties.prop0).to.equal('value0')
      expect(result.properties.prop1 || result.properties.inb).toExist()
    })
  })
  // Let enough time to proceed
    .timeout(5000)

  it('updates MongoDB collection', async () => {
    mongoHook.type = 'after'
    mongoHook.result.data = {
      type: 'FeatureCollection',
      features: geojson.features.map(feature => {
        delete feature.geometry
        delete feature.type
        if (feature.id < 3) feature.properties = { prop0: 'value1' }
        return feature
      })
    }
    await pluginHooks.updateMongoCollection({
      collection: 'geojson',
      filter: { id: '<%= id %>' }
    })(mongoHook)
    const collection = mongoHook.data.client.db.collection('geojson')
    const results = await collection.find({}).toArray()
    expect(results.length).to.equal(3)
    results.forEach(result => {
      expect(result.properties).toExist()
      if (result.id < 3) expect(result.properties.prop0).to.equal('value1')
      else expect(result.properties.prop0).to.equal('value0')
    })
  })
  // Let enough time to proceed
    .timeout(5000)

  it('create MongoDB aggregation', async () => {
    await pluginHooks.createMongoAggregation({
      collection: 'geojson',
      pipeline: {
        $group: {
          _id: '$geometry.type',
          num: { $sum: 1 }
        }
      },
      dataPath: 'result.data'
    })(mongoHook)
    const results = mongoHook.result.data
    expect(results.length).to.equal(3)
    expect(results[0].num).to.equal(1)
    expect(results[1].num).to.equal(1)
    expect(results[2].num).to.equal(1)
  })
  // Let enough time to proceed
    .timeout(5000)

  it('deletes MongoDB collection', async () => {
    await pluginHooks.deleteMongoCollection({ collection: 'geojson', filter: { 'geometry.type': 'Point' } })(mongoHook)
    const collection = mongoHook.data.client.db.collection('geojson')
    const results = await collection.find({ 'geometry.type': 'Point' }).toArray()
    expect(results.length).to.equal(0)
  })
  // Let enough time to proceed
    .timeout(5000)

  it('drops MongoDB collection', async () => {
    await pluginHooks.dropMongoCollection({ collection: 'geojson' })(mongoHook)
    const collections = await mongoHook.data.client.db.listCollections({ name: 'geojson' }).toArray()
    expect(collections.length === 0).beTrue()
  })
  // Let enough time to proceed
    .timeout(5000)

  it('creates MongoDB bucket', async () => {
    await pluginHooks.createMongoBucket({ bucket: 'data' })(mongoHook)
  })
  // Let enough time to proceed
    .timeout(5000)

  it('writes MongoDB bucket', async () => {
    mongoHook.result.store = inputStore
    await pluginHooks.writeMongoBucket({ bucket: 'data', metadata: { x: 'y' }, key: 'geojson.json' })(mongoHook)
    const collection = mongoHook.data.client.db.collection('data.files')
    const results = await collection.find({ filename: 'geojson.json' }).toArray()
    expect(results.length).to.equal(1)
    expect(results[0].metadata).toExist()
    expect(results[0].metadata.x).to.equal('y')
  })
  // Let enough time to proceed
    .timeout(5000)

  it('reads MongoDB bucket', async () => {
    mongoHook.result.store = outputStore
    await pluginHooks.readMongoBucket({ bucket: 'data', key: 'geojson.json' })(mongoHook)
    expect(fs.existsSync(path.join(outputStore.path, 'geojson.json'))).beTrue()
  })
  // Let enough time to proceed
    .timeout(5000)

  it('deletes MongoDB bucket', async () => {
    await pluginHooks.deleteMongoBucket({ bucket: 'data', key: 'geojson.json' })(mongoHook)
    const collection = mongoHook.data.client.db.collection('data.files')
    const results = await collection.find({ filename: 'geojson.json' }).toArray()
    expect(results.length).to.equal(0)
  })
  // Let enough time to proceed
    .timeout(5000)

  it('drops MongoDB bucket', async () => {
    await pluginHooks.dropMongoBucket({ bucket: 'data' })(mongoHook)
    let collections = await mongoHook.data.client.db.listCollections({ name: 'data.files' }).toArray()
    expect(collections.length === 0).beTrue()
    collections = await mongoHook.data.client.db.listCollections({ name: 'data.chuncks' }).toArray()
    expect(collections.length === 0).beTrue()
  })
  // Let enough time to proceed
    .timeout(5000)

  it('disconnect from MongoDB', async () => {
    // Cleanup
    await mongoHook.data.client.db.dropDatabase()
    await pluginHooks.disconnectMongo()(mongoHook)
    expect(mongoHook.data.client).beUndefined()
  })
  // Let enough time to proceed
    .timeout(5000)

  it('disconnect from MongoDB again', async () => {
    const result = await pluginHooks.disconnectMongo()(mongoHook).then(ok => ok, no => no)
    expect(result).to.be.equal(mongoHook)
  })
})
