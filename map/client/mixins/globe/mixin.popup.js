import _ from 'lodash'
import moment from 'moment'
import { Time, Units } from '../../../../core/client/index.js'
import { getTextTable } from '../../utils.globe.js'

export const popup = {
  methods: {
    getDefaultPopup (entity, options) {
      let popup
      if (entity.properties) {
        let properties = entity.properties.getValue(0)
        const cesiumOptions = options.cesium || options
        // Check if explicitely disabled first
        if (_.has(cesiumOptions, 'popup') && !_.get(cesiumOptions, 'popup')) return
        if (_.has(properties, 'popup') && !_.get(properties, 'popup')) return
        // Otherwise merge options
        const popupStyle = _.merge({},
          _.get(this, 'activityOptions.engine.popup'),
          cesiumOptions.popup, properties.popup)
        // Default content
        let text = popupStyle.text
        // Custom list given ?
        if (!text) {
          if (popupStyle.template) {
            const compiler = popupStyle.compiler
            // The whole feature is lost by Cesium so that top-level properties have disappeared
            // but we try to keep track of it eg in GeoJson layers
            text = compiler({ feature: entity.feature || { properties }, properties, $t: this.$t, Units, Time, moment })
          } else if (popupStyle.pick) {
            properties = _.pick(properties, popupStyle.pick)
          } else if (popupStyle.omit) {
            properties = _.omit(properties, popupStyle.omit)
          }
        }
        // Cesium does not support HTML
        // if (!html) html = getHtmlTable(properties)
        if (!text) text = getTextTable(properties)
        if (!text) return null // Nothing to be displayed
        popup = Object.assign({
          text: text,
          show: true
        }, popupStyle.options)
      }
      return popup
    },
    onPopup (options, event) {
      const entity = event.target
      // Close previous if any (but not when clicking on the popup itself)
      if (this.popupEntity) {
        this.viewer.entities.remove(this.popupEntity)
        this.popupEntity = null
      }
      // Do not reopen on same entity clicked
      if (this.clickedEntity === entity) {
        this.clickedEntity = null
      } else {
        this.clickedEntity = entity
      }
      // Only for entities from a layer
      if (!this.clickedEntity || !options) return
      const popup = this.generateStyle('popup', this.clickedEntity, options)
      if (popup) {
        const position = (event.pickedPosition ? event.pickedPosition : this.getPositionForEntity(this.clickedEntity))
        this.popupEntity = this.viewer.entities.add({ position, label: popup })
      }
    }
  },
  created () {
    this.registerStyle('popup', this.getDefaultPopup)
  },
  // Need to be done after created as the activity mixin initializes options in it
  beforeMount () {
    // Perform required conversion from JSON to Cesium objects
    if (_.has(this, 'activityOptions.engine.popup')) {
      _.set(this, 'activityOptions.engine.popup', this.convertToCesiumObjects(_.get(this, 'activityOptions.engine.popup')))
    }
  },
  mounted () {
    this.$engineEvents.on('click', this.onPopup)
  },
  beforeUnmount () {
    this.$engineEvents.off('click', this.onPopup)
  }
}
