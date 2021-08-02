import _ from 'lodash'
import L from 'leaflet'
import { Dialog, uid } from 'quasar'
import { bindLeafletEvents, unbindLeafletEvents } from '../../utils'

// Events we listen while layer is in edition mode
const mapEditEvents = ['pm:create']
const layerEditEvents = ['layerremove', 'pm:update', 'pm:dragend', 'pm:rotateend']

export default {
  data () {
    return {
      editingLayer: false,
      allowedLayerEditModes: [],
      layerEditMode: ''
    }
  },
  methods: {
    isLayerEdited (layer) {
      return this.editedLayer && (this.editedLayer.name === layer.name)
    },
    getGeoJsonEditOptions (options) {
      // Retrieve base options first
      const { onEachFeature } = this.getGeoJsonOptions(options)
      return {
        // Allow geoman edition
        pmIgnore: false,
        onEachFeature,
        // Use default styling when editing as dynamic styling can conflict
        style: (feature) => {
          return Object.assign({}, this.activityOptions.engine.editFeatureStyle || this.activityOptions.engine.featureStyle)
        },
        pointToLayer: (feature, latlng) => {
          return this.createMarkerFromStyle(latlng, Object.assign({ pmIgnore: false }, // Allow geoman edition
            this.activityOptions.engine.editPointStyle || this.activityOptions.engine.pointStyle))
        }
      }
    },
    setEditMode (mode) {
      if (!this.editableLayer) return

      // disable all modes
      if (this.map.pm.globalDrawModeEnabled()) this.map.pm.disableDraw()
      if (this.map.pm.globalEditModeEnabled()) this.map.pm.disableGlobalEditMode()
      if (this.map.pm.globalDragModeEnabled()) this.map.pm.disableGlobalDragMode()
      if (this.map.pm.globalRemovalModeEnabled()) this.map.pm.disableGlobalRemovalMode()
      if (this.map.pm.globalRotateModeEnabled()) this.map.pm.disableGlobalRotateMode()
      this.map.pm.setGlobalOptions({ layerGroup: this.map })

      if (this.allowedLayerEditModes.indexOf(mode) === -1) return

      if (mode === 'edit-properties') {
      } else if (mode === 'edit-geometry') {
        this.map.pm.enableGlobalEditMode()
      } else if (mode === 'drag') {
        this.map.pm.enableGlobalDragMode()
      } else if (mode === 'rotate') {
        this.map.pm.enableGlobalRotateMode()
      } else if (mode === 'remove') {
        this.map.pm.setGlobalOptions({ layerGroup: this.editableLayer })
        this.map.pm.enableGlobalRemovalMode()
      } else if (mode === 'add-polygons') {
        this.map.pm.setGlobalOptions({ layerGroup: this.editableLayer })
        this.map.pm.enableDraw('Polygon', { continueDrawing: true })
      } else if (mode === 'add-rectangles') {
        this.map.pm.setGlobalOptions({ layerGroup: this.editableLayer })
        this.map.pm.enableDraw('Rectangle', { continueDrawing: true })
      } else if (mode === 'add-lines') {
        this.map.pm.setGlobalOptions({ layerGroup: this.editableLayer })
        this.map.pm.enableDraw('Line', { continueDrawing: true })
      } else if (mode === 'add-points') {
        this.map.pm.setGlobalOptions({ layerGroup: this.editableLayer })
        this.map.pm.enableDraw('Marker', { continueDrawing: true })
      }

      this.layerEditMode = mode
    },
    startEditLayer (layer, { allowedEditModes = null, editMode = null } = {}) {
      if (this.editedLayer) return

      const leafletLayer = this.getLeafletLayerByName(layer.name)
      if (!leafletLayer) return

      this.allowedLayerEditModes = allowedEditModes || [
        'edit-properties',
        'edit-geometry',
        'drag',
        'rotate',
        'remove',
        'add-polygons',
        'add-rectangles',
        'add-lines',
        'add-points'
      ]

      this.editedLayer = layer
      this.editingLayer = true
      this.$emit('edit-start', { layer: this.editedLayer })

      // Move source layers to edition layers, required as eg clusters are not supported
      const geoJson = leafletLayer.toGeoJSON()
      leafletLayer.clearLayers()
      this.editableLayer = L.geoJson(geoJson, this.getGeoJsonEditOptions(layer))
      this.map.addLayer(this.editableLayer)
      bindLeafletEvents(this.map, mapEditEvents, this)
      bindLeafletEvents(this.editableLayer, layerEditEvents, this)
      this.editedLayerSchema = JSON.stringify(_.get(this.editedLayer, 'schema.content'))

      this.$on('click', this.onEditFeatureProperties)
      this.$on('zoomend', this.onMapZoomWhileEditing)
      this.$on('pm:create', this.onFeatureCreated)
      this.$on('pm:update', this.onFeaturesEdited)
      this.$on('pm:dragend', this.onFeaturesEdited)
      this.$on('pm:rotateend', this.onFeaturesEdited)
      this.$on('layerremove', this.onFeaturesDeleted)

      if (editMode) this.setEditMode(editMode)
    },
    stopEditLayer (status = 'accept') {
      if (!this.editedLayer) return

      const leafletLayer = this.getLeafletLayerByName(this.editedLayer.name)
      if (!leafletLayer) return

      // Make sure we end geoman
      if (this.map.pm.globalDrawModeEnabled()) this.map.pm.disableDraw()
      if (this.map.pm.globalEditModeEnabled()) this.map.pm.disableGlobalEditMode()
      if (this.map.pm.globalDragModeEnabled()) this.map.pm.disableGlobalDragMode()
      if (this.map.pm.globalRemovalModeEnabled()) this.map.pm.disableGlobalRemovalMode()
      if (this.map.pm.globalRotateModeEnabled()) this.map.pm.disableGlobalRotateMode()
      this.map.pm.setGlobalOptions({ layerGroup: this.map })

      unbindLeafletEvents(this.map, mapEditEvents)
      unbindLeafletEvents(this.editableLayer, layerEditEvents)
      // Set back edited layers to source layer
      this.map.removeLayer(this.editableLayer)
      leafletLayer.addLayer(this.editableLayer)
      this.$emit('edit-stop', { status, layer: this.editedLayer })
      this.editedLayer = null
      this.editingLayer = false
      this.editedLayerSchema = null

      this.$off('click', this.onEditFeatureProperties)
      this.$off('zoomend', this.onMapZoomWhileEditing)
      this.$off('pm:create', this.onFeatureCreated)
      this.$off('pm:update', this.onFeaturesEdited)
      this.$off('pm:dragend', this.onFeaturesEdited)
      this.$off('pm:rotateend', this.onFeaturesEdited)
      this.$off('layerremove', this.onFeaturesDeleted)
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
      this.editFeatureModal.openModal()
      this.editFeatureModal.$on('applied', async updatedFeature => {
        // Restore popup
        if (popup) leafletLayer.bindPopup(popup)
        // Save in DB and in memory
        await this.editFeaturesProperties(updatedFeature)
        const geoJson = leafletLayer.toGeoJSON()
        Object.assign(geoJson, _.pick(updatedFeature, ['properties']))
        this.editableLayer.removeLayer(leafletLayer)
        this.editableLayer.addData(geoJson)
        this.editFeatureModal.closeModal()
        this.editFeatureModal = null
      })
      this.editFeatureModal.$on('closed', () => {
        // Restore popup
        if (popup) leafletLayer.bindPopup(popup)
        this.editFeatureModal = null
      })
    },
    async onEditFeatureProperties (layer, event) {
      if (this.layerEditMode !== 'edit-properties') return

      const leafletLayer = event && event.target
      if (!leafletLayer) return

      const feature = _.get(leafletLayer, 'feature')
      if (!feature || !this.isLayerEdited(layer)) return
      if (!this.editedLayerSchema) return // No edition schema
      if (!this.editedLayer._id) return // Impossible to edit in-memory layer as it requires a service now
      await this.updateFeatureProperties(feature, layer, leafletLayer)
    },
    async onFeatureCreated (event) {
      let geoJson = event.layer.toGeoJSON()
      // Generate temporary ID for feature
      const id = _.get(this.editedLayer, 'featureId')
      if (id && (id !== '_id')) _.set(geoJson, 'properties.' + id, uid().toString())
      else geoJson._id = uid().toString()
      // Save changes to DB, we use the layer DB ID as layer ID on features
      if (this.editedLayer._id) {
        geoJson = await this.createFeatures(geoJson, this.editedLayer._id)
      }
      this.editableLayer.removeLayer(event.layer)
      this.editableLayer.addData(geoJson)
    },
    async onFeaturesEdited (event) {
      // Save changes to DB
      if (this.editedLayer._id) {
        await this.editFeaturesGeometry(event.layer.toGeoJSON())
      }
    },
    async onFeaturesDeleted (event) {
      // This is connected to the 'layerremove' event of the editable layer
      // but we may also receive 'layerremove' event from the map
      if (!event.target || event.target !== this.editableLayer) return

      // Save changes to DB
      if (this.editedLayer._id) {
        await this.removeFeatures(event.layer.toGeoJSON())
      }
    },
    onMapZoomWhileEditing (event) {
      // Make sure we keep our edition layer on top
      if (this.editableLayer) {
        this.editableLayer.bringToFront()
      }
    },
    async onRemoveFeature (feature, layer, leafletLayer) {
      Dialog.create({
        title: this.$t('mixins.editLayers.REMOVE_FEATURE_DIALOG_TITLE'),
        message: this.$t('mixins.editLayers.REMOVE_FEATURE_DIALOG_MESSAGE'),
        html: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(async () => {
        const parentLeafletLayer = this.getLeafletLayerByName(layer.name)
        if (!parentLeafletLayer) return
        await this.removeFeatures(feature)
        parentLeafletLayer.removeLayer(leafletLayer)
      })
    }
  },
  created () {
    // Perform required conversion for default feature styling
    if (this.activityOptions.engine.editFeatureStyle) this.convertFromSimpleStyleSpec(this.activityOptions.engine.editFeatureStyle, 'update-in-place')
    if (this.activityOptions.engine.editPointStyle) this.convertFromSimpleStyleSpec(this.activityOptions.engine.editPointStyle, 'update-in-place')
  }
}
