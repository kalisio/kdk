import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import centroid from '@turf/centroid'
import _ from 'lodash'
import L from 'leaflet'
import { uid, colors } from 'quasar'

const TOOLS_LAYER = uid()

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
      // FIXME: should not be hard-coded
      let widget = 'information-box'
      if (!this.selection.layer || // Dynamic probe at location
          _.has(this.selection.layer, 'probe') || // Static probe on pre-defined sites
          _.has(this.selection.layer, 'variables')) { // Measurement history
        widget = 'time-series'
      } else if (_.get(this.selection.layer, 'leaflet.type') === 'mapillary') {
        widget = 'mapillary-viewer'
      }
      return widget
    },
    clearSelection() {
      this.selection.feature = null
      this.selection.layer = null
      this.$emit('selection-changed')
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
        this.$emit('selection-changed')
        // Open associated default widget if none already open,
        // if the user has open another widget it will remain active
        const widget = this.getWidgetForLayer()
        if (!this.hasOpenWidget()) this.openWidget(widget)
      }
    },
    centerOnSelection () {
      if (this.hasFeatureSelection) {
        this.center(..._.get(centroid(this.selection.feature), 'geometry.coordinates'))
      } else if (this.selection.location) {
        this.center(this.selection.location.lng, this.selection.location.lat)
      }
    },
    addSelectionHighlight (id, feature = {}) {
      // Remove previous selection if any
      this.removeSelectionHighlight(id)
      // Start from selected feature or location to build highlight
      let highlight = (this.selection.feature ?
        _.cloneDeep(this.selection.feature) :
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [this.selection.location.lng, this.selection.location.lat] }
        })
      // Use bbox for line/polygons
      if (highlight.geometry.type !== 'Point') {
        const bounds = bbox(this.selection.feature)
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
      const layer = this.getLayerByName(TOOLS_LAYER)
      if (!layer) {
        await this.addLayer({
          name: TOOLS_LAYER,
          type: 'OverlayLayer',
          tags: ['hidden'], // Do not show the layer in panel
          isStorable: false,
          isEditable: false,
          isSelectable: false,
          leaflet: {
            type: 'geoJson',
            isVisible: true,
            realtime: true,
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
      if (!this.isLayerVisible(TOOLS_LAYER)) await this.showLayer(TOOLS_LAYER)
    },
    updateSelectionLayer () {
      this.updateLayer(TOOLS_LAYER, { type: 'FeatureCollection', features: Object.values(this.selectionHighlight) })
    },
    async removeSelectionLayer () {
      await this.removeLayer(TOOLS_LAYER)
    },
    onFeatureClicked (layer, event) {
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
        if (!this.isCursor('probe-cursor')) return
        // Otherwise this is a position selection only
        layer = undefined
      }
      // Update the selection
      this.setSelection(location, feature, layer)
    },
    onLayerHidden (layer) {
      if (this.hasFeatureSelection) {
        if (layer.name === this.selection.layer.name) this.clearSelection()
      }
    }
  },
  created () {
    // Set of highligthed features
    this.selectionHighlight = {}
  },
  mounted () {
    this.$once('map-ready', () => this.createSelectionLayer())
    this.$once('globe-ready', () => this.createSelectionLayer())
    this.$on('click', this.onFeatureClicked)
    this.$on('layer-hidden', this.onLayerHidden)
  },
  beforeDestroy () {
    this.$off('click', this.onFeatureClicked)
    this.$off('layer-hidden', this.onLayerHidden)
    this.removeSelectionLayer()
  }
}
