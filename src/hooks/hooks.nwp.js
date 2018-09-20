import _ from 'lodash'
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
    // Either can either come from options or input data
    const elements = hook.data.elements || options.elements || []
    const runInterval = hook.data.runInterval || options.runInterval
    const runIndex = hook.data.runIndex || options.runIndex || 0
    const interval = hook.data.interval || options.interval
    const lowerLimit = hook.data.lowerLimit || options.lowerLimit
    const upperLimit = hook.data.upperLimit || options.upperLimit
    // Compute nearest run T0
    const datetime = moment.utc()
    let nearestRunTime = getNearestRunTime(datetime, runInterval)
    let nearestForecastTime = getNearestForecastTime(datetime, interval)
    // We can retrieve nearest run (index 0) or previous ones (index N)
    let runTime = nearestRunTime.clone().subtract({ seconds: -runIndex * runInterval })
    // We don't care about the past, however a forecast is still potentially valid at least until we reach the next one
    let lowerTime = datetime.clone().subtract({ seconds: interval })
    let tasks = []
    // Iterate over times/elements/levels
    for (let timeOffset = lowerLimit; timeOffset <= upperLimit; timeOffset += interval) {
      // Check for each forecast step if update is required
      let forecastTime = nearestForecastTime.clone().add({ seconds: timeOffset })
      elements.forEach(element => {
        element.levels.forEach(level => {
          let task = Object.assign({
            level,
            runTime,
            forecastTime,
            timeOffset
          }, _.omit(element, ['levels']))
          if (!forecastTime.isBefore(lowerTime)) tasks.push(task)
        })
      })
    }
    debug(`Generated ${tasks.length} NWP tasks`, tasks)
    hook.data.tasks = tasks
  }
}
