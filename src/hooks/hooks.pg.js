import path from 'path'
import util from 'util'
import _ from 'lodash'
import pg from 'pg'
import makeDebug from 'debug'

const debug = makeDebug('krawler:hooks:pg')

// Drop a table from the specific hook 
export function dropTable (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'dropTable' hook should only be used as a 'after' hook.`)
    }

    // Connect to the database
    if (! options.pool) {
      throw new Error(`The 'dropTable' options must contain a pg.Pool instance.`)
    }
    const client = await options.pool.connect()
    
    // Drop the table
    let table = _.get(options, 'table', _.snakeCase(hook.result.id))
    await client.query('DROP TABLE IF EXISTS ' + table)
  }
}

// Create a table from the specific hook 
export function createTable (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'createTable' hook should only be used as a 'after' hook.`)
    }

    // Connect to the database
    if (! options.pool) {
      throw new Error(`The 'createTable' options must contain a pg.Pool instance.`)
    }
    const client = await options.pool.connect()

    // Create the table
    let table = _.get(options, 'table', _.snakeCase(hook.result.id))
    await client.query('CREATE TABLE ' + table + ' (id SERIAL PRIMARY KEY, geom GEOMETRY(POINTZ, 4326), properties JSON)')
  }
}

// Generate a JSON from specific hook result values
export function writeTable (options = {}) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error(`The 'writeTable' hook should only be used as a 'after' hook.`)
    }
    
     // Connect to the database
     if (! options.pool) {
      throw new Error(`The 'writeTable' options must contain a pg.Pool instance.`)
    }
    const client = await options.pool.connect()

    // Defines the chunks
    let geojson = _.get(hook, options.dataPath || 'result.data', {})
    let chunks = []
    if (geojson.type === 'FeatureCollection') {
      chunks = _.chunk(geojson.features, _.get(options, 'chunkSize', 10))
    } else if (geojson.type === 'Feature') {
      chunks.push([geojson])
    }

    // Write the chunks
    let table = _.get(options, 'table', _.snakeCase(hook.result.id))
    for(let i = 0; i < chunks.length; ++i) {
      let values = ''
      let params = []
      let counter = 1
      for(let j = 0; j < chunks[i].length; ++j) {
        values += util.format(' (ST_SetSRID(ST_GeomFromGeoJSON($%d), 4326), $%d)', counter++, counter++)
        if (j < (chunks[i].length - 1)) {
          values += ','
        }
        params.push(chunks[i][j].geometry)
        params.push(chunks[i][j].properties)
      }
      await client.query('INSERT INTO ' + table + ' (geom, properties) VALUES' + values, params)
    }
    await client.release()
  }
}
