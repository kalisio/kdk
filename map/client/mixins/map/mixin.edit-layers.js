import _ from 'lodash'
import L from 'leaflet'
import { Dialog, uid } from 'quasar'
import { bindLeafletEvents, unbindLeafletEvents } from '../../utils.js'

// Events we listen while layer is in edition mode
const mapEditEvents = ['pm:create']
const layerEditEvents = ['layerremove', 'pm:update', 'pm:dragend', 'pm:rotateend', 'pm:markerdragend']

export const editLayers = {
  emits: [
    'edit-start',
    'edit-stop',
    'edit-point-moved'
  ],
  data () {
    return {
      editingLayer: false,
      allowedLayerEditModes: [],
      layerEditMode: ''
    }
  },
  watch: {
    async $route (to, from) {
      if (!this.editedFeature) return

      // React to route changes when starting/finishing feature edition
      if (_.get(to, 'params.featureId')) {
        // Avoid default popup
        this.editedPopup = this.editedFeature.getPopup()
        if (this.editedPopup) this.editedFeature.unbindPopup(this.editedPopup)
      } else if (_.get(from, 'params.featureId')) {
        // Restore popup
        if (this.editedPopup) this.editedFeature.bindPopup(this.editedPopup)
        // Update feature after edition from DB or memory
        const service = (this.editedLayer._id ? 'features' : 'features-edition')
        const feature = await this.$api.getService(service).get(this.editedFeature.feature._id)
        this.editableLayer.removeLayer(this.editedFeature)
        this.editableLayer.addData(feature)
        this.editedPopup = null
        this.editedFeature = null
      }
    }
  },
  methods: {
    isLayerEdited (layer) {
      return this.editedLayer && (this.editedLayer.name === layer.name)
    },
    getGeoJsonEditOptions (options) {
      let filteredOptions = options
      if (_.has(filteredOptions, 'leaflet.tooltip') || _.has(filteredOptions, 'leaflet.popup')) {
        // Disable tooltip & popup features on edited layer
        filteredOptions = Object.assign({}, options)
        if (filteredOptions.leaflet.tooltip) delete filteredOptions.leaflet.tooltip
        if (filteredOptions.leaflet.popup) delete filteredOptions.leaflet.popup
      }
      // Retrieve base options first
      const { onEachFeature } = this.getGeoJsonOptions(filteredOptions)
      return {
        // Allow geoman edition
        pmIgnore: false,
        onEachFeature,
        // Use default styling when editing as dynamic styling can conflict
        style: (feature) => {
          return Object.assign({},
            _.get(this, 'activityOptions.engine.editFeatureStyle', _.get(this, 'activityOptions.engine.featureStyle')))
        },
        pointToLayer: (feature, latlng) => {
          return this.createMarkerFromStyle(latlng, Object.assign({ pmIgnore: false }, // Allow geoman edition
            _.get(this, 'activityOptions.engine.editPointStyle', _.get(this, 'activityOptions.engine.pointStyle'))))
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
        // Nothing todo
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
    async startEditLayer (layer, { allowedEditModes = null, editMode = null } = {}) {
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
      // Make it selected as well
      this.selectedLayer = layer
      this.editingLayer = true
      this.onEditStart(this.editedLayer)

      // Move source layers to edition layers, required as eg clusters are not supported
      const geoJson = leafletLayer.toGeoJSON()
      leafletLayer.clearLayers()

      // in-memory edition ?
      if (this.editedLayer._id === undefined) {
        // In this case we have to push features to in memory service
        const features = geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson]
        for (const feature of features) {
          // Generate in memory service _id as string to match what's done with mongo
          feature._id = uid().toString()
          // Service will use the provided _id as object key
          await this.$api.getService('features-edition').create(feature)
        }
      }

      this.editableLayer = L.geoJson(geoJson, this.getGeoJsonEditOptions(layer))
      this.map.addLayer(this.editableLayer)
      bindLeafletEvents(this.map, mapEditEvents, this)
      bindLeafletEvents(this.editableLayer, layerEditEvents, this)

      this.$engineEvents.on('click', this.onEditFeatureProperties)
      this.$engineEvents.on('zoomend', this.onMapZoomWhileEditing)
      this.$engineEvents.on('pm:create', this.onFeatureCreated)
      this.$engineEvents.on('pm:update', this.onFeaturesEdited)
      this.$engineEvents.on('pm:dragend', this.onFeaturesEdited)
      this.$engineEvents.on('pm:rotateend', this.onFeaturesEdited)
      this.$engineEvents.on('layerremove', this.onFeaturesDeleted)
      this.$engineEvents.on('pm:markerdragend', this.onPointMoveEnd)

      if (editMode) this.setEditMode(editMode)
    },
    onEditStart (layer) {
      this.$emit('edit-start', { layer })
      this.$engineEvents.emit('edit-start', { layer })
    },
    async stopEditLayer (status = 'accept') {
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

      // for in memory edition, clear service
      if (this.editedLayer._id === undefined) {
        const geoJson = this.editableLayer.toGeoJSON()
        const features = geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson]
        for (const feature of features) {
          await this.$api.getService('features-edition').remove(feature._id)
        }
      }

      // Set back edited layers to source layer
      this.map.removeLayer(this.editableLayer)
      leafletLayer.addLayer(this.editableLayer)
      this.onEditStop(status, this.editedLayer)
      this.editedLayer = null
      this.editingLayer = false

      this.$engineEvents.off('click', this.onEditFeatureProperties)
      this.$engineEvents.off('zoomend', this.onMapZoomWhileEditing)
      this.$engineEvents.off('pm:create', this.onFeatureCreated)
      this.$engineEvents.off('pm:update', this.onFeaturesEdited)
      this.$engineEvents.off('pm:dragend', this.onFeaturesEdited)
      this.$engineEvents.off('pm:rotateend', this.onFeaturesEdited)
      this.$engineEvents.off('layerremove', this.onFeaturesDeleted)
      this.$engineEvents.off('pm:markerdragend', this.onPointMoveEnd)
    },
    onEditStop (status, layer) {
      this.$emit('edit-stop', { status, layer })
      this.$engineEvents.emit('edit-stop', { status, layer })
    },
    async onEditFeatureProperties (layer, event) {
      const leafletLayer = event && event.target
      const feature = _.get(leafletLayer, 'feature')

      if (this.layerEditMode !== 'edit-properties' ||
          !this.isLayerEdited(layer) ||
          !_.get(layer, 'schema.content') ||
          !leafletLayer ||
          !feature) return

      this.editedFeature = leafletLayer
      this.$router.push({
        name: 'edit-map-layer-feature',
        query: this.$route.query,
        params: Object.assign(this.$route.params, {
          layerId: this.editedLayer._id,
          layer: this.editedLayer,
          featureId: feature._id,
          contextId: this.contextId
        })
      })
    },
    async onFeatureCreated (event) {
      const leafletLayer = event && event.layer
      if ((this.layerEditMode !== 'add-polygons' &&
           this.layerEditMode !== 'add-rectangles' &&
           this.layerEditMode !== 'add-lines' &&
           this.layerEditMode !== 'add-points') ||
          !leafletLayer) return

      let geoJson = leafletLayer.toGeoJSON()
      // Generate temporary ID for feature
      const idValue = uid().toString()
      let idProp = _.get(this.editedLayer, 'featureId')
      idProp = (idProp && (idProp !== '_id')) ? 'properties.' + idProp : '_id'
      _.set(geoJson, idProp, idValue)
      // Save changes to DB, we use the layer DB ID as layer ID on features
      if (this.editedLayer._id) {
        geoJson = await this.createFeatures(geoJson, this.editedLayer._id)
      } else {
        // Generate in memory service _id as string to match what's done with mongo
        geoJson._id = idValue
        // Service will use the provided _id as object key
        await this.$api.getService('features-edition').create(geoJson)
      }
      this.editableLayer.removeLayer(leafletLayer)
      this.editableLayer.addData(geoJson)
    },
    async onFeaturesEdited (event) {
      const leafletLayer = event && event.layer
      if ((this.layerEditMode !== 'edit-geometry' &&
           this.layerEditMode !== 'drag' &&
           this.layerEditMode !== 'rotate') ||
          !leafletLayer) return

      // Save changes to DB
      const geoJson = leafletLayer.toGeoJSON()
      if (this.editedLayer._id) {
        await this.editFeaturesGeometry(geoJson)
      } else {
        const features = geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson]
        for (const feature of features) {
          await this.$api.getService('features-edition').patch(feature._id, { geometry: feature.geometry })
        }
      }
    },
    async onFeaturesDeleted (event) {
      const leafletLayer = event && event.layer
      if (this.layerEditMode !== 'remove' ||
         !leafletLayer) return

      // This is connected to the 'layerremove' event of the editable layer
      // but we may also receive 'layerremove' event from the map
      if (!event.target || event.target !== this.editableLayer) return

      // Save changes to DB
      const geoJson = leafletLayer.toGeoJSON()
      if (this.editedLayer._id) {
        await this.removeFeatures(geoJson)
      } else {
        const features = geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson]
        for (const feature of features) {
          await this.$api.getService('features-edition').remove(feature._id)
        }
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
    },
    onPointMoveEnd (event) {
      // Lookup edited point coordinates
      let coords = event.layer.getLatLngs()
      for (let deep = 0; deep < event.indexPath.length; ++deep)
        coords = coords[event.indexPath[deep]]

      // Find the polyline layer index that fired the event
      const polylineIndex = this.editableLayer.pm._layers.findIndex((layer) => layer._leaflet_id === event.layer._leaflet_id)
      // Prepend that index to the index path
      // The full point path is [polyline_index, marker_path]
      const pointPath = event.indexPath.slice(0, event.indexPath.length)
      pointPath.splice(0, 0, polylineIndex)

      this.onEditPointMoved(pointPath, coords, 'user')
    },
    moveEditPoint (pointPath, newLat, newLon, origin) {
      if (!this.editingLayer) return

      const leafletCoords = L.latLng(newLat, newLon)

      // Break point path in [polyline_index, marker_path]
      const polylineIndex = pointPath[0]
      const markerPath = pointPath.slice(1, pointPath.length)

      // Update polyline coords
      const polyline = this.editableLayer.pm._layers[polylineIndex]
      const coords = polyline.getLatLngs()
      const parentPath = markerPath.slice(0, markerPath.length - 1)
      const index = markerPath[markerPath.length - 1]
      let parentArr = coords
      for (const i of parentPath)
        parentArr = parentArr[i]
      parentArr[index] = leafletCoords
      polyline.setLatLngs(coords)

      // Also update associated marker
      let marker = polyline.pm._markers
      for (const i of markerPath)
        marker = marker[i]
      marker.setLatLng(leafletCoords)

      this.onEditPointMoved(pointPath, leafletCoords, origin ? origin : 'app')
    },
    onEditPointMoved (pointPath, coords, origin) {
      const args = {
        layer: this.editedLayer,
        pointPath: pointPath,
        latitude: coords.lat,
        longitude: coords.lng,
        origin
      }

      this.$emit('edit-point-moved', args)
      this.$engineEvents.emit('edit-point-moved', args)
    }
  },
  created () {
    // Perform required conversion for default feature styling
    if (_.has(this, 'activityOptions.engine.editFeatureStyle')) {
      this.convertFromSimpleStyleSpec(_.get(this, 'activityOptions.engine.editFeatureStyle'), 'update-in-place')
    }
    if (_.has(this, 'activityOptions.engine.editPointStyle')) {
      this.convertFromSimpleStyleSpec(_.get(this, 'activityOptions.engine.editPointStyle'), 'update-in-place')
    }
  }
}
