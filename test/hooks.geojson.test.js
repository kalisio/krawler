import chai from 'chai'
import chailint from 'chai-lint'
import fs from 'fs-extra'
import path, { dirname } from 'path'
import { hooks as pluginHooks } from '../lib/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

describe('krawler:hooks:geojson', () => {
  let json, osm

  const geoJsonHook = {
    type: 'after',
    result: {},
    params: {}
  }

  before(() => {
    json = fs.readJsonSync(path.join(__dirname, 'data', 'json.json'))
    osm = fs.readJsonSync(path.join(__dirname, 'data', 'osm.json'))
    chailint(chai, util)
  })

  it('convert Json to GeoJSON', async () => {
    geoJsonHook.result.data = json
    await pluginHooks.convertToGeoJson({})(geoJsonHook)
    expect(geoJsonHook.result.data.type).to.equal('FeatureCollection')
    expect(geoJsonHook.result.data.features.length).to.equal(2)
    geoJsonHook.result.data.features.forEach(feature => {
      expect(feature.type).to.equal('Feature')
      expect(feature.geometry).toExist()
      expect(feature.geometry.type).to.equal('Point')
      expect(feature.geometry.coordinates).toExist()
      expect(feature.geometry.coordinates.length).to.equal(3)
      expect(feature.properties).toExist()
      expect(feature.properties.callsign).toExist()
      expect(feature.properties.latitude).beUndefined()
      expect(feature.properties.longitude).beUndefined()
      expect(feature.properties.altitude).beUndefined()
    })
  })

  it('convert OSM to GeoJSON', async () => {
    geoJsonHook.result.data = osm
    await pluginHooks.convertOSMToGeoJson({})(geoJsonHook)
    expect(geoJsonHook.result.data.type).to.equal('FeatureCollection')
    expect(geoJsonHook.result.data.features.length > 0).beTrue()
  })
  // Let enough time to proceed
    .timeout(5000)
})
