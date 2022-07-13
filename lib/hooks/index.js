import _ from 'lodash'
import sift from 'sift'
import common from 'feathers-hooks-common'
import makeDebug from 'debug'
import { templateQueryObject } from '../utils.js'

// Feathers hooks
export * from 'feathers-hooks-common'
// Built-in hooks
export * from './hooks.auth.js'
export * from './hooks.clear.js'
export * from './hooks.csv.js'
export * from './hooks.docker.js'
export * from './hooks.feathers.js'
export * from './hooks.ftp.js'
export * from './hooks.grid.js'
export * from './hooks.json.js'
export * from './hooks.geojson.js'
export * from './hooks.kml.js'
export * from './hooks.logger.js'
export * from './hooks.mongo.js'
export * from './hooks.nwp.js'
export * from './hooks.ogc.js'
export * from './hooks.pg.js'
export * from './hooks.raster.js'
export * from './hooks.store.js'
export * from './hooks.system.js'
export * from './hooks.txt.js'
export * from './hooks.utils.js'
export * from './hooks.xml.js'
export * from './hooks.yaml.js'

const debug = makeDebug('krawler:hooks')
const { getItems, when } = common
// Custom hooks
const hooks = {}

export function registerHook (hookName, hookFunction) {
  hooks[hookName] = hookFunction
}

export function unregisterHook (hookName) {
  delete hooks[hookName]
}

export function getHook (hookName) {
  return hooks[hookName]
}

export function parallel (hooks) {
  return async function (hookObject) {
    return Promise.all(hooks.map(hook => hook(hookObject))).then(_ => hookObject)
  }
}

export function getHookFunction (hookName) {
  // Jump from name to the real hook function
  // First built-in hooks
  let hook = hooks[hookName]
  // Then custom ones
  if (!hook) hook = getHook(hookName)
  if (typeof hook !== 'function') {
    const message = 'Unknown hook ' + hookName
    debug(message)
    throw new Error(message)
  }
  return hook
}

// Generate a predicate to be used in a when/iff clause
// that will skip the associated hook depending on configured properties
export function match (hookName, filter) {
  return async function (hook) {
    let hookObject = hook
    // Handle error hooks as usual
    if (hook.type === 'error') hookObject = hook.original
    // Retrieve the item from the hook if any
    const item = (hookObject ? getItems(hookObject) : null)
    if (!item) {
      debug('Executing hook ' + hookName + ' on undefined item as filtering does not apply')
      return true
    }
    // Check for a user-given predicate function first
    if (typeof filter.predicate === 'function') {
      const execute = await filter.predicate(item)
      if (!execute) {
        debug('Skipping hook ' + hookName + ' due to unverified predicate on item', item)
        return false
      }
    }
    if (Array.isArray(item)) {
      debug('Executing hook ' + hookName + ' on item array as filtering does not apply')
      return true
    }
    const templatedFilter = templateQueryObject(item, _.omit(filter, ['predicate']))
    // Check if the hook has to be executed or not depending on its properties
    const execute = !_.isEmpty(sift(templatedFilter, [item]))
    if (!execute) debug('Skipping hook ' + hookName + ' due to filter', templatedFilter)
    else debug('Executing hook ' + hookName + ' not filtered by', templatedFilter)
    return execute
  }
}

function getFaultTolerantHook (hookFunction) {
  return async function (hook) {
    try {
      const result = await hookFunction(hook)
      return result
    } catch (error) {
      debug('Catching fault-tolerant hook')
      console.error(error)
      return hook
    }
  }
}

export function addHook (hookName, hookOptions, pipeline) {
  // Jump from name/options to the real hook function
  let hook = getHookFunction(hookName)
  // We have a default filter to skip hooks at some point in the chain
  const filter = { skip: { $exists: false } }
  // Take care that sometimes options is simply a string object and a match function do exist in this case
  const hookFilter = (typeof hookOptions === 'string' ? undefined : hookOptions.match)
  if (hookFilter) {
    debug('Adding hook ' + hookName + ' to hook chain with filter', filter)
    Object.assign(filter, hookFilter)
  } else {
    debug('Adding hook ' + hookName + ' to hook chain')
  }
  if (hookOptions.faultTolerant) {
    debug('Adding fault-tolerant support for hook ' + hookName)
    hook = getFaultTolerantHook(hook(hookOptions))
  } else {
    hook = hook(hookOptions)
  }
  // Add filtering options to hook
  hook = when(match(hookName, filter), hook)
  if (pipeline) pipeline.push(hook)
  return hook
}

export function activateHooks (serviceHooks, service) {
  const feathersHooks = {}
  // Iterate over hook types (before, after)
  _.forOwn(serviceHooks, (hooksDefinition, stage) => {
    // Iterate over hooks to create the hook pipeline
    const pipeline = []
    _.forOwn(hooksDefinition, (hookOptions, hookName) => {
      // If hook name is given as 'hook' option property use it
      // otherwise us key as hook name
      hookName = _.get(hookOptions, 'hook', hookName)
      // Check for parallel execution hook
      if (hookName === 'parallel') {
        try {
          debug('Adding parallel hook to hook chain with following hooks')
          // In this case we have an array of hooks to be run in parallel
          // Directly given if written as parallel: [...] or as an option
          // if written as { hook: 'parallel', hooks: [...] }
          const items = (Array.isArray(hookOptions) ? hookOptions : hookOptions.hooks)
          // Each item contains the hook name as a 'hook' property and hook options
          const hooks = []
          items.forEach(item => addHook(item.hook, item, hooks))
          pipeline.push(parallel(hooks))
        } catch (error) {
          console.error(error.message)
        }
      } else {
        // Jump from name/options to the real hook function
        try {
          addHook(hookName, hookOptions, pipeline)
        } catch (error) {
          console.error(error.message)
        }
      }
    })
    feathersHooks[stage] = { create: pipeline } // We only have create operation to manage
  })
  // Setup hooks on service
  if (service) service.hooks(feathersHooks)
  return feathersHooks
}
