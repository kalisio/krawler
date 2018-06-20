import uuid from 'uuid/v1'
import makeDebug from 'debug'
import { callOnHookItems } from '../utils'

const debug = makeDebug('krawler:hooks:utils')

// Generate UUID
export function generateId (options = {}) {
  return callOnHookItems(item => {
    item.id = uuid()
    debug('Generated uuid', item.id)
  })
}
