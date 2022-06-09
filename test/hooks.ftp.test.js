import chai from 'chai'
import chailint from 'chai-lint'
import FsStore from 'fs-blob-store'
import fs from 'fs'
import path from 'path'
import { hooks as pluginHooks } from '../lib/index.js'

const { util, expect } = chai

const outputDir = './test/output'

describe('krawler:hooks:ftp', () => {
  before(() => {
    chailint(chai, util)
  })

  const store = FsStore({ path: outputDir })

  const ftpOptions = {
    remoteDir: '/pub/example',
    remoteFile: '/pub/example/readme.txt',
    localFile: path.join(outputDir, 'readme.txt')
  }

  const ftpHook = {
    type: 'before',
    data: {
      id: 'ftp',
      client: {
        host: 'test.rebex.net',
        port: 21,
        user: 'demo',
        pass: 'password'
      }
    },
    params: { store }
  }

  it('list FTP', async () => {
    await pluginHooks.listFTP(ftpOptions)(ftpHook)
    expect(ftpHook.result.data).toExist()
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
    expect(fs.existsSync(path.join(store.path, 'readme.txt'))).beTrue()
  })
  // Let enough time to proceed
    .timeout(5000)
})
