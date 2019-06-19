import _ from 'lodash'
import sift from 'sift'
import { getItems, when } from 'feathers-hooks-common'
import makeDebug from 'debug'
import { templateQueryObject } from '../utils'

// Feathers hooks
export * from 'feathers-hooks-common'
// Built-in hooks
export * from './hooks.auth'
export * from './hooks.clear'
export * from './hooks.csv'
export * from './hooks.docker'
export * from './hooks.ftp'
export * from './hooks.grid'
export * from './hooks.json'
export * from './hooks.geojson'
export * from './hooks.mongo'
export * from './hooks.nwp'
export * from './hooks.ogc'
export * from './hooks.pg'
export * from './hooks.raster'
export * from './hooks.store'
export * from './hooks.system'
export * from './hooks.utils'
export * from './hooks.xml'
export * from './hooks.yaml'

const debug = makeDebug('krawler:hooks')
// Custom hooks
let hooks = {}

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
    let message = 'Unknown hook ' + hookName
    debug(message)
    throw new Error(message)
  }
  return hook
}

// Generate a predicate to be used in a when/iff clause
// that will skip the associated hook depending on configured properties
export function match (hookName, filter) {
  return function (hook) {
    let hookObject = hook
    // Handle error hooks as usual
    if (hook.type === 'error') hookObject = hook.original
    // Retrieve the item from the hook
    let item = getItems(hookObject)
    if (Array.isArray(item)) {
      debug('Executing hook ' + hookName + ' on item array as filtering does not apply')
      return true
    }
    const templatedFilter = templateQueryObject(item, _.omit(filter, ['predicate']))
    // Check if the hook has to be executed or not depending on its properties
    let execute = !_.isEmpty(sift(templatedFilter, [item]))
    // If yes check for a user-given predicate function as well
    if (execute && (typeof filter.predicate === 'function')) {
      execute = filter.predicate(item)
    }
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
      console.error(error)
      return hook
    }
  }
}

export function addHook (hookName, hookOptions, pipeline) {
  // Jump from name/options to the real hook function
  let hook = getHookFunction(hookName)
  // We have a default filter to skip hooks at some point in the chain
  let filter = { skip: { $exists: false } }
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
  let feathersHooks = {}
  // Iterate over hook types (before, after)
  _.forOwn(serviceHooks, (hooksDefinition, stage) => {
    // Iterate over hooks to create the hook pipeline
    let pipeline = []
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
          let hooks = []
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
