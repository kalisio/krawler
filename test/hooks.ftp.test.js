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

  const store = FsStore({ path: path.join(__dirname, 'output') })

  const ftpOptions = {
    host: 'test.rebex.net',
    port: 21,
    user: 'demo',
    pass: 'password',
    remoteDir: '/pub/example',
    remoteFile: '/pub/example/ConsoleClient.png',
    localFile: path.join(__dirname, 'output', 'ConsoleClient.png')
  }

  const ftpHook = {
    type: 'before',
    data: { id: 'ftp' },
    params: { store: store }
  }

  it('connect to FTP', async () => {
    await pluginHooks.connectFTP(ftpOptions)(ftpHook)
    expect(ftpHook.data.client).toExist()
  })
  // Let enough time to proceed
    .timeout(5000)

  /* FIXME: Seems that TRAVIS-CI does not support passive FTP mode
  https://blog.travis-ci.com/2018-07-23-the-tale-of-ftp-at-travis-ci
  it('list from FTP', async () => {
    await pluginHooks.listFTP(ftpOptions)(ftpHook)
    expect(ftpHook.result.data).toExist()
  })
  // Let enough time to proceed
  .timeout(5000)
  */

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
