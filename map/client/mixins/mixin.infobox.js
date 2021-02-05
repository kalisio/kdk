import _ from 'lodash'

export default {
  methods: {
    getDefaultInfoBox (feature, options) {
      let properties = feature.properties
      if (properties) {
        const engineOptions = _.get(options, this.engine, options)
        const infoboxStyle = Object.assign({}, this.activityOptions.engine.infobox,
          engineOptions.infobox, properties.infobox)

        if (infoboxStyle.pick) {
          properties = _.pick(properties, infoboxStyle.pick)
        } else if (infoboxStyle.omit) {
          properties = _.omit(properties, infoboxStyle.omit)
        }
      }
      return properties
    }
  },
  created () {
    this.registerStyle('infobox', this.getDefaultInfoBox)
  }
}
