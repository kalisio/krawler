import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import path from 'path'
import { hooks as pluginHooks } from '../src'

describe('krawler:hooks:geojson', () => {
  const osm = require(path.join(__dirname, 'data', 'osm.json'))

  before(() => {
    chailint(chai, util)
  })

  let geoJsonHook = {
    type: 'after',
    result: { data: osm },
    params: {}
  }

  it('convert OSM to GeoJSON', async () => {
    await pluginHooks.convertOSMToGeoJson({})(geoJsonHook)
    expect(geoJsonHook.result.data.type).to.equal('FeatureCollection')
    expect(geoJsonHook.result.data.feature.length > 0).beTrue()
  })
  // Let enough time to proceed
  .timeout(5000)
})
