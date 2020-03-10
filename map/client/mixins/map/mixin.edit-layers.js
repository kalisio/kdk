import _ from 'lodash'
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw-src.js'
import 'leaflet-draw/dist/leaflet.draw-src.css'
import { Dialog, uid } from 'quasar'
import { bindLeafletEvents, LeafletEvents } from '../../utils'

export default {
  methods: {
    isLayerEdited (name) {
      return this.editedLayer && (this.editedLayer.name === name)
    },
    getGeoJsonEditOptions (options) {
      // Retrieve base options first
      const { onEachFeature, style, pointToLayer } = this.getGeoJsonOptions(options)
      return {
        onEachFeature,
        // Use default styling when editing as dynamic styling can conflict
        style: (feature) => {
          return Object.assign({}, this.options.editFeatureStyle || this.options.featureStyle)
        },
        pointToLayer: (feature, latlng) => {
          return this.createMarkerFromStyle(latlng, Object.assign({}, this.options.editPointStyle || this.options.pointStyle))
        }
      }
    },
    async editLayer (name) {
      const options = this.getLayerByName(name)
      const leafletLayer = this.getLeafletLayerByName(name)
      if (!options || !leafletLayer) return

      if (this.editControl) { // Stop edition
        // Remove UI
        this.map.removeControl(this.editControl)
        this.editControl = null
        // Set back edited layers to source layer
        this.map.removeLayer(this.editableLayer)
        leafletLayer.addLayer(this.editableLayer)
        this.editedLayer = null
        this.editedLayerSchema = null
        this.deleteInProgress = false
      } else { // Start edition
        this.editedLayer = options
        // Move source layers to edition layers, required as eg clusters are not supported
        const geoJson = leafletLayer.toGeoJSON()
        leafletLayer.clearLayers()
        this.editableLayer = L.geoJson(geoJson, this.getGeoJsonEditOptions(options))
        this.map.addLayer(this.editableLayer)
        // Add UI
        this.editControl = new L.Control.Draw({
          position: 'bottomleft',
          draw: this.editOptions,
          edit: {
            featureGroup: this.editableLayer,
            remove: true
          }
        })
        this.map.addControl(this.editControl)
        this.createdFeatures = []
        this.editedFeatures = []
        this.deletedFeatures = []
        this.editedLayerSchema = JSON.stringify(_.get(this.editedLayer, 'schema.content'))
      }
    },
    async updateFeatureProperties (feature, layer, leafletLayer) {
      // Avoid default popup
      const popup = leafletLayer.getPopup()
      if (popup) leafletLayer.unbindPopup(popup)

      this.editFeatureModal = await this.$createComponent('editor/KModalEditor', {
        propsData: {
          service: 'features',
          contextId: this.contextId,
          objectId: feature._id,
          schemaJson: this.editedLayerSchema,
          perspective: 'properties'
        }
      })
      this.editFeatureModal.$mount()
      this.editFeatureModal.open()
      this.editFeatureModal.$on('applied', async updatedFeature => {
        // Restore popup
        if (popup) leafletLayer.bindPopup(popup)
        // Save in DB and in memory
        await this.editFeaturesProperties(updatedFeature)
        const geoJson = leafletLayer.toGeoJSON()
        Object.assign(geoJson, _.pick(updatedFeature, ['properties']))
        this.editableLayer.removeLayer(leafletLayer)
        this.editableLayer.addData(geoJson)
        this.editFeatureModal.close()
        this.editFeatureModal = null
      })
      this.editFeatureModal.$on('closed', () => {
        // Restore popup
        if (popup) leafletLayer.bindPopup(popup)
        this.editFeatureModal = null
      })
    },
    async onEditFeatureProperties (layer, event) {
      const leafletLayer = event && event.target
      if (!leafletLayer) return
      const feature = _.get(leafletLayer, 'feature')
      if (!feature || !this.isLayerEdited(layer.name)) return
      if (!this.editedLayerSchema) return // No edition schema
      // Check if not currently in the edition workspace for removal
      if (this.deleteInProgress) return
      await this.updateFeatureProperties(feature, layer, leafletLayer)
    },
    async onFeatureCreated (event) {
      let geoJson = event.layer.toGeoJSON()
      // Generate temporary ID for feature
      const id = _.get(this.editedLayer, 'featureId')
      if (id) _.set(geoJson, 'properties.' + id, uid().toString())
      else geoJson._id = uid().toString()
      // Save changes to DB, we use the layer DB ID as layer ID on features
      geoJson = await this.createFeatures(geoJson, this.editedLayer._id)
      this.editableLayer.addData(geoJson)
    },
    async onFeaturesEdited (event) {
      // Save changes to DB
      await this.editFeaturesGeometry(event.layers.toGeoJSON())
    },
    async onFeaturesDeleted (event) {
      // Save changes to DB
      await this.removeFeatures(event.layers.toGeoJSON())
    },
    onStartDeleteFeatures () {
      this.deleteInProgress = true
    },
    onStopDeleteFeatures () {
      this.deleteInProgress = false
    },
    async onRemoveFeature (feature, layer, leafletLayer) {
      Dialog.create({
        title: this.$t('mixins.editLayers.REMOVE_FEATURE_DIALOG_TITLE'),
        message: this.$t('mixins.editLayers.REMOVE_FEATURE_DIALOG_MESSAGE'),
        html: true,
        ok: {
          label: this.$t('OK')
        },
        cancel: {
          label: this.$t('CANCEL')
        }
      }).onOk(async () => {
        const parentLeafletLayer = this.getLeafletLayerByName(layer.name)
        if (!parentLeafletLayer) return
        await this.removeFeatures(feature)
        parentLeafletLayer.removeLayer(leafletLayer)
      })
    }
  },
  beforeCreate () {
    this.editOptions = {
      polyline: {},
      polygon: {
        allowIntersection: false // Restricts shapes to simple polygons
      },
      circle: {},
      rectangle: {},
      marker: {},
      circlemarker: false
    }
  },
  created () {
    // Perform required conversion for default feature styling
    if (this.options.editFeatureStyle) this.convertFromSimpleStyleSpec(this.options.editFeatureStyle, 'update-in-place')
    if (this.options.editPointStyle) this.convertFromSimpleStyleSpec(this.options.editPointStyle, 'update-in-place')
  },
  mounted () {
    // Initialize i18n
    L.drawLocal = this.$t('mixins.editLayers', { returnObjects: true })
    this.$on('map-ready', () => {
      // Setup event binding
      bindLeafletEvents(this.map, _.values(L.Draw.Event), this)
    })
    this.$on('click', this.onEditFeatureProperties)
    this.$on('draw:deletestart', this.onStartDeleteFeatures)
    this.$on('draw:deletestop', this.onStopDeleteFeatures)
    this.$on('draw:created', this.onFeatureCreated)
    this.$on('draw:edited', this.onFeaturesEdited)
    this.$on('draw:deleted', this.onFeaturesDeleted)
  },
  beforeDestroy () {
    this.$off('click', this.onEditFeatureProperties)
    this.$off('draw:deletestart', this.onStartDeleteFeatures)
    this.$off('draw:deletestop', this.onStopDeleteFeatures)
    this.$off('draw:created', this.onFeatureCreated)
    this.$off('draw:edited', this.onFeaturesEdited)
    this.$off('draw:deleted', this.onFeaturesDeleted)
  }
}
