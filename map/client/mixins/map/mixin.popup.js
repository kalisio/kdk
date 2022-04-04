import L from 'leaflet'
import _ from 'lodash'
import { Time, Units } from '../../../../core/client'
import { getHtmlTable } from '../../utils'

export default {
  methods: {
    getDefaultPopup (feature, layer, options) {
      let properties = feature.properties
      let popup
      if (properties) {
        const leafletOptions = options.leaflet || options
        // Check if explicitely disabled first
        if (_.has(leafletOptions, 'popup') && !_.get(leafletOptions, 'popup')) return
        if (_.has(properties, 'popup') && !_.get(properties, 'popup')) return
        // Otherwise merge options
        const popupStyle = Object.assign({}, _.get(this, 'activityOptions.engine.popup'),
          leafletOptions.popup, properties.popup)
        // Default content
        let html = popupStyle.html
        // Custom list given ?
        if (!html) {
          if (popupStyle.template) {
            const compiler = popupStyle.compiler
            html = compiler({ properties, feature, $t: this.$t, Units, Time })
          } else if (popupStyle.pick) {
            properties = _.pick(properties, popupStyle.pick)
          } else if (popupStyle.omit) {
            properties = _.omit(properties, popupStyle.omit)
          }
        }
        // Default HTML table if no template
        if (!html) html = getHtmlTable(properties)
        if (!html) return null // Nothing to be displayed
        // Configured or default style
        if (popupStyle.options) {
          popup = L.popup(popupStyle.options, layer)
        } else {
          popup = L.popup({
            maxHeight: 400,
            maxWidth: 400,
            autoPan: false
          }, layer)
        }
        popup.setContent(html)
      }
      return popup
    }
  },
  created () {
    this.registerStyle('popup', this.getDefaultPopup)
  }
}
