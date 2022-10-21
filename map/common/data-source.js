import _ from 'lodash'
import moment from 'moment'
import { getNearestRunTime, getNearestForecastTime } from '@weacast/core/common.js'
import { readAsTimeOrDuration, makeTime } from './moment-utils.js'

function splitDynamic (root, key, dynamicKey, staticKey) {
  root[dynamicKey] = {}
  root[staticKey] = {}

  for (const prop of _.keys(root[key])) {
    const value = root[key][prop]
    if (value.strTmpl) {
      root[dynamicKey][prop] = _.template(value.strTmpl)
    } else if (value.intTmpl) {
        const tmpl = _.template(value.intTmpl)
        root[dynamicKey][prop] = function(ctx) {
          const strValue = tmpl(ctx)
          return parseInt(strValue)
        }
      } else if (value.floatTmpl) {
        const tmpl = _.template(value.floatTmpl)
        root[dynamicKey][prop] = function(ctx) {
          const strValue = tmpl(ctx)
          return parseFloat(strValue)
        }
      } else {
        root[staticKey][prop] = value
      }
    }
}

export function compileDataSourceSelector (definition) {
  // split source options into dynamicOptions (lodash templates)
  // and staticOptions
  for (const source of definition.sources) {
    splitDynamic(source, 'config', 'dynamicConfig', 'staticConfig')
  }

  // do the same with context props
  splitDynamic(definition, 'context', 'dynamicContext', 'staticContext')
}

export function getSourcesForTime (definition, { meteoModel = undefined, time = undefined } = {}, appContext) {
  const now = moment()

  // filter candidates based on meteoModel & time
  const candidates = definition.sources.filter((source) => {
    if (meteoModel && source.meteoModel && source.meteoModel !== meteoModel.name) return false
    if (source.meteoModel && meteoModel === undefined) return false
    if (time) {
      const from = source.from ? makeTime(readAsTimeOrDuration(source.from), now) : null
      const to = source.to ? makeTime(readAsTimeOrDuration(source.to), now) : null
      if (from && to) return time.isBetween(from, to)
      if (from) return time.isSameOrAfter(from)
      if (to) return time.isSameOrBefore(to)
    }

    return true
  })

  // derive context
  const derivedContext = Object.assign({ meteoModel, time }, definition.staticContext, appContext)
  // when a meteoModel is provided, compute a few handy variables
  if (meteoModel) {
    derivedContext.runTime = getNearestRunTime(time, meteoModel.runInterval)
    derivedContext.forecastTime = getNearestForecastTime(time, meteoModel.interval)
    derivedContext.forecastOffset = moment.duration(derivedContext.forecastTime.diff(derivedContext.runTime))
  }
  // compute dynamic properties of data source definition
  for (const prop of _.keys(definition.dynamicContext)) {
    const value = definition.dynamicContext[prop](derivedContext)
    derivedContext[prop] = value
  }

  // and finally derive candidates config
  const sources = []
  for (const source of candidates) {
    // if source defines an 'every' prop, compute the stepTime
    if (source.every)
      derivedContext.stepTime = moment(Math.trunc(time / source.every) * source.every)
    else
      delete derivedContext.stepTime

    const derivedConfig = Object.assign({}, source.staticConfig)
    for (const prop of _.keys(source.dynamicConfig)) {
      const value = source.dynamicConfig[prop](derivedContext)
      derivedConfig[prop] = value
    }

    sources.push({ type: source.type, context: derivedContext, config: derivedConfig })
  }

  return sources
}

export function getSourcesForTimeRange (definition, { meteoModel = undefined, t0 = undefined, t1 = undefined } = {}, appContext) {
  const now = moment()

  // filter candidates based on meteoModel & time range
  const timeRanges = []
  const candidates = definition.sources.filter((source) => {
    if (meteoModel && source.meteoModel && source.meteoModel !== meteoModel.name) return false
    if (source.meteoModel && meteoModel === undefined) return false
    const from = source.from ? makeTime(readAsTimeOrDuration(source.from), now) : null
    const to = source.to ? makeTime(readAsTimeOrDuration(source.to), now) : null
    const every = source.every ? moment.duration(source.every) : meteoModel ? meteoModel.interval : null
    if (from && to) {
      const begin = moment.max(from, t0)
      const end = moment.min(to, t1)
      if (end.isBefore(begin)) return false
      timeRanges.push({ begin, end, every })
      return true
    }
    if (from) {
      const begin = moment.max(from, t0)
      const end = t1
      if (end.isBefore(begin)) return false
      timeRanges.push({ begin, end, every })
      return true
    }
    if (to) {
      const begin = t0
      const end = moment.min(to, t1)
      if (end.isBefore(begin)) return false
      timeRanges.push({ begin, end, every })
      return true
    }

    return false
  })

  // foreach candidate, derive context for valid times
  const sources = []
  for (let i = 0; i < candidates.length; ++i) {
    const source = candidates[i]
    for (let t = timeRanges[i].begin; t < timeRanges[i].end; t += timeRanges[i].every) {
      const time = moment(t)

      // derive context
      const derivedContext = Object.assign({ meteoModel, time }, definition.staticContext, appContext)
      // when a meteoModel is provided, compute a few handy variables
      if (meteoModel) {
        derivedContext.runTime = getNearestRunTime(time, meteoModel.runInterval)
        derivedContext.forecastTime = getNearestForecastTime(time, meteoModel.interval)
        derivedContext.forecastOffset = moment.duration(derivedContext.forecastTime.diff(derivedContext.runTime))
      }
      // compute dynamic properties of data source definition
      for (const prop of _.keys(definition.dynamicContext)) {
        const value = definition.dynamicContext[prop](derivedContext)
        derivedContext[prop] = value
      }

      // and finally derive candidate config
      const derivedConfig = Object.assign({}, source.staticConfig)
      for (const prop of _.keys(source.dynamicConfig)) {
        const value = source.dynamicConfig[prop](derivedContext)
        derivedConfig[prop] = value
      }

      sources.push({ time: time, type: source.type, context: derivedContext, config: derivedConfig })
    }
  }

  return sources.sort((a, b) => { return a.time < b.time })
}
