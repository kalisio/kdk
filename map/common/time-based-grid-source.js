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
    this.queuedCtx.time = time.clone()
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
        from: readAsTimeOrDuration(item.from),
        to: readAsTimeOrDuration(item.to),
        every: moment.duration(item.every)
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

    let candidate = null
    // select a source for the requested time
    for (const source of this.sources) {
      const from = source.from ? makeTime(source.from, now) : null
      const to = source.to ? makeTime(source.to, now) : null
      if (from && to) {
        candidate = ctx.time.isBetween(from, to) ? source : null
      } else if (from) {
        candidate = ctx.time.isAfter(from) ? source : null
      } else if (to) {
        candidate = ctx.time.isBefore(to) ? source : null
      }

      if (candidate) break
    }

    let config = null
    if (candidate) {
      // update context
      ctx.stepTime = moment(Math.trunc(ctx.time / candidate.every) * candidate.every)

      // switch to utc mode, all display methods will display in UTC
      ctx.time.utc()
      ctx.stepTime.utc()

      // derive config for candidate
      config = this.deriveConfig(ctx, candidate.staticProps, candidate.dynamicProps)
    }

    const source = (candidate && config) ? makeGridSource(candidate.key, this.options) : null

    return [source, config]
  }
}
