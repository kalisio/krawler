import util from 'util'
import _ from 'lodash'
import pg from 'pg'
import makeDebug from 'debug'

const debug = makeDebug('krawler:hooks:pg')

// Connect to the postgres database
export function connectPG (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'connectPG' hook should only be used as a 'before' hook.`)
    }

    debug('Connecting to PG for ' + hook.data.id)
    let client = new pg.Client(options)
    await client.connect()
    _.set(hook.data, options.clientPath || 'client', client)
    debug('Connected to PG for ' + hook.data.id)
    return hook
  }
}

// Disconnect from the database
export function disconnectPG (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'disconnectPG' hook should only be used as a 'after' hook.`)
    }
    let client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error(`You must be connected to PostgresSQL before using the 'disconnectPG' hook`)
    }

    debug('Disconnecting from PG for ' + hook.data.id)
    await client.end()
    _.unset(hook, options.clientPath || 'data.client')
    debug('Disconnected from PG for ' + hook.data.id)
    return hook
  }
}

// Drop a table from the specific hook
export function dropPGTable (options = {}) {
  return async function (hook) {
    let client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error(`You must be connected to PostgresSQL before using the 'dropPGTable' hook`)
    }

    // Drop the table
    let table = _.get(options, 'table', _.snakeCase(hook.result.id))
    debug('Droping the ' + table + ' table')
    await client.query('DROP TABLE IF EXISTS ' + table)
    return hook
  }
}

// Create a table from the specific hook
export function createPGTable (options = {}) {
  return async function (hook) {
    let client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error(`You must be connected to PostgresSQL before using the 'createPGTable' hook`)
    }

    // Create the table
    let table = _.get(options, 'table', _.snakeCase(hook.result.id))
    debug('Creating the ' + table + ' table')
    await client.query('CREATE TABLE ' + table + ' (id SERIAL PRIMARY KEY, geom GEOMETRY(POINTZ, 4326), properties JSON)')
    return hook
  }
}

// Generate a JSON from specific hook result values
export function writePGTable (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'writePGTable' hook should only be used as a 'after' hook.`)
    }
    let client = _.get(hook.data, options.clientPath || 'client')
    if (_.isNil(client)) {
      throw new Error(`You must be connected to PostgresSQL before using the 'writePGTable' hook`)
    }

    // Defines the chunks
    let geojson = _.get(hook, options.dataPath || 'result.data', {})
    let chunks = []
    if (geojson.type === 'FeatureCollection') {
      chunks = _.chunk(geojson.features, _.get(options, 'chunkSize', 10))
    } else if (geojson.type === 'Feature') {
      chunks.push([geojson])
    }

    // Write the chunks
    // The insert query must have the following form ($1, $2), ($3, $4) .... ($i, $i+1) [param1, param2 ....... parami, param i+1]
    let table = _.get(options, 'table', _.snakeCase(hook.result.id))
    debug('Inserting GeoJSON in the ' + table + ' table')
    for (let i = 0; i < chunks.length; ++i) {
      let values = ''
      let params = []
      let counter = 1
      for (let j = 0; j < chunks[i].length; ++j) {
        values += util.format(' (ST_SetSRID(ST_GeomFromGeoJSON($%d), 4326), $%d)', counter++, counter++)
        if (j < (chunks[i].length - 1)) {
          values += ','
        }
        params.push(chunks[i][j].geometry)
        params.push(chunks[i][j].properties)
      }
      await client.query('INSERT INTO ' + table + ' (geom, properties) VALUES' + values, params)
    }
    return hook
  }
}
