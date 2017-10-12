let stores = {}

export function registerStore (name, store) {
  stores[name] = store
}

export function unregisterStore (name) {
  delete stores[name]
}

export function getStore (name) {
  return stores[name]
}
