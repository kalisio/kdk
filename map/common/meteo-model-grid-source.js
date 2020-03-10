import _ from 'lodash'
import moment from 'moment'
import { getNearestRunTime, getNearestForecastTime } from 'weacast-core/common'
import { makeGridSource, extractGridSourceConfig } from './grid'
import { DynamicGridSource } from './dynamic-grid-source'

export class MeteoModelGridSource extends DynamicGridSource {
  static getKey () {
    return 'meteo_model'
  }

  constructor (options) {
    super(options)

    this.options = options
  }

  setModel (model) {
    this.queuedCtx.model = model
    this.queueUpdate()
  }

  setTime (time) {
    this.queuedCtx.time = time
    this.queueUpdate()
  }

  async setup (config) {
    this.sources = []

    for (const item of config) {
      const [key, conf] = extractGridSourceConfig(item)
      const source = {
        key: key,
        staticProps: conf,
        dynamicProps: {},
        from: this.readAsTimeOrDuration(item.from),
        to: this.readAsTimeOrDuration(item.to),
        model: item.model
      }

      // handle dynamic properties
      for (const prop of _.keys(item.dynprops)) {
        const value = item.dynprops[prop]
        // that's a lodash string template, compile it
        if (value.template) source.dynamicProps[prop] = _.template(value.template)
      }

      this.sources.push(source)
    }
  }

  selectSourceAndDeriveConfig (ctx) {
    const now = moment()

    // update context
    ctx.runTime = getNearestRunTime(ctx.time, ctx.model.runInterval)
    ctx.forecastTime = getNearestForecastTime(ctx.time, ctx.model.interval)

    let candidate = null
    // select a source for the requested time
    for (const source of this.sources) {
      if (source.model !== ctx.model.name) continue

      const from = source.from ? this.makeTime(source.from, now) : null
      const to = source.to ? this.makeTime(source.to, now) : null
      if (from && to) {
        candidate = ctx.time.isBetween(from, to) ? source : null
      } else if (from) {
        candidate = ctx.time.isAfter(from) ? source : null
      } else if (to) {
        candidate = ctx.time.isBefore(to) ? source : null
      }

      if (candidate) break
    }

    // derive config for candidate
    const config = candidate ? this.deriveConfig(ctx, candidate.staticProps, candidate.dynamicProps) : null
    const source = (candidate && config) ? makeGridSource(candidate.key, this.options) : null

    return [source, config]
  }
}
