import request from 'request'
import * as turf from '@turf/turf'
import _ from 'lodash'
import { hooks } from '../../lib/index.js'

const WFS_URL = 'https://data.geopf.fr/wfs/ows'

// GET request for short WFS queries (no large CQL_FILTER payload).
function wfsGet (params) {
  return new Promise((resolve, reject) => {
    request({ url: WFS_URL, qs: params, json: true }, (err, res, body) => {
      if (err) return reject(err)
      if (res.statusCode !== 200) {
        return reject(new Error(`WFS error (${res.statusCode}): ${JSON.stringify(body).substring(0, 500)}`))
      }
      resolve(body)
    })
  })
}

// Fetch Admin Express commune features matching an array of SIREN codes.
// All codes are combined into a single OR-joined CQL_FILTER (one request).
function fetchCommunesBySiren (sirenCodes) {
  const filter = sirenCodes.map(s => `codes_siren_des_epci LIKE '%${s}%'`).join(' OR ')
  return wfsGet({
    service: 'WFS',
    request: 'GetFeature',
    version: '2.0.0',
    typeNames: 'ADMINEXPRESS-COG-CARTO.LATEST:commune',
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    CQL_FILTER: filter
  }).then(body => {
    if (!body.features) throw new Error(`Unexpected Admin Express response for SIREN codes: ${sirenCodes.join(', ')}`)
    return body.features
  })
}

// Fetch Admin Express commune features matching an array of INSEE codes.
function fetchCommunesByInsee (inseeCodes) {
  const filter = `code_insee IN (${inseeCodes.map(c => `'${c}'`).join(',')})`
  return wfsGet({
    service: 'WFS',
    request: 'GetFeature',
    version: '2.0.0',
    typeNames: 'ADMINEXPRESS-COG-CARTO.LATEST:commune',
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    CQL_FILTER: filter
  }).then(body => {
    if (!body.features) throw new Error(`Unexpected Admin Express response for INSEE codes: ${inseeCodes.join(', ')}`)
    return body.features
  })
}

// Get the total number of BD TOPO features matching a CQL filter.
// resultType=hits returns XML regardless of outputFormat, so we fetch one feature
// and read numberMatched from the GeoJSON response instead.
function fetchFeatureCount (typeNames, cqlFilter) {
  return wfsGet({
    service: 'WFS',
    request: 'GetFeature',
    version: '2.0.0',
    typeNames,
    outputFormat: 'application/json',
    count: 1,
    CQL_FILTER: cqlFilter
  }).then(body => body.numberMatched || 0)
}

// Maximum raw WKT character length that safely survives URL-encoding and common
// server URL length limits (~8 KB). URL-encoding can expand by ~2-3x so we cap
// the raw WKT at 2000 chars, leaving plenty of headroom for the other parameters.
const WKT_SAFE_LENGTH = 2000

// Merge an array of GeoJSON polygon features into a single Feature<(Multi)Polygon>
// then adaptively simplify until the WKT fits within WKT_SAFE_LENGTH.
// Falls back to convex hull if no tolerance produces a short enough geometry.
function unionFeatures (features) {
  let result = features[0]
  for (let i = 1; i < features.length; i++) {
    result = turf.union(result, features[i])
  }
  for (const tolerance of [0.001, 0.005, 0.01, 0.05]) {
    const simplified = turf.simplify(result, { tolerance, highQuality: false })
    const wkt = geometryToWkt(simplified.geometry)
    if (wkt.length <= WKT_SAFE_LENGTH) {
      console.log(`Simplification tolerance ${tolerance} deg, WKT length: ${wkt.length} chars`)
      return simplified
    }
  }
  console.warn('Falling back to convex hull — geometry too complex at all tolerances')
  return turf.convex(turf.featureCollection(features))
}

// Decimal places kept in WKT coordinates — 5 dp ≈ 1 m, sufficient for spatial
// filtering and roughly halves coordinate string length vs full float precision.
const COORD_PRECISION = 5

// Convert a GeoJSON geometry (Polygon or MultiPolygon) to WKT.
function ringToWkt (ring) {
  return '(' + ring.map(c => `${c[0].toFixed(COORD_PRECISION)} ${c[1].toFixed(COORD_PRECISION)}`).join(',') + ')'
}

function geometryToWkt (geometry) {
  if (geometry.type === 'Polygon') {
    return 'POLYGON(' + geometry.coordinates.map(ringToWkt).join(',') + ')'
  }
  if (geometry.type === 'MultiPolygon') {
    const polys = geometry.coordinates.map(rings => '(' + rings.map(ringToWkt).join(',') + ')')
    return 'MULTIPOLYGON(' + polys.join(',') + ')'
  }
  throw new Error(`Unsupported geometry type: ${geometry.type}`)
}

// Custom hook: resolves communes from Admin Express using SIREN codes, INSEE codes,
// or both, builds an adaptively simplified union polygon, probes the total feature
// count, then generates one WFS task per page for parallel download.
const generateTasks = (options) => {
  return async (hook) => {
    const { siren, insee, dataType, count } = options
    const typeNames = `BDTOPO_V3:${dataType}`

    if (!siren && !insee) throw new Error('Provide at least one of BDTOPO_SIREN or BDTOPO_INSEE')

    let communeFeatures = []

    if (siren) {
      const sirenCodes = siren.split(',').map(s => s.trim()).filter(Boolean)
      console.log(`Fetching communes for SIREN code(s): ${sirenCodes.join(', ')}`)
      const features = await fetchCommunesBySiren(sirenCodes)
      communeFeatures.push(...features)
    }

    if (insee) {
      const inseeCodes = insee.split(',').map(s => s.trim()).filter(Boolean)
      console.log(`Fetching communes for INSEE code(s): ${inseeCodes.join(', ')}`)
      const features = await fetchCommunesByInsee(inseeCodes)
      communeFeatures.push(...features)
    }

    // Deduplicate in case SIREN and INSEE inputs overlap
    communeFeatures = _.uniqBy(communeFeatures, f => f.properties.code_insee)

    if (communeFeatures.length === 0) {
      throw new Error('No communes found for the provided SIREN/INSEE codes')
    }

    const inseeCodes = communeFeatures.map(f => f.properties.code_insee)
    console.log(`Found ${communeFeatures.length} communes:`, inseeCodes.join(', '))

    const union = unionFeatures(communeFeatures)
    const wkt = geometryToWkt(union.geometry)
    const cqlFilter = `INTERSECTS(geometrie,SRID=4326;${wkt})`

    const totalCount = await fetchFeatureCount(typeNames, cqlFilter)
    const pageCount = Math.ceil(totalCount / count) || 1
    console.log(`${totalCount} features to download across ${pageCount} page(s) of ${count}`)

    hook.data.tasks = Array.from({ length: pageCount }, (_, page) => ({
      id: `bdtopo-${dataType}-page${page}`,
      type: 'wfs',
      outputType: 'intermediate',
      options: {
        url: WFS_URL,
        version: '2.0.0',
        typeNames,
        outputFormat: 'application/json',
        srsName: 'EPSG:4326',
        count,
        startIndex: page * count,
        CQL_FILTER: cqlFilter
      }
    }))

    return hook
  }
}

hooks.registerHook('generateTasks', generateTasks)

// Custom hook: merges GeoJSON FeatureCollections from all page task results into
// a single FeatureCollection stored at hook.result.data, ready for writeJson.
const mergeGeoJson = () => {
  return (hook) => {
    const features = hook.result.flatMap(result => _.get(result, 'data.features', []))
    console.log(`Merged ${features.length} features from ${hook.result.length} page(s)`)
    hook.result.data = { type: 'FeatureCollection', features }
    return hook
  }
}

hooks.registerHook('mergeGeoJson', mergeGeoJson)
