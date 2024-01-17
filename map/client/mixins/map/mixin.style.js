import _ from 'lodash'
import chroma from 'chroma-js'
import moment from 'moment'
import { Time, Units } from '../../../../core/client/index.js'
import { createLeafletMarkerFromStyle, convertToLeafletFromSimpleStyleSpec, LeafletStyleMappings } from '../../utils.map.js'

export const style = {
  methods: {
    // Alias to ease development
    createMarkerFromStyle (latlng, markerStyle, feature) {
      return createLeafletMarkerFromStyle(latlng, markerStyle, feature)
    },
    // Alias to ease development
    convertFromSimpleStyleSpec (style, inPlace) {
      return convertToLeafletFromSimpleStyleSpec(style, inPlace)
    },
    getDefaultMarker (feature, latlng, options) {
      const properties = feature.properties
      const leafletOptions = options.leaflet || options
      const style = Object.assign({},
        _.get(this, 'activityOptions.engine.pointStyle'),
        leafletOptions.layerStyle,
        this.convertFromSimpleStyleSpec(feature.style || feature.properties))
      // We allow to template style properties according to feature,
      // because it can be slow you have to specify a subset of properties
      if (leafletOptions.template) {
        leafletOptions.template.forEach(entry => {
          // Perform templating, set using simple spec mapping first then raw if property not found
          _.set(style, _.get(LeafletStyleMappings, entry.property, entry.property), entry.compiler({ properties, feature, chroma, moment, Units, Time }))
        })
      }
      // We manage panes for z-index, so we need to forward it to marker options (only if not already defined)
      if (leafletOptions.pane && !style.pane) style.pane = leafletOptions.pane
      if (leafletOptions.shadowPane && !style.shadowPane) style.shadowPane = leafletOptions.shadowPane
      return (latlng ? this.createMarkerFromStyle(latlng, style) : style)
    },
    getDefaultStyle (feature, options) {
      const properties = feature.properties
      const leafletOptions = options.leaflet || options
      const style = Object.assign({},
        _.get(this, 'activityOptions.engine.featureStyle'),
        leafletOptions.layerStyle,
        this.convertFromSimpleStyleSpec(feature.style || feature.properties))

      // We allow to template style properties according to feature,
      // because it can be slow you have to specify a subset of properties
      if (leafletOptions.template) {
        leafletOptions.template.forEach(entry => {
          // Perform templating, set using simple spec mapping first then raw if property not found
          _.set(style, _.get(LeafletStyleMappings, entry.property, entry.property), entry.compiler({ properties, feature, chroma, moment, Units, Time }))
        })
      }
      // We manage panes for z-index, so we need to forward it to marker options (only if not already defined)
      if (leafletOptions.pane && !style.pane) style.pane = leafletOptions.pane
      if (leafletOptions.shadowPane && !style.shadowPane) style.shadowPane = leafletOptions.shadowPane
      return style
    }
  },
  created () {
    this.registerStyle('markerStyle', this.getDefaultMarker)
    this.registerStyle('featureStyle', this.getDefaultStyle)
  },
  // Need to be done after created as the activity mixin initializes options in it
  beforeMount () {
    // Perform required conversion for default feature styling
    if (_.has(this, 'activityOptions.engine.featureStyle')) {
      this.convertFromSimpleStyleSpec(_.get(this, 'activityOptions.engine.featureStyle'), 'update-in-place')
    }
    if (_.has(this, 'activityOptions.engine.pointStyle')) {
      this.convertFromSimpleStyleSpec(_.get(this, 'activityOptions.engine.pointStyle'), 'update-in-place')
    }
  }
}
