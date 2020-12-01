import _ from 'lodash'
import sift from 'sift'
import moment from 'moment'
import math from 'mathjs'
import { getItems, replaceItems } from 'feathers-hooks-common'
import makeDebug from 'debug'
import { Duplex } from 'stream'

// Global structure used to manage healthcheck state for cron jobs
export const Healthcheck = {
  isRunning: false, // Flag indicating if job is currently running for cron jobs
  nbSkippedJobs: 0, // Number of times the scheduled job has been skipped due to on-going one
  error: null // Indicating error if job has erroned for cron jobs
  /* Undefined by default
  nbFailedTasks: 0, // Number of failed/success tasks of last run for fault-tolerant jobs
  nbSuccessfulTasks: 0,
  successRate: 0 // Ratio of previous values
  */
}

const debug = makeDebug('krawler:utils')
// Add knot unit not defined by default
math.createUnit('knot', { definition: '0.514444 m/s', aliases: ['knots', 'kt', 'kts'] })
// This ensure moment objects are correctly serialized in MongoDB
Object.getPrototypeOf(moment()).toBSON = function () {
  return this.toDate()
}

export function transformJsonObject (json, options) {
  let rootJson = json
  if (options.transformPath || options.inputPath) {
    json = _.get(json, options.transformPath || options.inputPath)
  }
  // If no input path then we only have an output path
  // meaning we will store the array in the output object
  if (rootJson === json) rootJson = {}
  if (options.toArray) {
    json = _.toArray(json)
  }
  if (options.toObjects) {
    json = json.map(array => array.reduce((object, value, index) => {
      // Set the value at index on object using key provided in input list
      const propertyName = options.toObjects[index]
      object[propertyName] = value
      return object
    }, {}))
  }
  // Safety check
  const isArray = Array.isArray(json)
  if (!isArray) {
    json = [json]
  }
  if (options.filter) {
    json = sift(options.filter, json)
  }
  // Iterate over path mapping
  _.forOwn(options.mapping, (output, inputPath) => {
    const isMappingObject = (typeof output === 'object')
    const outputPath = (isMappingObject ? output.path : output)
    const deleteInputPath = (isMappingObject ? _.get(output, 'delete', true) : true)
    // Then iterate over JSON objects
    _.forEach(json, object => {
      if (!_.has(object, inputPath)) return
      let value = _.get(object, inputPath)
      // Perform value mapping (if any)
      if (isMappingObject && output.values) {
        value = output.values[value]
      }
      // Perform key mapping
      _.set(object, outputPath, value)
    })
    if (deleteInputPath) {
      _.forEach(json, object => {
        _.unset(object, inputPath)
      })
    }
  })
  // Iterate over unit mapping
  _.forOwn(options.unitMapping, (units, path) => {
    // Then iterate over JSON objects
    _.forEach(json, object => {
      // Perform conversion
      let value = _.get(object, path)
      if (value) {
        // Handle dates
        if (units.asDate) {
          let date
          // Handle UTC or local dates using input format if provided
          if (units.asDate === 'utc') {
            date = (units.from ? moment.utc(value, units.from) : moment.utc(value))
          } else {
            date = (units.from ? moment(value, units.from) : moment(value))
          }
          // In this case we'd like to reformat as a string
          // otherwise the moment object is converted to standard JS Date
          if (units.to) {
            date = date.format(units.to)
          } else {
            date = date.toDate()
          }
          _.set(object, path, date)
        } else if (units.asString) { // Handle string conversion
          _.set(object, path, value.toString)
        } else if (units.asNumber) { // Handle number conversion
          // Remove all spaces as sometimes large numbers are written using a space separator
          // like '120 000' causing the conversion to fail
          if (typeof value === 'string') value = value.replace(/ /g, '')
          _.set(object, path, _.toNumber(value))
        } else { // Handle numbers
          _.set(object, path, math.unit(value, units.from).toNumber(units.to))
        }
      } else if (_.has(units, 'empty')) {
        _.set(object, path, units.empty)
      }
    })
  })
  // Then iterate over JSON objects to pick/omit properties in place
  for (let i = 0; i < json.length; i++) {
    let object = json[i]
    if (options.pick) {
      object = _.pick(object, options.pick)
    }
    if (options.omit) {
      object = _.omit(object, options.omit)
    }
    if (options.merge) {
      object = _.merge(object, options.merge)
    }
    json[i] = object
  }
  // Transform back to object when required
  if (!isArray) {
    if (!options.asArray) json = (json.length > 0 ? json[0] : {})
  } else {
    if (options.asObject) json = (json.length > 0 ? json[0] : {})
  }
  // Then update JSON in place in memory
  if (options.transformPath || options.outputPath) {
    _.set(rootJson, options.transformPath || options.outputPath, json)
    json = rootJson
  }

  return json
}

// Call a given function on each hook item
export function callOnHookItems (f) {
  return async function (hook) {
    let hookObject = hook
    // Handle error hooks as usual
    if (hook.type === 'error') hookObject = hook.original
    // Retrieve the items from the hook
    const items = getItems(hookObject)
    const isArray = Array.isArray(items)
    if (isArray) {
      for (let i = 0; i < items.length; i++) {
        // Handle error hooks as usual
        if (hook.type === 'error') {
          items[i].error = hook.error
          // Avoid circular reference
          delete items[i].error.hook
        }
        await f(items[i], hookObject)
      }
    } else {
      // Handle error hooks as usual
      if (hook.type === 'error') {
        items.error = hook.error
        // Avoid circular reference
        delete items.error.hook
      }
      await f(items, hookObject)
    }
    // Replace the items within the hook
    replaceItems(hookObject, items)
    return hook
  }
}

// Utility function used to convert from string to Dates a fixed set of properties on a given object (recursive)
export function convertDates (object, properties) {
  // Restrict to some properties only ?
  const keys = (properties || _.keys(object))
  return _.mapValues(object, (value, key) => {
    if (keys.includes(key)) {
      // Recurse on sub objects
      if (Array.isArray(value)) {
        return value
      } else if (typeof value === 'object') {
        return convertDates(value)
      } else if (typeof value === 'string') {
        // We use moment to validate the date
        const date = moment(value, moment.ISO_8601)
        return (date.isValid() ? date.toDate() : value)
      } else { // Unhandled types like boolean
        return value
      }
    } else {
      return value
    }
  })
}

// Utility function used to convert from string to numbers a fixed set of properties on a given object (recursive)
export function convertNumbers (object, properties) {
  // Restrict to some properties only ?
  const keys = (properties || _.keys(object))
  return _.mapValues(object, (value, key) => {
    if (keys.includes(key)) {
      // Recurse on sub objects
      if ((typeof value === 'number') || Array.isArray(value)) {
        return value
      } else if (typeof value === 'object') {
        // Take care to date objects that can be converted to numbers as EPOCH
        const date = moment.utc(value)
        return (date.isValid() ? value : convertNumbers(value))
      } else if (typeof value === 'string') {
        const number = _.toNumber(value)
        // We use lodash to validate the number
        return (!Number.isNaN(number) ? number : value)
      } else { // Unhandled types like boolean
        return value
      }
    } else {
      return value
    }
  })
}

export function convertComparisonOperators (queryObject) {
  _.forOwn(queryObject, (value, key) => {
    // Process current attributes or  recurse
    if (typeof value === 'object') {
      convertComparisonOperators(value)
    } else if ((key === '$eq') || (key === '$lt') || (key === '$lte') || (key === '$gt') || (key === '$gte')) {
      const number = _.toNumber(value)
      // Update from query string to number if required
      if (!Number.isNaN(number)) {
        queryObject[key] = number
      }
    }
  })
  return queryObject
}

// Template a string or array of strings property according to a given item
export function template (item, property) {
  const isArray = Array.isArray(property)
  // Recurse
  if (!isArray && (typeof property === 'object')) return templateObject(item, property)
  let values = (isArray ? property : [property])
  values = values.map(value => {
    if (typeof value === 'string') {
      const compiler = _.template(value)
      // Add env into templating context
      const context = Object.assign({}, item, process)
      return compiler(context)
    } else if (typeof value === 'object') {
      return templateObject(item, value)
    } else {
      return value
    }
  })

  const result = (isArray ? values : values[0])
  return result
}

// Utility function used to template strings from a fixed set of properties on a given object (recursive)
export function templateObject (item, object, properties) {
  // Restrict to some properties only ?
  const keys = (properties || _.keys(object))
  // First key requiring templating
  const result = _.mapKeys(object, (value, key) => (keys.includes(key) && key.includes('<%') && key.includes('%>')) ? template(item, key) : key)
  // Then values
  return _.mapValues(result, (value, key) => (keys.includes(key) ? template(item, value) : value))
}

// Utility function used to template strings from a fixed set of properties on a given query object (recursive)
// Will then transform back to right types dates and numbers for comparison operators
export function templateQueryObject (item, object, properties) {
  let query = templateObject(item, object, properties)
  // Perform required automated conversions
  query = convertComparisonOperators(query)
  query = convertNumbers(query)
  query = convertDates(query)
  return query
}

// Add to the 'outputs' property of the given abject a new entry
export function addOutput (object, output, type) {
  // Default value
  const outputType = (type || 'intermediate')
  const outputs = _.get(object, outputType, [])
  outputs.push(output)
  _.set(object, outputType, outputs)
}

// Get the actual store object from its definition in input data based on the given name or property path,
// or if definition not found retrieve it directly from params
export async function getStore (storesService, params, data, storePathOrName) {
  const path = storePathOrName || 'store'
  debug('Seeking for store in service, data or params with path/name ' + path)
  // First try store as specified in input data
  let store = _.get(data, path)
  if (store) {
    // Store object or only ID given ?
    if (typeof store === 'string' && storesService) {
      store = await storesService.get(store)
    }
  } else {
    // Check if store object already provided as global parameter on params
    store = _.get(params, path)
  }

  // Try to directly access it by name from service
  if (!store) {
    if (storesService) {
      store = await storesService.get(path)
    } else {
      throw new Error('Cannot find store on data or params ', data, params)
    }
  }

  return store
}

// Get the actual store object from its definition in input data based on the given name or property path
// or if definition not found retrieve directly from params
export async function getStoreFromHook (hook, hookName, options = {}) {
  debug('Seeking for store in hook ' + hookName)
  try {
    return await getStore(_.get(hook, 'service.storesService'), hook.params, hook.data, options.store || options.storePath)
  } catch (error) {
    throw new Error(`Cannot find store for hook ${hookName}.`)
  }
}

// Convert a data buffer to a stream
export function bufferToStream (buffer) {
  const stream = new Duplex()
  stream.push(buffer)
  stream.push(null)
  return stream
}

// Pipe a stream to a target store
export function writeStreamToStore (stream, store, options) {
  return new Promise((resolve, reject) => {
    stream
      .on('error', reject)
    // See https://github.com/kalisio/krawler/issues/7
      .pipe(store.createWriteStream(_.cloneDeep(options), error => {
        if (error) reject(error)
      }))
      .on('finish', () => {
        resolve()
      })
      .on('error', reject)
  })
}

// Convert a data buffer to a stream piped to a target store
export function writeBufferToStore (buffer, store, options) {
  return writeStreamToStore(bufferToStream(buffer), store, options)
}
