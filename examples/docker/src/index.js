import path from 'path'
import { PrintApp } from './page-model'

export const appUrl = process.env.APP_URL || 'http://kargo-www.s3-website.eu-central-1.amazonaws.com/'

let app = new PrintApp()

fixture`Print`// declare the fixture
  .page`${appUrl}`
	.afterEach(async test => {
    // check for console error messages
    await app.checkNoError(test)
  })

test('Print', async test => {
	// Since we have async data download wait a little bit
	await test.wait(5000)
  await app.selectBaseLayer(test, process.env.BASE_LAYER || 'PlanetSat')
  if (process.env.OVERLAY_LAYER) {
  	await app.selectOverlayLayer(test, process.env.OVERLAY_LAYER)
  }
  if (process.env.GEOJSON_FILE) {
    await app.addGeoJson(test, path.join(__dirname, '..', process.env.GEOJSON_FILE))
  }
  // Print size rely on Xvfb screen, controlled by SCREEN_WIDTH & SCREEN_HEIGHT, as we jump in fullscreen just before printing
  await app.setFullscreen(test)
  await app.print(test, process.env.PRINT_FORMAT || 'Current Size')
})
