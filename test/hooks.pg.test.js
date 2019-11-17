import chai, { util/*, expect */ } from 'chai'
import chailint from 'chai-lint'
// import { hooks as pluginHooks } from '../src'

describe('krawler:hooks:pg', () => {
  before(() => {
    chailint(chai, util)
  })

  /* const pgOptions = {
    host: 'test.rebex.net',
    port: 21,
    user: 'demo',
    pass: 'password',
    remoteDir: '/pub/example',
    remoteFile: '/pub/example/ConsoleClient.png',
    localFile: path.join(__dirname, 'output', 'ConsoleClient.png')
  }
  */
  /* const pgHook = {
    type: 'before'

    data: { id: 'ftp' },
    params: { store: store }
  }
  */
  /*
  it('connect to PG', async () => {
    await pluginHooks.connectPG(pgOptions)(pgHook)
    expect(pgHook.data.client).toExist()
  })

  it('connect to PG again', async() => {
    // Must not fail
    const result = await pluginHooks.connectPG(pgOptions)(pgHook).then(ok => ok, no => no)
    expect(result).to.be.equal(pgHook)
  })

  it('disconnect from PG', async () => {
    pgHook.type = 'after'
    await pluginHooks.disconnectPG()(pgHook)
    expect(pgHook.data.client).beUndefined()
  })

  it('disconnect from PG again', async function () {
    // Must not fail
    const result = await pluginHooks.disconnectPG()(pgHook).then(ok => ok, no => no)
    expect(result).to.be.equal(pgHook)
  })
  */
})
