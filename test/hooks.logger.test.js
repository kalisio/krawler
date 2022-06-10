import chai from 'chai'
import chailint from 'chai-lint'
import fs from 'fs-extra'
import path from 'path'
import utility from 'util'
import winston from 'winston'
import { fileURLToPath } from 'url'
import { hooks as pluginHooks } from '../lib/index.js'

const { util, expect } = chai

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('krawler:hooks:logger', () => {
  before(() => {
    chailint(chai, util)
  })

  const loggerHook = {
    type: 'before',
    data: {
      value: 6
    }
  }
  const now = new Date()
  const logFilePath = path.join(__dirname, 'output', 'job-' + now.toISOString().slice(0, 10) + '.log')
  let logDb, logCollection

  it('create logger', async () => {
    await pluginHooks.createLogger({
      Console: {
        format: winston.format.simple(),
        level: 'verbose'
      },
      DailyRotateFile: {
        import: 'winston-daily-rotate-file',
        format: winston.format.json(),
        dirname: path.join(__dirname, 'output'),
        filename: 'job-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '1d',
        level: 'info'
      },
      MongoDB: {
        import: 'winston-mongodb',
        db: 'mongodb://127.0.0.1:27017/krawler-test',
        collection: 'logs'
      }
    })(loggerHook)
    expect(loggerHook.data.logger).toExist()
  })

  it('log information', async () => {
    let log
    pluginHooks.log({
      function: (logger, item) => {
        log = 'Item value is ' + item.value
        logger.info(log)
      }
    })(loggerHook)
    // Check transport output
    // FIXME: need to let some time to proceed with logs
    await utility.promisify(setTimeout)(2500)
    // File
    const content = fs.readFileSync(logFilePath, { encoding: 'utf8' })
    expect(content.includes(log)).to.equal(true)
    // Mongo
    const mongoTransport = loggerHook.data.logger._readableState.pipes[2]
    logDb = mongoTransport.logDb
    logCollection = logDb.collection(mongoTransport.collection)
    const results = await logCollection.find({ message: log }).toArray()
    expect(results.length).to.equal(1)
  })
  // Let enough time to proceed
    .timeout(5000)

  it('remove logger', () => {
    pluginHooks.removeLogger()(loggerHook)
    expect(loggerHook.data.logger).beUndefined()
  })

  // Cleanup
  after(async () => {
    fs.unlinkSync(logFilePath)
    await logCollection.drop()
  })
})
