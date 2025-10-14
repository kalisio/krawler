import _ from 'lodash'
import sift from 'sift'
import moment from 'moment'
import math from 'mathjs'
import common from 'feathers-hooks-common'
import makeDebug from 'debug'
import { Duplex } from 'stream'

const { getItems, replaceItems } = common

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
  // By default we perform transformation in place
  if (!_.get(options, 'inPlace', true)) {
    json = _.cloneDeep(json)
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
      if (_.has(object, path)) {
        let value = _.get(object, path)
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
          value = date
        } else if (units.asString) { // Handle string conversion
          // Convert to a target radix
          if (_.isNumber(units.asString)) value = value.toString(units.asString)
          else value = value.toString()
        } else if (units.asNumber) { // Handle number conversion
          // Remove all spaces as sometimes large numbers are written using a space separator
          // like '120 000' causing the conversion to fail
          if (typeof value === 'string') value = value.replace(/ /g, '')
          value = _.toNumber(value)
        } else { // Handle numbers
          value = math.unit(value, units.from).toNumber(units.to)
        }
        if (units.asCase && (typeof value === 'string')) { // Handle case conversion as lodash/string function name
          value = (_[units.asCase] ? _[units.asCase](value) : value[units.asCase]())
        }
        // Update converted value
        _.set(object, path, value)
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
export function callOnHookItems (options = {}) {
  return (f) => {
    // Default call mode is per item
    const perItem = _.get(options, 'perItem', true)
    return async function (hook) {
      // Retrieve the items from the hook
      const items = getItems(hook) || hook.data
      const isArray = Array.isArray(items)
      if (isArray && perItem) {
        for (let i = 0; i < items.length; i++) {
          // Handle error hooks as usual
          if (hook.type === 'error') {
            items[i].error = hook.error
            // Avoid circular reference
            delete items[i].error.hook
          }
          await f(items[i], hook)
        }
      } else {
        // Handle error hooks as usual
        if (hook.type === 'error') {
          items.error = hook.error
          // Avoid circular reference
          delete items.error.hook
        }
        await f(items, hook)
      }
      // Replace the items within the hook
      replaceItems(hook, items)
      return hook
    }
  }
}

function isObjectID (id) {
  return id && id._bsontype === 'ObjectID'
}

function isDate (value) {
  return (value instanceof Date) || moment.isMoment(value)
}

function convertDate (value) {
  if (typeof value === 'string') {
    // We use moment to validate the date
    const date = moment(value, moment.ISO_8601)
    return (date.isValid() ? date.toDate() : value)
  } else { // Unhandled types like boolean
    return value
  }
}

// Utility function used to convert from string to Dates a fixed set of properties on a given object (recursive)
export function convertDates (object, options = {}) {
  // Restrict to some properties only ?
  const keys = (options.properties || _.keys(object))
  const excludedKeys = (options.excludedProperties || [])
  return _.mapValues(object, (value, key) => {
    if (keys.includes(key) && !excludedKeys.includes(key)) {
      // Recurse on sub objects
      if (Array.isArray(value)) {
        return value.map(item => (typeof item === 'object' ? convertDates(item) : convertDate(item)))
      } else if (typeof value === 'object') {
        // Take care the value is of type of ObjectID
        if (isObjectID(value)) return value
        return convertDates(value)
      } else {
        return convertDate(value)
      }
    } else {
      return value
    }
  })
}

function convertNumber (value) {
  if (typeof value === 'string' && value !== '') {
    const number = _.toNumber(value)
    // We use lodash to validate the number
    return (!Number.isNaN(number) ? number : value)
  } else { // Unhandled types like boolean
    return value
  }
}

// Utility function used to convert from string to numbers a fixed set of properties on a given object (recursive)
export function convertNumbers (object, options = {}) {
  // Restrict to some properties only ?
  const keys = (options.properties || _.keys(object))
  const excludedKeys = (options.excludedProperties || [])
  return _.mapValues(object, (value, key) => {
    if (keys.includes(key) && !excludedKeys.includes(key)) {
      // Recurse on sub objects
      if (Array.isArray(value)) {
        return value.map(item => (typeof item === 'object' ? (isDate(item) ? item : convertNumbers(item)) : convertNumber(item)))
      } else if (typeof value === 'object') {
        // Take care the value is of type of ObjectID
        if (isObjectID(value)) return value
        // Take care to date objects that can be converted to numbers as EPOCH
        return (isDate(value) ? value : convertNumbers(value))
      } else {
        return convertNumber(value)
      }
    } else {
      return value
    }
  })
}

export function convertComparisonOperators (queryObject, options = {}) {
  _.forOwn(queryObject, (value, key) => {
    if (options.properties && !options.properties.includes(key)) return
    if (options.excludedProperties && options.excludedProperties.includes(key)) return
    // Process current attributes or  recurse
    if ((typeof value === 'object') && !isDate(value)) {
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
  // Take care the property is of type of ObjectID
  if (isObjectID(property)) return property
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
    } else if (Array.isArray(value)) {
      return template(item, value)
    } else if (typeof value === 'object') {
      if (isObjectID(value)) return value
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
export function templateQueryObject (item, object, options = {}) {
  let query = templateObject(item, object, options.properties)
  // Perform required automated conversions
  query = (options.skipAllConvert || options.skipConvertComparisonOperators) ? query : convertComparisonOperators(query, options)
  query = (options.skipAllConvert || options.skipConvertNumbers) ? query : convertNumbers(query, options)
  query = (options.skipAllConvert || options.skipConvertDates) ? query : convertDates(query, options)
  return query
}

// Utility function used to template options of a task
export function templateTask (task, taskTemplate) {
  // Omit some useful objects that might have been added internally to template
  // in order to make it available to all tasks (eg a DB client connection).
  // Indeed, to avoid any problem, it should only be raw JS objects
  // and these special objects should not be templated
  const taskOptions = taskTemplate.options || {}
  // Omit some special objects like MongoDB client from templating
  // to avoid any problem as it should only be raw JS object
  const nonTemplateProperties = [taskOptions.clientPath || 'client']
  const taskTemplateOptions = _.omit(taskOptions, nonTemplateProperties)
  const taskNonTemplateOptions = _.pick(taskOptions, nonTemplateProperties)
  const options = templateObject(task, taskTemplateOptions)
  // Restore non-template options
  _.merge(options, taskNonTemplateOptions)
  return options
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
      debug(`Trying to get store ${store} from stores service`)
      store = await storesService.get(store)
    }
  } else {
    // Check if store object already provided as global parameter on params
    debug(`Trying to get store from params in path ${store}`)
    store = _.get(params, path)
  }

  // Try to directly access it by name from service
  if (!store) {
    if (storesService) {
      debug(`Trying to get store ${path} from stores service`)
      store = await storesService.get(path)
    } else {
      throw new Error('Cannot find store on data or params ', data, params)
    }
  }

  if (store) debug('Found store in service, data or params with path/name ' + path)
  else debug('Cannot find store in service, data or params with path/name ' + path)
  return store
}

// Get the actual store object from its definition in input data based on the given name or property path
// or if definition not found retrieve directly from params
export async function getStoreFromHook (hook, hookName, options = {}) {
  debug('Seeking for store in hook ' + hookName)
  try {
    return await getStore(_.get(hook, 'service.storesService'), hook.params, hook.data, options.store || options.storePath)
  } catch (error) {
    throw new Error(`Cannot find store for hook ${hookName}: ${error}`)
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

export function getChunks (hook, options) {
  const item = hook.data // getItems(hook)
  let json = _.get(hook, options.dataPath || 'result.data', {}) || {}
  // Handle specific case of GeoJson
  if (_.get(json, 'type') === 'FeatureCollection') {
    json = json.features
  } else if (_.get(json, 'type') === 'Feature') {
    json = [json]
  } else if (!Array.isArray(json)) {
    json = [json]
  }
  // Allow transform before write
  if (options.transform) {
    const templatedTransform = templateObject(item, options.transform)
    json = transformJsonObject(json, templatedTransform)
  }
  // Defines the chunks
  const chunks = _.chunk(json, _.get(options, 'chunkSize', 100))
  debug(`Data composed of ${json.length} items has been split into ${chunks.length} chunks`)
  return chunks
}

// Convert a set of errors into one to be raised,
// useful eg for operations by chunk to merge errors coming from multiple chunks
export function mergeErrors (errors) {
  // Use first error as base
  const error = errors[0]
  // Check for bulk write errors to merge results
  if (error.writeErrors && error.result) {
    // Convert to raw JSON object if not already done (eg by Feathers)
    if (error.result.toJSON) error.result = error.result.toJSON()
    errors.forEach((bulkError, index) => {
      // As first error is the base object skip it
      if (index > 0) {
        if (bulkError.writeErrors) error.writeErrors = error.writeErrors.concat(bulkError.writeErrors)
        if (bulkError.result) {
          if (bulkError.result.toJSON) bulkError.result = bulkError.result.toJSON()
          error.result.insertedIds = error.result.insertedIds.concat(bulkError.result.insertedIds)
          error.result.upserted = error.result.upserted.concat(bulkError.result.upserted)
          error.result.nInserted += bulkError.result.nInserted
          error.result.nMatched += bulkError.result.nMatched
          error.result.nModified += bulkError.result.nModified
          error.result.nRemoved += bulkError.result.nRemoved
          error.result.nUpserted += bulkError.result.nUpserted
        }
      }
    })
    // Bulk result also has a copy of errors, remove it to avoid doublons/incoherence
    delete error.result.writeErrors
    delete error.result.writeConcernErrors
  } else {
    // As we create a single error object add multiple errors as error details
    error.errors = errors
  }
  return error
}

// Transform nested object to dot notation
export function dotify (object) {
  const dotifiedObject = {}
  function recurse (object, current) {
    _.forOwn(object, (value, key) => {
      const newKey = (current ? current + '.' + key : key)
      if (value && typeof value === 'object') recurse(value, newKey)
      else dotifiedObject[newKey] = value
    })
  }
  recurse(object)
  return dotifiedObject
}