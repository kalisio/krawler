import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from 'feathers'
import path from 'path'
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

  it('creates the storage', () => {
    return storesService.create({ id: 'fs', type: 'fs', options: { path: path.join(__dirname, 'data', 'output') } })
    .then(_ => {
      return storesService.get('fs')
    })
    .then(store => {
      expect(store).toExist()
    })
  })

  it('removes the storage', (done) => {
    storesService.remove('fs')
    .then(store => {
      storesService.get('fs').catch(error => {
        expect(error).toExist()
        done()
      })
    })
  })

  // Cleanup
  after(() => {

  })
})
