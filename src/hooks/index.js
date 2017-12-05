// Built-in hooks
export * from './hooks.auth'
export * from './hooks.clear'
export * from './hooks.csv'
export * from './hooks.grid'
export * from './hooks.json'
export * from './hooks.pg'
export * from './hooks.raster'
export * from './hooks.store'
export * from './hooks.xml'
export * from './hooks.yaml'

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
