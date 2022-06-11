import _ from 'lodash'
import makeDebug from 'debug'
import { callOnHookItems } from '../utils.js'

const debug = makeDebug('krawler:hooks:logger')

// Configure logger based on options
export function createLogger (options = {}) {
  return async function (hook) {
    // We need to import winston and plugins dynamically instead of statically in krawler
    // Otherwise if the job itself includes winston/plugins as krawler starts first
    // the winston instance in krawler will not have the required plugins already loaded
    const winston = await import('winston')
    const item = hook.data // getItems(hook)
    let logger = _.get(item, options.loggerPath || 'logger')
    if (logger) {
      debug('Logger already setup for ' + item.id)
      return hook
    }
    debug('Setup logger for ' + item.id)
    const logsConfig = Object.assign({ // Default logger erased by provided one if any
      Console: {
        format: winston.format.combine(winston.format.colorize(), winston.format.simple())
      }
    }, _.omit(options, ['loggerPath', 'level', 'format']))
    // We have one entry per log type
    const logsTypes = Object.getOwnPropertyNames(logsConfig)
    // Create corresponding winston transports with options
    const transports = []
    for (let i = 0; i < logsTypes.length; i++) {
      const logType = logsTypes[i]
      const logOptions = logsConfig[logType]
      debug(`Setup ${logType} transport with options`, logOptions)
      // Winston plugin to be loaded ?
      if (logOptions.import) await import(logOptions.import)
      transports.push(new winston.transports[logType](_.omit(logOptions, ['import'])))
    }
    logger = winston.createLogger(Object.assign({
      level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info'), transports
    }, _.pick(options, ['level', 'format'])))
    _.set(item, options.loggerPath || 'logger', logger)
    debug('Logger set for ' + item.id)
    return hook
  }
}

// Disconnect from the database
export function removeLogger (options = {}) {
  return function (hook) {
    const item = hook.data // getItems(hook)
    const logger = _.get(item, options.loggerPath || 'logger')
    if (_.isNil(logger)) {
      debug('Already removed logger for ' + item.id)
      return hook
    }
    debug('Removing logger for ' + item.id)
    // logger.clear()
    _.unset(item, options.loggerPath || 'logger')
    debug('Removed logger for ' + item.id)
    return hook
  }
}

// Log some information by relying on a user-defined function
export function log (options) {
  return callOnHookItems(options)(async item => {
    const logger = _.get(item, options.loggerPath || 'logger')
    if (_.isNil(logger)) {
      throw new Error('You must setup the logger before using the \'log\' hook')
    }
    // Shortcut if no other option is used
    if (typeof options === 'function') await options(logger, item)
    else await options.function(logger, item)
    debug('Logged item', item)
  })
}
