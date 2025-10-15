import chai from 'chai'
import chailint from 'chai-lint'
import fsStore from 'fs-blob-store'
import path, { dirname } from 'path'
import { hooks as pluginHooks } from '../lib/index.js'
import { fileURLToPath } from 'url'

const { util, expect } = chai
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('krawler:hooks:kml', () => {
  const inputStore = fsStore({ path: path.join(__dirname, 'data') })

  const kmlHook = {
    type: 'after',
    result: { id: 'kml.kml' },
    params: { store: inputStore }
  }

  before(() => {
    chailint(chai, util)
  })

  it('convert KML to GeoJSON', async () => {
    await pluginHooks.readKML({})(kmlHook)
    expect(kmlHook.result.data.type).to.equal('FeatureCollection')
    expect(kmlHook.result.data.features.length).to.equal(1)
    kmlHook.result.data.features.forEach(feature => {
      expect(feature.type).to.equal('Feature')
      expect(feature.geometry).toExist()
      expect(feature.properties).toExist()
    })
  })

  it('convert KML to GeoJSON features', async () => {
    await pluginHooks.readKML({ features: true })(kmlHook)
    expect(kmlHook.result.data.length).to.equal(1)
    kmlHook.result.data.forEach(feature => {
      expect(feature.type).to.equal('Feature')
      expect(feature.geometry).toExist()
      expect(feature.properties).toExist()
    })
  })

  // Let enough time to proceed
    .timeout(5000)
})
