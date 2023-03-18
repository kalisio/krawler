import chai from 'chai'
import chailint from 'chai-lint'
import FsStore from 'fs-blob-store'
import fs from 'fs'
import path from 'path'
import { hooks as pluginHooks } from '../lib/index.js'

const { util, expect } = chai

const outputDir = './test/output'

const runFtpTests = process.env.RUN_FTP_TESTS

describe('krawler:hooks:ftp', () => {
  if (runFtpTests) {

    before(() => {
      chailint(chai, util)
    })

    const store = FsStore({ path: outputDir })

    const ftpOptions = {
      remoteDir: '/pure-ftpd/doc',
      remoteFile: '/pure-ftpd/doc/README',
      localFile: 'README',
      pattern: 'README*',
      // Avoid some problems with certificates
      settings: {
        'ssl:verify-certificate': false
      }
    }

    const ftpHook = {
      type: 'before',
      data: {
        id: 'ftp',
        client: {
          host: 'ftp.pureftpd.org',
          port: 21,
          user: 'anonymous',
          pass: 'anonymous'
        }
      },
      params: { store }
    }

    it('list FTP', async () => {
      await pluginHooks.listFTP(ftpOptions)(ftpHook)
      expect(ftpHook.result.data).toExist()
    })
    // Let enough time to proceed
      .timeout(60000)

    it('glob FTP', async () => {
      await pluginHooks.globFTP(ftpOptions)(ftpHook)
      expect(ftpHook.result.data).toExist()
    })
    // Let enough time to proceed
      .timeout(60000)

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
      .timeout(60000)
  }
})
