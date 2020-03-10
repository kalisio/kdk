import _ from 'lodash'
import moment from 'moment'
import { GridSource } from './grid'

export class DynamicGridSource extends GridSource {
  constructor (options) {
    super(options)

    this.source = null
    this.queuedId = null
    this.queuedCtx = {}
  }

  getBBox () {
    return this.source ? this.source.getBBox() : null
  }

  getDataBounds () {
    return this.source ? this.source.getDataBounds() : null
  }

  supportsNoData () {
    return this.source ? this.source.supportsNoData() : false
  }

  async fetch (abort, bbox, resolution) {
    return this.source ? this.source.fetch(abort, bbox, resolution) : null
  }

  queueUpdate () {
    if (this.queuedId) return

    this.queuedId = setTimeout(() => {
      this.update(this.queuedCtx)
      this.queuedId = null
    }, 50)
  }

  update (ctx) {
    if (this.source) this.source.off('data-changed', this.onDataChanged)
    const [source, config] = this.selectSourceAndDeriveConfig(ctx)
    this.source = source
    if (this.source) {
      this.onDataChanged = this.dataChanged.bind(this)
      this.source.on('data-changed', this.onDataChanged)
      this.source.setup(config)
    } else {
      // emit 'data-changed' ourselves since no underlying source will
      this.dataChanged()
    }
  }

  selectSourceAndDeriveConfig (ctx) {
    throw new Error('Not implemented')
  }

  readAsTimeOrDuration (conf) {
    let ret = null
    if (typeof conf === 'string') {
      if (conf.charAt(0) === 'P') {
        // treat as a duration
        ret = moment.duration(conf)
      } else {
        // treat as time
        ret = moment(conf)
      }

      ret = ret.isValid() ? ret : null
    }

    return ret
  }

  makeTime (timeOrDuration, referenceTime) {
    return moment.isDuration(timeOrDuration) ? referenceTime.clone().add(timeOrDuration) : timeOrDuration
  }

  deriveConfig (ctx, staticProps, dynamicProps) {
    // copy static properties
    const config = Object.assign({}, staticProps)
    // compute dynamic ones
    for (const prop of _.keys(dynamicProps)) {
      const value = dynamicProps[prop](ctx)
      if (value) config[prop] = value
    }

    return config
  }
}
