import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from 'feathers'
import path from 'path'
import aws from 'aws-sdk'
import plugin from '../src'

describe('krawler:stores', () => {
  let app, storesService

  before(() => {
    chailint(chai, util)
    app = feathers()
    app.configure(plugin())
  })

  it('creates the stores service', () => {
    app.use('stores', plugin.stores())
    storesService = app.service('stores')
    expect(storesService).toExist()
  })

  it('creates the fs storage', () => {
    return storesService.create({ id: 'fs', type: 'fs', options: { path: path.join(__dirname, 'output') } })
    .then(_ => {
      return storesService.get('fs')
    })
    .then(store => {
      expect(store).toExist()
    })
  })

  it('removes the fs storage', (done) => {
    storesService.remove('fs')
    .then(store => {
      storesService.get('fs').catch(error => {
        expect(error).toExist()
        done()
      })
    })
  })

  it('creates the s3 storage', () => {
    let s3Client = new aws.S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    })
    let s3Bucket = process.env.S3_BUCKET
    return storesService.create({ id: 's3', type: 's3', options: { client: s3Client, bucket: s3Bucket } })
    .then(_ => {
      return storesService.get('s3')
    })
    .then(store => {
      expect(store).toExist()
    })
  })

  it('removes the s3 storage', (done) => {
    storesService.remove('s3')
    .then(store => {
      storesService.get('s3').catch(error => {
        expect(error).toExist()
        done()
      })
    })
  })

  // Cleanup
  after(() => {

  })
})
