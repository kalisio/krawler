// import errors from 'feathers-errors'
import _ from 'lodash'
import request from 'request'
import makeDebug from 'debug'
import * as stores from './stores'

const debug = makeDebug('krawler:tasks')

class Service {
  constructor (options = {}) {
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
    let { id, type, options, store, storageOptions } = data

    return new Promise((resolve, reject) => {
      const message = 'Can\'t find store ' + store
      store = stores.getStore(store)
      if (!store) {
        reject(new Error(message))
        return
      }
      request.get(this.getRequest(type, options))
        .pipe(store.createWriteStream({
          key: id,
          params: storageOptions
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

  remove (id, params) {
    return new Promise((resolve, reject) => {
      const query = params.query
      let store = query.store || params.store
      const message = 'Can\'t find store ' + store
      if (typeof store === 'string') store = stores.getStore(store)
      if (!store) {
        reject(new Error(message))
        return
      }
      store.remove({
        key: id
      }, error => error ? reject(error) : resolve())
    })
  }
}

export default function init (options) {
  return new Service(options)
}

init.Service = Service
