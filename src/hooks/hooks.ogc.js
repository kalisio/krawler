import _ from 'lodash'
import request from 'request'
import xml2js from 'xml2js'
import makeDebug from 'debug'

const debug = makeDebug('krawler:hooks:ogc')

// Generate a YAML from specific hook result values
export function getCapabilities (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'getCapabilities' hook should only be used as a 'after' hook.`)
    }

    let queryParameters = _.merge({ request: 'GetCapabilities' }, _.omit(options, ['url', 'headers']))
    let requestParameters = {
      method: 'GET',
      url: options.url,
      headers: options.headers,
      qs: queryParameters,
      qsStringifyOptions: { arrayFormat: 'repeat' }
    }

    debug('Requesting ' + options.url + ' with following parameters', queryParameters)
    return new Promise((resolve, reject) => {
      request(requestParameters, (error, response, body) => {
        // trivial check
        if (error) reject(error)
        if (response.statusCode !== 200) reject(new Error('Request rejected with HTTP code ' + response.statusCode))
        // parse the body
        let parser = new xml2js.Parser()
        parser.parseString(body, (err, result) => {
          if (err) {
            reject(err)
          }
          // feed the hook with the parsed result
          _.set(hook, options.dataPath || 'result.data', result)
          resolve(hook)
        })
      })
    })
  }
}
