import _ from 'lodash'

export const infobox = {
  methods: {
    getDefaultInfoBox (feature, options) {
      let properties = feature.properties
      if (properties) {
        const engineOptions = _.get(options, this.engine, options)
        // Check if explicitely disabled first
        if (_.has(engineOptions, 'infobox') && !_.get(engineOptions, 'infobox')) return []
        if (_.has(properties, 'infobox') && !_.get(properties, 'infobox')) return []
        // Otherwise merge options
        const infoboxStyle = Object.assign({},
          _.get(this, 'activityOptions.engine.infobox'),
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
