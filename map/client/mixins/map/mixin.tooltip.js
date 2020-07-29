import L from 'leaflet'
import _ from 'lodash'

export default {
  methods: {
    getDefaultTooltip (feature, layer, options) {
      const properties = feature.properties
      let tooltip
      if (properties) {
        const leafletOptions = options.leaflet || options
        const tooltipStyle = Object.assign({}, this.options.tooltip,
          leafletOptions.tooltip, properties.tooltip)
        // Default content
        let html = tooltipStyle.html
        if (!html) {
          if (tooltipStyle.property) {
            html = (_.has(properties, tooltipStyle.property)
              ? _.get(properties, tooltipStyle.property) : _.get(feature, tooltipStyle.property))
            if (html && (typeof html.toString === 'function')) html = html.toString()
          } else if (tooltipStyle.template) {
            const compiler = tooltipStyle.compiler
            html = compiler({ properties, feature })
          }
        }
        if (html) {
          tooltip = L.tooltip(tooltipStyle.options || { permanent: false }, layer)
          tooltip.setContent(html)
        }
      }
      return tooltip
    },
    getVigicruesTooltip (feature, layer) {
      const name = _.get(feature, 'properties.NomEntVigiCru')
      const level = _.get(feature, 'properties.NivSituVigiCruEnt')
      if (name && !_.isNil(level)) {
        let tooltip = L.tooltip({ permanent: false, sticky: true }, layer)
        return tooltip.setContent(name + '<br>'  + this.$t('Layers.VIGICRUES_VIGILANCE_' + level))
      } else {
        return null
      }
    }
  },
  created () {
    this.registerStyle('tooltip', this.getDefaultTooltip)
  }
}
