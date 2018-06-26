import { Selector } from 'testcafe'

export class PrintApp {
  constructor () {
    this.baseLayerMenu = Selector('.basemaps')
    this.overlayLayerMenu = Selector('.leaflet-control-layers')
    this.fileInput = Selector('input').withAttribute('type', 'file')
    this.printMenu = Selector('#leafletEasyPrint')
  }
  async checkNoError (test) {
    const { error } = await test.getBrowserConsoleMessages()
    await test.expect(error[0]).notOk()
  }
  async selectBaseLayer (test, layerName) {
    let layerSelector = Selector('img').withAttribute('title', layerName)
    await test
      .click(this.baseLayerMenu)
      .click(layerSelector)
      // Since we have async data download wait a little bit
      .wait(5000)
  }
  async selectOverlayLayer (test, layerName) {
    // Checkbox is the sibling of the text
    let layerSelector = Selector('span').withText(layerName).prevSibling()
    await test
      .hover(this.overlayLayerMenu)
      .click(layerSelector)
      // Since we have async data download wait a little bit
      .wait(5000)
  }
  async addGeoJson (test, fileName) {
    await test
      .setFilesToUpload(this.fileInput, fileName)
      // Since we have async data download wait a little bit
      .wait(5000)
  }
  async setFullscreen (test) {
    await test
      .maximizeWindow()
      // Since we have async data download wait a little bit
      .wait(5000)
  }
  async print (test, format) {
    let printButton = Selector('.easyPrintSizeMode').withAttribute('title', format)
    await test
      .click(this.printMenu)
      .click(printButton)
      // Wait for print
      .wait(20000)
  }
}
