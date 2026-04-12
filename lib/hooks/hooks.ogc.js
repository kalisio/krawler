import _ from 'lodash'
import xml2js from 'xml2js'
import makeDebug from 'debug'

const debug = makeDebug('krawler:hooks:ogc')

// Generate a YAML from specific hook result values
export function getCapabilities (options = {}) {
  return async function (hook) {
    const queryParameters = _.merge({ request: 'GetCapabilities' }, _.omit(options, ['url', 'headers']))
    const requestParameters = {
      method: 'GET',
      url: options.url,
      headers: options.headers,
      qs: queryParameters,
      qsStringifyOptions: { arrayFormat: 'repeat' }
    }

    const url = new URL(requestParameters.url)
    Object.keys(requestParameters.qs).forEach((param) => {
      const value = requestParameters[param]
      if (Array.isArray(value)) {
          value.forEach((val) => url.searchParams.append(param, val))
      } else {
          url.searchParams.append(param, value)
      }
    })

    debug('Requesting ' + options.url + ' with following parameters', queryParameters)
    try {
      const response = await fetch(url, {
        method: requestParameters.method,
        headers: requestParameters.headers
      })
      if (!response.ok) {
        throw new Error('Request rejected with HTTP code ' + response.status)
      }
      // parse the body
      const body = await response.text()
      const parser = new xml2js.Parser({ explicitArray: false })
      const result = await parser.parseStringPromise(body)
      // feed the hook with the parsed result
      _.set(hook, options.dataPath || 'result.data', result)
      return hook
    } catch(err) {
      throw err
    }
  }
}
