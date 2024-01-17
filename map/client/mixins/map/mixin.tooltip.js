import _ from 'lodash'
import L from 'leaflet'
import moment from 'moment'
import { Time, Units } from '../../../../core/client/index.js'

export const tooltip = {
  methods: {
    getDefaultTooltip (feature, layer, options, zoom) {
      const properties = feature.properties
      let tooltip
      if (properties) {
        const leafletOptions = options.leaflet || options
        // Check if explicitely disabled first
        if (_.has(leafletOptions, 'tooltip') && !_.get(leafletOptions, 'tooltip')) return
        if (_.has(properties, 'tooltip') && !_.get(properties, 'tooltip')) return
        // Otherwise merge options
        const tooltipStyle = Object.assign({},
          _.get(this, 'activityOptions.engine.tooltip'),
          leafletOptions.tooltip, properties.tooltip)
        // Check if visible
        const minZoom = _.get(leafletOptions, 'tooltip.minZoom')
        const maxZoom = _.get(leafletOptions, 'tooltip.maxZoom')
        if ((maxZoom && zoom > maxZoom) || (minZoom && zoom < minZoom)) return
        // Default content
        let html = tooltipStyle.html
        if (!html) {
          if (tooltipStyle.property) {
            html = (_.has(properties, tooltipStyle.property)
              ? _.get(properties, tooltipStyle.property)
              : _.get(feature, tooltipStyle.property))
            if (html && (typeof html.toString === 'function')) html = html.toString()
          } else if (tooltipStyle.template) {
            const compiler = tooltipStyle.compiler
            html = compiler({ properties, feature, $t: this.$t, Units, Time, moment })
          }
        }
        if (html) {
          tooltip = L.tooltip(tooltipStyle.options || { permanent: false }, layer)
          tooltip.setContent(html)
        }
      }
      return tooltip
    }
  },
  created () {
    this.registerStyle('tooltip', this.getDefaultTooltip)
  }
}
