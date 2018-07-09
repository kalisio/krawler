import moment from 'moment'
import makeDebug from 'debug'

const debug = makeDebug('krawler:hooks:nwp')

/*
  Round hours to expected interval, e.g. we're currently using 6 hourly interval i.e. 00 || 06 || 12 || 18
  @return {string}
 */
function roundHours (hours, interval) {
  return (Math.floor(hours / interval) * interval)
}

function getNearestRunTime (datetime, interval) {
  // Compute nearest run T0
  return datetime.clone().hours(roundHours(datetime.hours(), interval / 3600)).minutes(0).seconds(0).milliseconds(0)
}

function getNearestForecastTime (datetime, interval) {
  // Compute nearest forecast T0
  let offsetDateTime = datetime.clone().add({ seconds: 0.5 * interval })
  return datetime.clone().hours(roundHours(offsetDateTime.hours(), interval / 3600)).minutes(0).seconds(0).milliseconds(0)
}

// Generate download tasks for NWP models
export function generateNwpTasks (options) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'generateNwpDownloadTasks' hook should only be used as a 'before' hook.`)
    }

    const elements = options.elements || []
    // Compute nearest run T0
    const datetime = moment.utc()
    let nearestRunTime = getNearestRunTime(datetime, options.runInterval)
    let nearestForecastTime = getNearestForecastTime(datetime, options.interval)
    // We can retrieve nearest run (index 0) or previous ones (index N)
    let runTime = nearestRunTime.clone().subtract({ seconds: -(options.runIndex || 0) * options.runInterval })
    // We don't care about the past, however a forecast is still potentially valid at least until we reach the next one
    let lowerTime = datetime.clone().subtract({ seconds: options.interval })
    let tasks = []
    // Iterate over elements/levels
    elements.forEach(element => {
      element.levels.forEach(level => {
        // Check for each forecast step if update is required
        for (let timeOffset = options.lowerLimit; timeOffset <= options.upperLimit; timeOffset += options.interval) {
          let forecastTime = nearestForecastTime.clone().add({ seconds: timeOffset })
          let task = {
            element: element.name,
            level,
            runTime,
            forecastTime
          }
          if (!forecastTime.isBefore(lowerTime)) tasks.push(task)
        }
      })
    })
    debug(`Generated ${tasks.length} NWP tasks`, tasks)
    hook.data.tasks = tasks
  }
}
