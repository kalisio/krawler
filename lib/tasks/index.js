import http from './tasks.http.js'
import wms from './tasks.wms.js'
import wcs from './tasks.wcs.js'
import wfs from './tasks.wfs.js'
import overpass from './tasks.overpass.js'
import store from './tasks.store.js'
import mongo from './tasks.mongo.js'
import noop from './tasks.noop.js'

export default {
  http,
  wms,
  wcs,
  wfs,
  overpass,
  store,
  mongo,
  noop
}
