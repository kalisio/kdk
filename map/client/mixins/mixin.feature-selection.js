import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import centroid from '@turf/centroid'
import _ from 'lodash'
import { colors } from 'quasar'
import { SelectionLayerName } from '../utils'

export default {
  data () {
    return {
      selection: this.$store.get('selection')
    }
  },
  computed: {
    hasFeatureSelection () {
      return this.selection.feature
    }
  },
  methods: {
    getWidgetForLayer () {
      let widget
      if (this.selection.layer) {
        widget = _.get(this.selection.layer, 'widget')
        if (widget) {
          if (typeof widget !== 'string') {
            // expect an object with at least a 'type' property
            widget = _.get(widget, 'type', 'information-box')
          }
        } else {
          // fallback to old widget selection logic
          if (_.has(this.selection.layer, 'probe') || // Static probe on pre-defined sites
              _.has(this.selection.layer, 'variables')) { // Measurement history
            widget = 'time-series'
          } else if (_.get(this.selection.layer, 'leaflet.type') === 'mapillary') {
            widget = 'mapillary-viewer'
          } else {
            widget = 'information-box'
          }
        }
      } else {
        if (this.isCursor('probe-cursor')) {
          widget = 'time-series'
        }
      }
      return widget
    },
    clearSelection () {
      this.selection.feature = null
      this.selection.layer = null
      this.closeWidget()
    },
    setSelection (location, feature, layer) {
      this.selection.location = location
      // If clicked on the same object unselect otherwise select
      if (feature && (feature === this.selection.feature)) {
        this.clearSelection()
      } else {
        this.selection.feature = feature
        this.selection.layer = layer
        this.$store.set('selection.states', {})
        // Open associated default widget if none already open,
        // if the user has open another widget it will remain active
        const widget = this.getWidgetForLayer()
        if (widget && !this.hasOpenWidget()) this.openWidget(widget)
      }
    },
    centerOnSelection () {
      if (this.hasFeatureSelection) {
        this.center(..._.get(centroid(this.selection.feature), 'geometry.coordinates'))
      } else if (this.selection.location) {
        this.center(this.selection.location.lng, this.selection.location.lat)
      }
    },
    hasSelectionHighlight (id) {
      return _.has(this.selectionHighlight, id)
    },
    addSelectionHighlight (id, feature = {}) {
      // Remove previous selection if any
      this.removeSelectionHighlight(id)
      // Start from selected feature or location to build highlight
      const highlight = (this.selection.feature ? _.cloneDeep(this.selection.feature) : {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            _.get(this.selection, 'location.lng', 0),
            _.get(this.selection, 'location.lat', 0)] }
      })
      // Use bbox for line/polygons
      if (highlight.geometry.type !== 'Point') {
        Object.assign(highlight, bboxPolygon(bbox(this.selection.feature)))
      }
      // Add an identifier if we'd like to update it
      highlight._id = highlight.id = id
      // Add default styling and additional information provided if any
      _.merge(highlight, {
        properties: {
          'marker-type': 'circleMarker',
          geodesic: !this.is2D(), // In 3D we use a circle on ground
          radius: this.is2D() ? 18 : 1000,
          'stroke-color': colors.getBrand('secondary'),
          'stroke-width': 3,
          'fill-color': colors.getBrand('secondary'),
          'fill-opacity': 0.5
        }
      }, feature)
      _.set(this.selectionHighlight, id, highlight)
      this.updateSelectionLayer()
      return highlight
    },
    updateSelectionHighlight (id, feature) {
      if (_.has(this.selectionHighlight, id)) {
        _.merge(_.get(this.selectionHighlight, id), feature)
        this.updateSelectionLayer()
      }
    },
    removeSelectionHighlight (id) {
      if (_.has(this.selectionHighlight, id)) {
        _.unset(this.selectionHighlight, id)
        this.updateSelectionLayer()
      }
    },
    async createSelectionLayer () {
      // Get any previous layer or create it the first time
      const layer = this.getLayerByName(SelectionLayerName)
      if (!layer) {
        await this.addLayer({
          name: SelectionLayerName,
          type: 'OverlayLayer',
          scope: 'system',
          isSelectable: false,
          leaflet: {
            type: 'geoJson',
            isVisible: true,
            realtime: true,
            interactive: false,
            popup: { pick: [] }
          },
          cesium: {
            type: 'geoJson',
            isVisible: true,
            realtime: true,
            popup: { pick: [] }
          }
        })
      }
      if (!this.isLayerVisible(SelectionLayerName)) await this.showLayer(SelectionLayerName)
    },
    updateSelectionLayer () {
      this.updateLayer(SelectionLayerName, { type: 'FeatureCollection', features: Object.values(this.selectionHighlight) })
    },
    removeSelectionLayer () {
      this.removeLayer(SelectionLayerName)
    },
    onFeatureSelectionClicked (layer, event) {
      // Retrieve the location/feature
      const location = _.get(event, 'latlng')
      let feature
      // Check the target layer
      if (layer && layer.name) {
        // FIXME: need to retrieve original layer options as here we get processed options by the underlying engine
        layer = this.getLayerByName(layer.name)
        // Check if selectable
        if (layer && this.isLayerSelectable(layer)) {
          // Retrieve the feature and manage 2D/3D entity
          feature = _.get(event, 'target.feature')
        } else {
          // Avoid updating selection on click if not selectable
          return
        }
      } else {
        // Avoid updating selection on click if not probe
        if ((!this.isCursor('probe-cursor')) && (!this.isCursor('position-cursor'))) return
        // Otherwise this is a position selection only
        layer = undefined
      }
      // Update the selection
      this.setSelection(location, feature, layer)
    },
    onFeatureSelectionLayerShown (layer) {
      // If at least one layer is visible we have to create selection layer
      if (this.isLayerSelectable(layer)) this.createSelectionLayer()
    },
    onFeatureSelectionLayerHidden (layer) {
      if (this.hasFeatureSelection) {
        if (layer.name === this.selection.layer.name) this.clearSelection()
      }
    },
    onFeatureSelectionLayerDisabled (layer) {
      if (this.hasFeatureSelection) {
        if (layer.name === this.selection.layer.name) {
          // Backup highlights
          this.disabledSelectionHighlight = this.selectionHighlight
          // Clear it
          this.selectionHighlight = {}
          this.updateSelectionLayer()
        }
      }
    },
    onFeatureSelectionLayerEnabled (layer) {
      if (this.hasFeatureSelection) {
        if (layer.name === this.selection.layer.name) {
          // Restore highlights
          this.selectionHighlight = this.disabledSelectionHighlight
          this.updateSelectionLayer()
        }
      }
    }
  },
  created () {
    // Set of highligthed features
    this.selectionHighlight = {}
    this.$on('click', this.onFeatureSelectionClicked)
    this.$on('layer-shown', this.onFeatureSelectionLayerShown)
    this.$on('layer-hidden', this.onFeatureSelectionLayerHidden)
    this.$on('layer-disabled', this.onFeatureSelectionLayerDisabled)
    this.$on('layer-enabled', this.onFeatureSelectionLayerEnabled)
  },
  beforeDestroy () {
    this.$off('click', this.onFeatureSelectionClicked)
    this.$off('layer-shown', this.onFeatureSelectionLayerShown)
    this.$off('layer-hidden', this.onFeatureSelectionLayerHidden)
    this.$off('layer-disabled', this.onFeatureSelectionLayerDisabled)
    this.$off('layer-enabled', this.onFeatureSelectionLayerEnabled)
    this.removeSelectionLayer()
  }
}
