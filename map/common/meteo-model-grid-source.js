import _ from 'lodash'
import moment from 'moment'
import { getNearestRunTime, getNearestForecastTime } from 'weacast-core/common'
import { makeGridSource, extractGridSourceConfig } from './grid'
import { DynamicGridSource } from './dynamic-grid-source'
import { readAsTimeOrDuration, makeTime } from './moment-utils'

export class MeteoModelGridSource extends DynamicGridSource {
  static getKey () {
    return 'meteo_model'
  }

  constructor (options) {
    super(options)

    this.options = options
  }

  setModel (model) {
    this.updateCtx.model = model
    this.queueUpdate()
  }

  setTime (time) {
    this.updateCtx.time = time.clone()
    this.queueUpdate()
  }

  async setup (config) {
    this.candidates = []

    for (const item of config) {
      const [key, conf] = extractGridSourceConfig(item)
      const candidate = {
        key: key,
        staticProps: conf,
        dynamicProps: {},
        from: item.from ? readAsTimeOrDuration(item.from) : null,
        to: item.to ? readAsTimeOrDuration(item.to) : null,
        model: item.model
      }

      // handle dynamic properties
      for (const prop of _.keys(item.dynprops)) {
        const value = item.dynprops[prop]
        const generator = this.dynpropGenerator(value)
        if (generator) candidate.dynamicProps[prop] = generator
      }

      this.candidates.push(candidate)
    }
  }

  makeBuildContext (updateCtx) {
    const ctx = Object.assign({}, updateCtx)

    ctx.candidate = this.selectCandidate(updateCtx.time, updateCtx.model.name)
    if (ctx.candidate) {
      // update context
      ctx.runTime = getNearestRunTime(updateCtx.time, updateCtx.model.runInterval)
      ctx.forecastTime = getNearestForecastTime(updateCtx.time, updateCtx.model.interval)
      ctx.forecastOffset = moment.duration(ctx.forecastTime.diff(ctx.runTime))

      // switch to utc mode, all display methods will display in UTC
      ctx.time.utc()
      ctx.runTime.utc()
      ctx.forecastTime.utc()
    }

    return ctx
  }

  shouldSkipUpdate (newContext, oldContext) {
    if (oldContext.candidate !== newContext.candidate) return false
    if (oldContext.runTime && newContext.runTime && !oldContext.runTime.isSame(newContext.runTime)) return false
    if (oldContext.forecastTime && newContext.forecastTime && !oldContext.forecastTime.isSame(newContext.forecastTime)) return false
    return true
  }

  buildSourceAndConfig (ctx) {
    let source = null
    let config = null

    if (ctx.candidate) {
      config = this.deriveConfig(ctx, ctx.candidate.staticProps, ctx.candidate.dynamicProps)
      if (config) {
        source = makeGridSource(ctx.candidate.key, this.options)
      }
    }

    return [source, config]
  }

  selectCandidate (time, model) {
    const now = moment()

    let candidate = null
    // select a source for the requested time
    for (const source of this.candidates) {
      if (source.model !== model) continue

      const from = source.from ? makeTime(source.from, now) : null
      const to = source.to ? makeTime(source.to, now) : null
      if (from && to) {
        candidate = time.isBetween(from, to, '[]') ? source : null
      } else if (from) {
        candidate = time.isSameOrAfter(from) ? source : null
      } else if (to) {
        candidate = time.isSameOrBefore(to) ? source : null
      }

      if (candidate) break
    }

    return candidate
  }
}
