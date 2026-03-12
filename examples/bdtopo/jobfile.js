// This example job has been entirely generated using AI (Claude)
import path from 'path'
import { fileURLToPath } from 'url'
import './generateTasks.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Area of interest: provide SIREN code(s), INSEE code(s), or both.
// BDTOPO_SIREN: comma-separated EPCI SIREN codes  (e.g. '243100518,200096956')
// BDTOPO_INSEE: comma-separated commune INSEE codes (e.g. '31555,31069,47001')
// When both are set their commune lists are merged and deduplicated.
const siren = process.env.BDTOPO_SIREN || '200096956'
const insee = process.env.BDTOPO_INSEE

// Target BD TOPO data type - configurable via BDTOPO_DATA_TYPE environment variable.
// Available types in the BDTOPO_V3 namespace:
//   erp                   - Public buildings
//   batiment              - Buildings
//   troncon_de_route      - Road segments
//   troncon_voie_ferree   - Railway segments
//   cours_d_eau           - Waterways / Rivers
//   plan_d_eau            - Water bodies / Lakes
//   zone_de_vegetation    - Vegetation areas
//   surface_hydrographique - Hydrographic surfaces
//   aerodrome             - Airports / Aerodromes
const dataType = process.env.BDTOPO_DATA_TYPE || 'erp'

// Number of features per WFS page. generateTasks will probe the total count and
// generate as many tasks as needed to cover all pages.
const count = parseInt(process.env.BDTOPO_COUNT || '1000')

export default {
  id: 'bdtopo-download',
  store: 'output-store',
  hooks: {
    tasks: {
      after: {
        // Parse each page response into result.data; no per-page file is written.
        readJson: {}
      }
    },
    jobs: {
      before: {
        createStores: [{
          id: 'output-store',
          type: 'fs',
          options: { path: path.join(__dirname, '..', 'output') }
        }],
        // Queries Admin Express to resolve member communes from the SIREN code,
        // probes the total feature count, then generates one task per WFS page.
        generateTasks: { siren, insee, dataType, count }
      },
      after: {
        // Flatten all page FeatureCollections into one, then write a single file.
        mergeGeoJson: {},
        writeJson: {
          key: `bdtopo-${dataType}.geojson`,
          outputType: 'geojson'
        },
        clearOutputs: {},
        removeStores: ['output-store']
      }
    }
  }
}
