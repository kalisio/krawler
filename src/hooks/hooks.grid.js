import _ from 'lodash'

// Generate grid spec from location/width/resolution spec
export function generateGrid (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'generateGrid' hook should only be used as a 'before' hook.`)
  }

  if (_.isNumber(hook.data.resolution) && _.isNumber(hook.data.halfWidth) && _.isNumber(hook.data.longitude) && _.isNumber(hook.data.latitude)) {
    const resolution = hook.data.resolution
    // Convert resolution/width from meters to degrees and
    // compute corresponding delta latitude/longitude at given latitude
    const earthRadius = 6356752.31424518
    const convergenceFactor = Math.cos(hook.data.latitude * Math.PI / 180)
    const dLatitude = 360 * resolution / (2 * Math.PI * earthRadius)
    const dLongitude = dLatitude * convergenceFactor
    const halfWidthLatitude = 360 * hook.data.halfWidth / (2 * Math.PI * earthRadius)
    const halfWidthLongitude = halfWidthLatitude * convergenceFactor
    // Then setup grid spec
    hook.data.resolution = [ dLongitude, dLatitude ]
    hook.data.origin = [ hook.data.longitude - halfWidthLongitude, hook.data.latitude - halfWidthLatitude ]
    hook.data.size = [ 2 * halfWidthLongitude / dLongitude, 2 * halfWidthLatitude / dLatitude ]
  }

  return hook
}

// Generate the task to download gridded data from grid spec
export function generateGridTasks (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'generateGridTasks' hook should only be used as a 'before' hook.`)
  }

  if (hook.data.origin && hook.data.origin.length > 1 &&
      hook.data.size && hook.data.size.length > 1 &&
      hook.data.resolution && hook.data.resolution.length > 1) {
    const origin = hook.data.origin
    const size = hook.data.size
    const resolution = hook.data.resolution

    let tasks = []
    for (let i = 0; i < size[0]; i++) {
      for (let j = 0; j < size[1]; j++) {
        let minLon = origin[0] + (i * resolution[0])
        let minLat = origin[1] + (j * resolution[1])
        let maxLon = minLon + resolution[0]
        let maxLat = minLat + resolution[1]
        tasks.push({
          id: j.toFixed() + '-' + i.toFixed(),
          options: {
            BBOX: minLat + ',' + minLon + ',' + maxLat + ',' + maxLon
          }
        })
      }
    }
    hook.data.tasks = tasks
  }

  return hook
}
