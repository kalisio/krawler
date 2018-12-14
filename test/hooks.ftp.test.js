import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { hooks as pluginHooks } from '../src'

describe('krawler:hooks:ftp', () => {
  before(() => {
    chailint(chai, util)
  })

  let ftpOptions = {
    host: 'test.rebex.net',
    port: 21,
    user: 'demo',
    pass: 'password'
  }

  let ftpHook = {
    type: 'before',
    data: {},
    result: {},
    params: {}
  }

  it('connect to FTP', async () => {
    await pluginHooks.connectFTP(ftpOptions)(ftpHook)
    expect(ftpHook.data.client).toExist()
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
