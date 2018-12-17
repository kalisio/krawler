import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import FsStore from 'fs-blob-store'
import fs from 'fs'
import path from 'path'
import { hooks as pluginHooks } from '../src'

describe('krawler:hooks:ftp', () => {
  before(() => {
    chailint(chai, util)
  })

  let store = FsStore({ path: path.join(__dirname, 'output') })
  console.log(store.path)

  let ftpOptions = {
    host: 'test.rebex.net',
    port: 21,
    user: 'demo',
    pass: 'password'
  }

  let ftpHook = {
    type: 'before',
    data: { id: 'pub/example/ConsoleClient.png' },
    params: { store: store }
  }

  it('connect to FTP', async () => {
    await pluginHooks.connectFTP(ftpOptions)(ftpHook)
    expect(ftpHook.data.client).toExist()
  })
  // Let enough time to proceed
  .timeout(5000)

  it('get from FTP', async () => {
    try {
      fs.mkdirSync(store.path)
    } catch (error) {
      // If already exist
    }
    await pluginHooks.getFTP(ftpOptions)(ftpHook)
    expect(fs.existsSync(path.join(store.path, 'ConsoleClient.png'))).beTrue()
  })
  // Let enough time to proceed
  .timeout(5000)

  it('put to FTP', async () => {
    try {
      await pluginHooks.putFTP(ftpOptions)(ftpHook)
    } catch (error) {
      expect(error).toExist()
    }
  })
  // Let enough time to proceed
  .timeout(5000)

  it('disconnect from FTP', async () => {
    ftpHook.type = 'after'
    await pluginHooks.disconnectFTP()(ftpHook)
    expect(ftpHook.data.client).beUndefined()
  })
  // Let enough time to proceed
  .timeout(5000)
})
