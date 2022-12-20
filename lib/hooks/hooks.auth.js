import _ from 'lodash'
import utils from 'util'
import request from 'request'
import makeDebug from 'debug'

const debug = makeDebug('krawler:hooks:auth')

// Add headers for basic/proxy auth
export function basicAuth (options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'basicAuth\' hook should only be used as a \'before\' hook.')
    }
    const path = options.optionsPath || 'options'
    const requestOptions = _.get(hook.data, path)
    const auth = requestOptions.auth
    if (auth && auth.user && auth.password) {
      if (!requestOptions.headers) requestOptions.headers = {}
      // Defaults to Basic Auth
      const type = options.type || 'Authorization'
      requestOptions.headers[type] = 'Basic ' + Buffer.from(auth.user + ':' + auth.password).toString('base64')
      debug('Added basic auth header ' + type + ' = ' + requestOptions.headers[type])
      // Once consumed not required anymore and will avoid polluting request parameters
      _.unset(requestOptions, 'auth')
    }
  }
}

// OAuth specification rely on snake case and we prefer to keep this to avoid any confusion
/* eslint-disable camelcase */
export function OAuth (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'OAuth\' hook should only be used as a \'before\' hook.')
    }
    const path = options.optionsPath || 'options'
    const requestOptions = _.get(hook.data, path)
    const oauth = requestOptions.oauth
    if (oauth) {
      const { client_id, client_secret, method, url } = oauth
      let response
      if (!requestOptions.headers) requestOptions.headers = {}
      if (method === 'client_secret_basic') {
        response = await utils.promisify(request.get)({
          url,
          headers: { Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64') }
        })
      } else if (method === 'client_secret_post') {
        response = await utils.promisify(request.post)({
          url,
          body: JSON.stringify({ client_id, client_secret })
        })
      }
      const { access_token, token_type } = JSON.parse(response.body)
      // Defaults to Bearer Auth
      const type = options.type || 'Authorization'
      requestOptions.headers[type] = `${token_type} ${access_token}`
      debug('Sending oauth header ' + type + ' = ' + requestOptions.headers[type])
      // Once consumed not required anymore and will avoid polluting request parameters
      _.unset(requestOptions, 'oauth')
    }
  }
}
