import bbox from '@turf/bbox'
import centroid from '@turf/centroid'
import _ from 'lodash'
import L from 'leaflet'
import { colors } from 'quasar'

export default {
  data () {
    return {
      selection: {
        feature: null,
        layer: null,
        options: null,
        hasSelection: false
      }
    }
  },
  methods: {
    clearSelection () {
      this.selection.feature = null
      this.selection.layer = null
      this.selection.options = null
      this.hasSelection = false
    },
    centerOnSelection () {
      this.center(..._.get(centroid(this.selection.feature), 'geometry.coordinates'))
    },
    addSelectionHighlight () {
      if (this.is2D()) {
        if (this.selection.feature.geometry.type === 'Point') {
          const coords = this.selection.feature.geometry.coordinates
          this.selectionHighlight = L.circleMarker([coords[1], coords[0]], { radius: 18, color: colors.getBrand('secondary'), weight: 3 })
        } else {
          const bounds = bbox(this.selection.feature)
          this.selectionHighlight = L.rectangle([[bounds[1], bounds[0]], [bounds[3], bounds[2]]], { color: colors.getBrand('secondary'), weight: 3 })
        }
        this.selectionHighlight.on('click', (event) => {
          this.removeSelectionHighlight()
          this.clearSelection()
        })
        this.map.addLayer(this.selectionHighlight)
      }
    },
    removeSelectionHighlight () {
      if (this.selectionHighlight) {
        this.map.removeLayer(this.selectionHighlight)
        this.selectionHighlight = null
      }
    },
    onFeatureClicked (options, event) {
      // Retrieve tje feature and the options
      if (!options || !options.schema) return
      const feature = _.get(event, 'target.feature')
      const entity = _.get(event, 'target')
      const layer = _.get(event, 'target')
      if (!feature || !entity) return
      // Remove the highligtht a selection is already active
      if (this.hasSelection) this.removeSelectionHighlight()
      // Updatd the selection
      this.selection.feature = feature || entity
      this.selection.layer = layer
      this.selection.options = options
      this.hasSelection = true
      // Add the highlight
      this.addSelectionHighlight()
      // Open the widget
      if (this.$refs.page) this.$refs.page.openWindow('feature')
    },
    onLayerShown (layer) {
      if (this.hasSelection) {
        if (layer.name === this.selection.options.name) this.addSelectionHighlight()
      }
    },
    onLayerHidden (layer) {
      if (this.hasSelection) {
        if (layer.name === this.selection.options.name) this.removeSelectionHighlight()
      }
    },
    onLayerRemoved (layer) {
      if (this.hasSelection) {
        if (layer.name === this.selection.options.name) this.clearSelection()
      }
    }
  },
  created () {
    this.selectionHighlight = null
  },
  mounted () {
    this.$on('click', this.onFeatureClicked)
    this.$on('layer-shown', this.onLayerShown)
    this.$on('layer-hidden', this.onLayerHidden)
    this.$on('layer-removed', this.onLayerRemoved)
  },
  beforeDestroy () {
    this.$off('click', this.onFeatureClicked)
    this.$off('layer-shown', this.onLayerShown)
    this.$off('layer-hidden', this.onLayerHidden)
    this.$off('layer-removed', this.onLayerRemoved)
  }
}
