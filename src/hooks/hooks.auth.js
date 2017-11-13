import _ from 'lodash'
import makeDebug from 'debug'

const debug = makeDebug('krawler:hooks:auth')

// Add headers for basic/proxy auth
export function basicAuth (options) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'basicAuth' hook should only be used as a 'before' hook.`)
    }
    const path = options.path || 'options'
    const requestOptions = _.get(hook.data, path)
    const auth = requestOptions.auth
    if (auth && auth.user && auth.password) {
      console.log(auth)
      if (!requestOptions.headers) requestOptions.headers = {}
      // Defaults to Basic Auth
      const type = options.type || 'Authorization'
      requestOptions.headers[type] = 'Basic ' + Buffer.from(auth.user + ':' + auth.password).toString('base64')
      debug('Added basic auth header ' + type + ' = ' + requestOptions.headers[type])
      // Not required anymore
      delete requestOptions.auth
    }
  }
}
