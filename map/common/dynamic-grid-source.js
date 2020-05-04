import _ from 'lodash'
import { GridSource } from './grid'

export class DynamicGridSource extends GridSource {
  constructor (options) {
    super(options)

    this.source = null
    this.updateId = null
    this.updateCtx = {}
    this.buildCtx = {}
    this.onDataChanged = this.dataChanged.bind(this)
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

  invalidate () {
    // next update can't be skipped
    this.forceUpdate = true
  }

  queueUpdate () {
    // update already queued, skip
    if (this.updateId) return

    // call update in a few secs, let time for other context updates to happen
    this.updateId = setTimeout(() => {
      this.update(this.updateCtx)
      this.updateId = null
    }, 50)
  }

  update (updateCtx) {
    // compute potential new context based on update context
    const newCtx = this.makeBuildContext(updateCtx)
    // give source a chance to skip update if nothing changes
    const skipUpdate = this.forceUpdate ? false : this.shouldSkipUpdate(newCtx, this.buildCtx)
    this.forceUpdate = false
    if (skipUpdate) return

    // computed context is now the current one
    this.buildCtx = newCtx
    // use it to select grid source and derive config for it
    const [source, config] = this.buildSourceAndConfig(newCtx)
    if (this.source) this.source.off('data-changed', this.onDataChanged)
    this.source = source
    if (this.source) {
      this.source.on('data-changed', this.onDataChanged)
      this.source.setup(config)
      this.sourceKey = this.source.sourceKey
    } else {
      this.dataChanged()
    }
  }

  makeBuildContext (updateCtx) {
    return Object.assign({}, updateCtx)
  }

  shouldSkipUpdate (newContext, oldContext) {
    return false
  }

  buildSourceAndConfig (ctx) {
    throw new Error('Not implemented')
  }

  deriveConfig (ctx, staticProps, dynamicProps) {
    // copy static properties
    const config = Object.assign({}, staticProps)
    // compute dynamic ones
    for (const prop of _.keys(dynamicProps)) {
      const value = dynamicProps[prop](ctx)
      if (value !== null && value !== undefined) {
        // prop.sub1.sub2 will set config.prop.sub1.sub2
        let root = config
        const sub = prop.split('$')
        for (let i = 0; i < sub.length - 1; ++i) {
          if (root[sub[i]] === undefined) root[sub[i]] = {}
          root = root[sub[i]]
        }
        root[sub[sub.length - 1]] = value
      }
    }

    return config
  }

  dynpropGenerator (conf) {
    if (conf.strTemplate) {
      // use lodash string template
      return _.template(conf.strTemplate)
    }
    if (conf.intTemplate) {
      // use loadsh but parseInt the output
      const strGen = _.template(conf.intTemplate)
      return function (ctx) {
        const strValue = strGen(ctx)
        return parseInt(strValue)
      }
    }
    if (conf.floatTemplate) {
      // use loadsh but parseFloat the output
      const strGen = _.template(conf.floatTemplate)
      return function (ctx) {
        const strValue = strGen(ctx)
        return parseFloat(strValue)
      }
    }

    return null
  }
}
