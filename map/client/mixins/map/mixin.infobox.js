import _ from 'lodash'

export default {
  methods: {
    getDefaultInfoBox (feature, layer, options) {
      let properties = feature.properties
      if (properties) {
        const leafletOptions = options.leaflet || options
        const infoboxStyle = Object.assign({}, this.options.infobox,
          leafletOptions.infobox, properties.infobox)
        
        if (infoboxStyle.pick) {
          properties = _.pick(properties, infoboxStyle.pick)
        } else if (infoboxStyle.omit) {
          properties = _.omit(properties, infoboxStyle.omit)
        } else if (infoboxStyle.template) {
          const compiler = infoboxStyle.compiler
          html = compiler({ properties, feature })
        }
      }
      return properties
    }
  },
  created () {
    this.registerLeafletStyle('infobox', this.getDefaultInfoBox)
  }
}
