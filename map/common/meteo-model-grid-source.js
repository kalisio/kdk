import _ from 'lodash'
import moment from 'moment'
import { getNearestRunTime, getNearestForecastTime } from '@weacast/core/common.js'
import { makeGridSource, extractGridSourceConfig } from './grid.js'
import { DynamicGridSource } from './dynamic-grid-source.js'
import { readAsTimeOrDuration, makeTime } from './moment-utils.js'

export class MeteoModelGridSource extends DynamicGridSource {
  static getKey () {
    return 'meteo_model'
  }

  constructor (options) {
    super(options)

    this.options = options
    // these members are not mandatory, but still defined in the context
    this.updateCtx.level = undefined
  }

  setModel (model) {
    this.updateCtx.model = model
    this.queueUpdate()
  }

  setTime (time) {
    this.updateCtx.time = time.clone()
    this.updateCtx.time.utc()
    // reset runOffset to fetch nearest run time
    // when there's no data in the nearest run, we may try to fetch
    // data in the run before the nearest (cf. dataChanged())
    this.updateCtx.runOffset = 0
    this.queueUpdate()
  }

  setLevel (level) {
    if (level !== null) this.updateCtx.level = level
    else if (this.updateCtx.level) delete this.updateCtx.level
    this.queueUpdate()
  }

  async setup (config) {
    this.candidates = []

    for (const source of config.sources) {
      // use default props and override with current source
      const item = Object.assign(Object.assign({}, config.default), source)

      const [key, conf] = extractGridSourceConfig(item)
      const candidate = {
        key,
        staticProps: conf,
        dynamicProps: {},
        from: item.from ? readAsTimeOrDuration(item.from) : null,
        to: item.to ? readAsTimeOrDuration(item.to) : null,
        model: item.model
      }

      // handle dynamic properties
      // dynprops may be 'scoped' per grid source, that's what we check here
      // if not scoped, use the dynprops object
      const dynprops = _.has(item.dynprops, candidate.key) ? item.dynprops[candidate.key] : item.dynprops
      for (const prop of _.keys(dynprops)) {
        const value = dynprops[prop]
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
      // take runOffset into account
      ctx.runTime.subtract(ctx.runOffset * updateCtx.model.runInterval, 'seconds')
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
    if (oldContext.level !== newContext.level) return false
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
        candidate = time.isBetween(from, to) ? source : null
      } else if (from) {
        candidate = time.isSameOrAfter(from) ? source : null
      } else if (to) {
        candidate = time.isSameOrBefore(to) ? source : null
      }

      if (candidate) break
    }

    return candidate
  }

  dataChanged () {
    // check if we need to try to fetch data from a previous run
    // in case the nearest run doesn't exists or fails to provide
    // required data

    if (this.source && !this.source.usable) {
      // if we have a selected source but it's not usable
      if (this.updateCtx.runOffset === 0) {
        // queue updaty with an offseted run
        this.updateCtx.runOffset = 1
        this.queueUpdate()
        return
      }
    }

    super.dataChanged()
  }
}
