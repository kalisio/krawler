import chai from 'chai'
import chailint from 'chai-lint'
import { Grid } from '../lib/index.js'

const { util, expect } = chai

describe('krawler:grid', () => {
  const grid = new Grid({
    bounds: [-180, -90, 180, 90],
    origin: [-180, 90],
    size: [4, 3],
    resolution: [90, 90],
    data: [
      0, 1, 1, 0,
      1, 2, 2, 1,
      0, 1, 1, 0
    ]
  })

  before(() => {
    chailint(chai, util)
  })

  it('is CommonJS compatible', () => {
    expect(typeof Grid).to.equal('function')
  })

  it('gets grid values', () => {
    expect(grid.getValue(0, 0), 'vertex [0,0]').to.equal(0)
    expect(grid.getValue(1, 0), 'vertex [1,0]').to.equal(1)
    expect(grid.getValue(0, 1), 'vertex [0,1]').to.equal(1)
    expect(grid.getValue(1, 1), 'vertex [1,1]').to.equal(2)
  })

  it('interpolates grid values', () => {
    // Grid vertex values
    expect(grid.interpolate(-90, 0), 'left-centered vertex').to.equal(2)
    expect(grid.interpolate(0, 0), 'right-centered vertex').to.equal(2)
    // Ensure it is fine on borders as well
    expect(grid.interpolate(-180, 90), 'top-left border').to.equal(0)
    expect(grid.interpolate(-180, -90), 'bottom-left border').to.equal(0)
    // Due to longitude wrapping +180° is similar to -180°
    expect(grid.interpolate(180, 90), 'top-right border').to.equal(0)
    expect(grid.interpolate(180, -90), 'bottom-right border').to.equal(0)
    // Test that we do not try to interpolate values outside grid bounds
    expect(grid.interpolate(-254, 0), 'longitude overflow').beUndefined()
    expect(grid.interpolate(0, 128), 'latitude overflow').beUndefined()
    // Then test interpolation
    expect(grid.interpolate(-135, 45), 'top-left quad center').to.equal(1)
    expect(grid.interpolate(-135, -45), 'bottom-left quad center').to.equal(1)
    expect(grid.interpolate(135, 45), 'top-right quad center').to.equal(0.5)
    expect(grid.interpolate(135, -45), 'bottom-right quad center').to.equal(0.5)
    expect(grid.interpolate(-45, 0), 'grid center').to.equal(2)
  })

  it('resamples grid values', () => {
    const resampled = grid.resample([-135, 45], [90, 90], [3, 2])
    // Interpolated grid at grid quad centers should be the following
    // [ 1 1.5 1
    //   1 1.5 1 ]
    expect(resampled).to.deep.equal([1, 1.5, 1, 1, 1.5, 1])
  })

  it('tiles grid values', () => {
    const tileset = grid.tileset([90, 90])
    expect(tileset.map(tile => tile.data)).to.deep.equal([
      [0, 1, 1, 2], [1, 1, 2, 2], [1, 0, 2, 1], [0, 0, 1, 1], [1, 2, 0, 1], [2, 2, 1, 1], [2, 1, 1, 0], [1, 1, 0, 0]
    ])
  })
})
