import _ from 'lodash'

export default {
  methods: {
    getDefaultInfoBox (entity, options) {
      let properties
      if (entity.properties) {
        let properties = entity.properties.getValue(0)
        const cesiumOptions = options.cesium || options
        const infoboxStyle = _.merge({}, this.options.infobox,
          cesiumOptions.infobox, properties.infobox)
        
        if (infoboxStyle.pick) {
          properties = _.pick(properties, infoboxStyle.pick)
        } else if (infoboxStyle.omit) {
          properties = _.omit(properties, infoboxStyle.omit)
        } else if (infoboxStyle.template) {
          const compiler = infoboxStyle.compiler
          // FIXME: the whole feature is lost by Cesium so that top-level properties have disappeared
          text = compiler({ feature: { properties }, properties })
        }
      }
      return properties
    }
  },
  created () {
    this.registerCesiumStyle('infobox', this.getDefaultInfoBox)
  }
}
