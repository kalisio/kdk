import _ from 'lodash'
import moment from 'moment'
import { makeGridSource, extractGridSourceConfig } from './grid'
import { DynamicGridSource } from './dynamic-grid-source'
import { readAsTimeOrDuration, makeTime } from './moment-utils'

export class TimeBasedGridSource extends DynamicGridSource {
  static getKey () {
    return 'time_based'
  }

  constructor (options) {
    super(options)

    this.options = options
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
        every: moment.duration(item.every)
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

    ctx.candidate = this.selectCandidate(ctx.time)
    if (ctx.candidate) {
      ctx.stepTime = moment(Math.trunc(ctx.time / ctx.candidate.every) * ctx.candidate.every)

      // switch to utc mode, all display methods will display in UTC
      ctx.time.utc()
      ctx.stepTime.utc()
    }

    return ctx
  }

  shouldSkipUpdate (newContext, oldContext) {
    if (oldContext.candidate !== newContext.candidate) return false
    if (oldContext.stepTime && newContext.stepTime && !oldContext.stepTime.isSame(newContext.stepTime)) return false
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

  selectCandidate (time) {
    const now = moment()

    let candidate = null
    // select a source for the requested time
    for (const source of this.candidates) {
      const from = source.from ? makeTime(source.from, now) : null
      const to = source.to ? makeTime(source.to, now) : null
      if (from && to) {
        candidate = time.isBetween(from, to, 'second', '[]') ? source : null
      } else if (from) {
        candidate = time.isSameOrAfter(from, 'second') ? source : null
      } else if (to) {
        candidate = time.isSameOrBefore(to, 'second') ? source : null
      }

      if (candidate) break
    }

    return candidate
  }
}
