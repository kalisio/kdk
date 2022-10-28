import moment from 'moment'
import { getNearestRunTime, getNearestForecastTime } from '@weacast/core/common.js'
import * as mu from './moment-utils.js'

export function getSourceByTime (sources, time, meteoModelName) {
  const now = moment()
  for (const source of sources) {
    if (source.meteoModel && meteoModelName && source.meteoModel !== meteoModelName) continue
    const from = source.from ? mu.makeTime(mu.readAsTimeOrDuration(source.from), now) : now
    const to = source.to ? mu.makeTime(mu.readAsTimeOrDuration(source.to), now) : now
    if (time.isBetween(from, to)) return source
  }
  return null
}

export function getSourcesByTimeRange (sources, t0, t1, meteoModelName) {
  const now = moment()
  const matchs = []
  for (const source of sources) {
    if (source.meteoModel && meteoModelName && source.meteoModel !== meteoModelName) continue
    const from = source.from ? mu.makeTime(mu.readAsTimeOrDuration(source.from), now) : null
    const to = source.to ? mu.makeTime(mu.readAsTimeOrDuration(source.to), now) : null
    const begin = from ? moment.max(from, t0) : t0
    const end = to ? moment.min(to, t1) : t1
    if (begin.isBefore(end)) matchs.push({ begin, end, source })
  }
  return matchs
}

export function defaultContext (context, layer, source, meteoModel) {
  const ctx = {}
  ctx.variable = layer.variables[0].name
  if (source.every) {
    const every = moment.duration(source.every)
    ctx.floorTime = mu.floorTo(context.time, every)
  }
  if (meteoModel) {
    ctx.meteoModel = meteoModel.name
    ctx.runTime = getNearestRunTime(context.time, meteoModel.runInterval)
    ctx.forecastTime = getNearestForecastTime(context.time, meteoModel.interval)
    ctx.forecastOffset = moment.duration(ctx.forecastTime.diff(ctx.runTime))
  }
  return ctx
}
