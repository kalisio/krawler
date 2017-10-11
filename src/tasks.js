// import errors from 'feathers-errors'
import _ from 'lodash'
import request from 'request'
import makeDebug from 'debug'

const debug = makeDebug('krawler:tasks')

class Service {
  constructor (options) {
    if (!options) {
      throw new Error('krawler tasks service: constructor `options` must be provided')
    }

    if (!options.Model) {
      throw new Error('krawler tasks service: constructor `options.Model` must be provided')
    }

    this.Model = options.Model
    this.id = options.id || 'id'
  }

  // Build the request options to download data from input data source
  getRequest (type, options) {
    let queryParameters = _.merge({}, _.omit(options, ['url', 'subsets']))
    switch (type) {
      case 'wcs':
        queryParameters.REQUEST = 'GetCoverage'
        // Convert from a json subset key/value to standard, eg height: 10 => height(10)
        if (options.subsets) {
          queryParameters.subset = []
          Object.entries(options.subsets).forEach(subset => {
            queryParameters.subset.push(subset[0] + '(' + subset[1] + ')')
          })
        }
        break
      case 'wms':
        // FIXME: TODO
        queryParameters.REQUEST = 'GetMap'
        break
      case 'http':
      default:
        break
    }
    // Setup request with URL & params
    debug('Requesting ' + options.url + ' with following parameters', queryParameters)
    return {
      url: options.url,
      qs: queryParameters,
      qsStringifyOptions: { arrayFormat: 'repeat' }
    }
  }

  create (data, params = {}) {
    let { id, type, options } = data
    
    return new Promise((resolve, reject) => {
      request.get(this.getRequest(type, options))
        .pipe(this.Model.createWriteStream({
          key: id,
          params: data.storage
        }, (error) =>
          error
            ? reject(error)
            : resolve({
              [this.id]: id
            })
        ))
        .on('error', reject)
    })
  }

  remove (id) {
    return new Promise((resolve, reject) => {
      this.Model.remove({
        key: id
      }, error => error ? reject(error) : resolve())
    })
  }
}

export default function init (options) {
  return new Service(options)
}

init.Service = Service
