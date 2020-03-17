import _ from 'lodash'
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

  deriveConfig (ctx, staticProps, dynamicProps) {
    // copy static properties
    const config = Object.assign({}, staticProps)
    // compute dynamic ones
    for (const prop of _.keys(dynamicProps)) {
      const value = dynamicProps[prop](ctx)
      if (value) {
        // prop.sub1.sub2 will set config.prop.sub1.sub2
        let root = config
        const sub = prop.split('$')
        for (let i = 0; i < sub.length - 1; ++i) {
          if (root[sub[i]] === undefined) root[sub[i]] = {}
          root = root[sub[i]]
        }
        root[sub[sub.length-1]] = value
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
