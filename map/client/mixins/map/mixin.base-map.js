import _ from 'lodash'
import sift from 'sift'
import logger from 'loglevel'
import moment from 'moment'
import L from 'leaflet'
import Emitter from 'tiny-emitter'
import 'leaflet/dist/leaflet.css'
// This ensure we have all required plugins
import 'leaflet-fullscreen'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import '@kalisio/leaflet.donutcluster/src/Leaflet.DonutCluster.css'
import '@kalisio/leaflet.donutcluster'
import 'leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled.js'
import 'leaflet.geodesic'
import '@kalisio/leaflet-graphicscale'
import '@kalisio/leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css'
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.css'
import iso8601 from 'iso8601-js-period' // Required by leaflet.timedimension
import 'leaflet-timedimension/dist/leaflet.timedimension.src.js'
import 'leaflet-timedimension/dist/leaflet.timedimension.control.css'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import { Time } from '../../../../core/client/time.js'
import { getAppLocale } from '../../../../core/client/utils/index.js'
import { uid } from 'quasar'
import '../../leaflet/BoxSelection.js'
import { Geolocation } from '../../geolocation.js'
import { LeafletEvents, bindLeafletEvents, generatePropertiesSchema } from '../../utils.map.js' // https://github.com/socib/Leaflet.TimeDimension/issues/124

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import retinaIcon from 'leaflet/dist/images/marker-icon-2x.png'
import shadowIcon from 'leaflet/dist/images/marker-shadow.png'
window.nezasa = { iso8601 }

// Fix to make Leaflet assets be correctly inserted by webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: retinaIcon,
  shadowUrl: shadowIcon
})

// Do not create geoman structs everywhere
L.PM.setOptIn(true)

export const baseMap = {
  emits: [
    'map-ready',
    'layer-added',
    'layer-removed',
    'layer-shown',
    'layer-hidden',
    'layer-enabled',
    'layer-disabled'
  ],
  data () {
    return {
      layers: {}
    }
  },
  methods: {
    refreshMap () {
      if (this.map) this.map.invalidateSize()
    },
    setupMap (domEl, options) {
      const viewerOptions = options ||
        // For activities
        _.get(this, 'activityOptions.engine.viewer', {
          minZoom: 3,
          maxZoom: 21,
          center: [47, 3],
          zoom: 6,
          maxBounds: [[-90, -180], [90, 180]],
          maxBoundsViscosity: 0.25,
          scale: false,
          geolocate: false
        })
      // Initialize the map
      this.map = L.map(domEl, Object.assign({ zoomControl: false }, viewerOptions))
      // Make sure geoman is initialized on the map
      if (this.map.pm === undefined) {
        this.map.options.pmIgnore = false
        L.PM.reInitLayer(this.map)
        this.map.pm.setLang(getAppLocale())
      }
      bindLeafletEvents(this.map, LeafletEvents.Map, this, viewerOptions)
      const scale = _.get(viewerOptions, 'scale', true)
      if (scale) this.setupScaleControl(scale)
      const geolocate = _.get(viewerOptions, 'geolocate', true)
      if (geolocate) this.setupGeolocateControl(geolocate)
      this.onMapReady()
    },
    onMapReady () {
      this.$emit('map-ready', 'leaflet')
      this.$engineEvents.emit('map-ready', 'leaflet')
    },
    setupScaleControl (options) {
      // Add a basic or enhanced scale control
      if (typeof options === 'object') {
        this.scaleControl = new L.control.graphicScale(options)
      } else {
        this.scaleControl = new L.control.scale()   // eslint-disable-line
      }
      this.scaleControl.addTo(this.map)
    },
    setupGeolocateControl () {
      this.locateControl = new L.control.locate({  // eslint-disable-line
        locateOptions: {
          maxZoom: 16,
          watch: false,
          setView: false,
          timeout: 30000,
          enableHighAccuracy: true
        },
        strings: {
          title: this.$t('geolocation.TITLE'),
          metersUnit: this.$t('geolocation.METERS'),
          feetUnit: this.$t('geolocation.FEET'),
          popup: this.$t('geolocation.POPUP'),
          outsideMapBoundsMsg: this.$t('geolocation.OUTSIDE_MAP_BOUNDS')
        }
      })
      this.locateControl.addTo(this.map)
      // We'd like to use control features but without actually displaying it
      this.locateControl._container.style.display = 'none'
    },
    processLeafletLayerOptions (options) {
      // Because we update objects in place and don't want leaflet internal objects to be reactive
      const processedOptions = _.cloneDeep(options)
      const leafletOptions = processedOptions.leaflet
      // Transform from string to actual objects when required in some of the layer options
      this.leafletObjectOptions.forEach(option => {
        if (typeof _.get(leafletOptions, option) === 'string') {
          // Jump from string to object, eg { crs: 'CRS.EPSGXXX' } will become { crs: L.CRS.EPSGXXX }
          _.set(leafletOptions, option, _.get(L, _.get(leafletOptions, option)))
        }
      })
      // Check for valid number on min/max zoom level as we might set it to false/null to indicate
      // there is none and we should use defaults, but Leaflet does not like it
      if (_.has(leafletOptions, 'minZoom') && !_.isNumber(leafletOptions.minZoom)) _.unset(leafletOptions, 'minZoom')
      if (_.has(leafletOptions, 'maxZoom') && !_.isNumber(leafletOptions.maxZoom)) _.unset(leafletOptions, 'maxZoom')
      // Copy generic options
      leafletOptions.attribution = processedOptions.attribution
      return processedOptions
    },
    getLeafletPaneName (paneOrZIndex) {
      return (typeof paneOrZIndex === 'object' ? paneOrZIndex.name || paneOrZIndex.zIndex : paneOrZIndex.toString())
    },
    createLeafletPane (paneOrZIndex) {
      // Input can be a name, a z-index, an object with both options
      const paneName = this.getLeafletPaneName(paneOrZIndex)
      let pane = this.map.getPane(paneName)
      // Create pane if required
      if (!pane) {
        let zIndex
        if (typeof paneOrZIndex === 'object') zIndex = paneOrZIndex.zIndex || 400
        else if (typeof paneOrZIndex === 'number') zIndex = paneOrZIndex
        pane = this.map.createPane(paneName)
        _.set(pane, 'style.zIndex', zIndex || 400) // Defaults for overlay in Leaflet
      }
      this.leafletPanes[paneName] = pane
      return pane
    },
    getLeafletPaneByName (paneOrZIndex) {
      const paneName = paneOrZIndex.toString()
      return this.leafletPanes[paneName]
    },
    removeLeafletPane (paneOrZIndex) {
      const paneName = paneOrZIndex.toString()
      const pane = this.getLeafletPaneByName(paneName)
      if (!pane) return
      delete this.leafletPanes[paneName]
    },
    updateLeafletPanesVisibility () {
      const zoom = this.map.getZoom()
      // Check if we need to hide/show some panes based on current zoom level
      _.forOwn(this.leafletPanes, (pane, paneName) => {
        const hasMinZoom = !!_.get(pane, 'minZoom')
        const hasMaxZoom = !!_.get(pane, 'maxZoom')
        if (!hasMinZoom && !hasMaxZoom) return
        if (!pane.style) pane.style = {}
        if (hasMinZoom && (zoom < _.get(pane, 'minZoom'))) {
          pane.style.display = 'none'
          return
        }
        if (hasMaxZoom && (zoom > _.get(pane, 'maxZoom'))) {
          pane.style.display = 'none'
          return
        }
        pane.style.display = 'block'
      })
    },
    createLeafletLayer (options) {
      const leafletOptions = options.leaflet || options
      // Manage panes to make z-index work for all types of layers
      // Indeed, although DOM-based layers can use setZIndex() to manage rendering order
      // SVG/Canvas-based layers provide no mean to manage render order except using bringToFront() or bringToBack()
      // This is why Leaflet 1.0 introduced panes: https://leafletjs.com/reference.html#map-pane & https://leafletjs.com/examples/map-panes/
      // By implicitely create a pane for each provided z-index makes this transparent for the user
      let zIndex = _.has(leafletOptions, 'zIndex')
      if (zIndex) {
        zIndex = _.get(leafletOptions, 'zIndex')
        this.createLeafletPane(zIndex)
        // Set layer to use target pane
        _.set(leafletOptions, 'pane', zIndex.toString())
      }
      // Different panes inside a layer can be used to manage visibility according to zoom level
      const panes = _.get(leafletOptions, 'panes')
      if (panes) {
        panes.forEach(paneOptions => {
          const pane = this.createLeafletPane(paneOptions)
          Object.assign(pane, paneOptions)
        })
        this.updateLeafletPanesVisibility()
      }

      // Some Leaflet constructors can have additional arguments given as options
      let args = _.get(leafletOptions, 'options', [])
      // Can be an array or a single object for a single additonnal argument
      if (typeof args === 'object') args = [args]
      let layer
      // We use the source option as the first parameter of leaflet layer constructors,
      // which is usually the base URL
      if (leafletOptions.source) {
        const source = leafletOptions.source
        // Remove it from options to avoid sending it twice
        // and side effects like https://github.com/kalisio/kdk/issues/219
        delete leafletOptions.source
        layer = _.get(L, leafletOptions.type)(source, _.omit(leafletOptions, ['options']), ...args)
      } else {
        layer = _.get(L, leafletOptions.type)(_.omit(leafletOptions, ['options']), ...args)
      }
      return layer
    },
    registerLeafletConstructor (constructor) {
      this.leafletFactory.push(constructor)
    },
    async createLayer (options) {
      const processedOptions = this.processLeafletLayerOptions(options)
      let layer
      // Iterate over all registered constructors until we find one
      for (let i = 0; i < this.leafletFactory.length; i++) {
        const constructor = this.leafletFactory[i]
        layer = await constructor(processedOptions)
        if (layer) break
      }
      // Use default Leaflet layer constructor if none found
      return (layer || this.createLeafletLayer(processedOptions))
    },
    createLeafletTimedWmsLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid type
      if (leafletOptions.type !== 'tileLayer.wms') return
      let layer = this.createLeafletLayer(options)
      // Specific case of time dimension layer where we embed the underlying WMS layer
      const timeDimension = _.get(leafletOptions, 'timeDimension')
      if (timeDimension) {
        // It appears that sometimes the time resolution is missing, default as 1 day
        // Please refer to https://www.mapserver.org/ogc/wms_time.html#specifying-time-extents
        _.set(timeDimension, 'period', 'P1D')
        const timeRange = _.get(timeDimension, 'times')
        const timeRangeComponents = (typeof timeRange === 'string' ? timeRange.split('/') : [])
        if (timeRangeComponents.length === 2) {
          _.set(timeDimension, 'times', `${timeRange}/P1D`)
        } else if (timeRangeComponents.length === 3) {
          _.set(timeDimension, 'period', timeRangeComponents[2])
        }
        // Used to format time accordingly
        const periodAsDuration = moment.duration(_.get(timeDimension, 'period'))
        // As we'd like to control time on a per-layer basis create a specific time dimension object
        layer = this.createLeafletLayer({
          type: 'timeDimension.layer.wms',
          source: layer,
          timeDimension: L.timeDimension(timeDimension),
          currentTime: Time.getCurrentTime().toDate().getTime()
        })
        // This allow the layer to conform our internal time interface
        layer.setCurrentTime = (datetime) => { layer._timeDimension.setCurrentTime(datetime.toDate().getTime()) }
        // Default implementation always generate ISO datetime that might break some servers with eg day period only
        layer._createLayerForTime = (time) => {
          // Remove some internals to avoid polluting request
          const wmsParams = _.omit(layer._baseLayer.options, ['timeDimension', 'isVisible', 'type'])
          // Format time according to period
          if (periodAsDuration.years() > 0) wmsParams.time = moment.utc(time).format('YYYY').toISOString()
          else if (periodAsDuration.months() > 0) wmsParams.time = moment.utc(time).format('YYYY-MM')
          else if (periodAsDuration.days() > 0) wmsParams.time = moment.utc(time).format('YYYY-MM-DD')
          else wmsParams.time = moment.utc(time).toISOString()
          return new layer._baseLayer.constructor(layer._baseLayer.getURL(), wmsParams)
        }
      }
      return layer
    },
    hasLayer (name) {
      return _.has(this.layers, name)
    },
    isLayerVisible (name) {
      const leafetLayer = this.getLeafletLayerByName(name)
      return leafetLayer && this.map.hasLayer(leafetLayer)
    },
    isLayerDisabled (layer) {
      const minZoom = _.get(layer, 'leaflet.minZoom')
      const maxZoom = _.get(layer, 'leaflet.maxZoom')
      let isDisabled = false
      if (minZoom && (this.map.getZoom() < minZoom)) isDisabled = true
      if (maxZoom && (this.map.getZoom() > maxZoom)) isDisabled = true
      return isDisabled
    },
    updateLayerDisabled (layer) {
      const wasDisabled = layer.isDisabled
      const isDisabled = this.isLayerDisabled(layer)
      // Test if state changed
      if (wasDisabled === isDisabled) return
      layer.isDisabled = isDisabled
      if (wasDisabled) this.onLayerEnabled(layer)
      else this.onLayerDisabled(layer)
    },
    onLayerEnabled (layer) {
      this.$emit('layer-enabled', layer)
      this.$engineEvents.emit('layer-enabled', layer)
    },
    onLayerDisabled (layer) {
      this.$emit('layer-disabled', layer)
      this.$engineEvents.emit('layer-disabled', layer)
    },
    getLayerByName (name) {
      return this.layers[name]
    },
    getLeafletLayerByName (name) {
      return this.leafletLayers[name]
    },
    getLayerById (id) {
      const layers = this.getLayers({ _id: id })
      return _.get(layers, '[0]')
    },
    getLayers (filter = {}) {
      return _.values(this.layers).filter(sift(filter))
    },
    hasLayers (filter = {}) {
      return _.values(this.layers).filter(sift(filter)).length > 0
    },
    async showLayer (name) {
      // Retrieve the layer
      const layer = this.getLayerByName(name)
      if (!layer) return
      // Check the visibility state
      if (this.isLayerVisible(name)) return

      // Create the leaflet layer on show
      let leafletLayer = this.getLeafletLayerByName(name)
      if (!leafletLayer) {
        try {
          leafletLayer = await this.createLayer(layer)
        } catch (error) {
          logger.error(error)
          return
        }
      }
      // Add the leaflet layer to the map
      this.leafletLayers[name] = leafletLayer
      this.map.addLayer(leafletLayer)
      layer.isVisible = true

      // Ensure base layer will not pop on top of others
      if (layer.type === 'BaseLayer') leafletLayer.bringToBack()
      // Apply the current time if needed
      if (typeof leafletLayer.setCurrentTime === 'function') leafletLayer.setCurrentTime(Time.getCurrentTime())
      this.onLayerShown(layer, leafletLayer)
    },
    onLayerShown (layer, leafletLayer) {
      this.$emit('layer-shown', layer, leafletLayer)
      this.$engineEvents.emit('layer-shown', layer, leafletLayer)
    },
    hideLayer (name) {
      // Check the visibility state
      if (!this.isLayerVisible(name)) return
      // Retrieve the layer
      const layer = this.getLayerByName(name)
      if (!layer) return
      layer.isVisible = false
      // Remove the leaflet layer from map
      const leafletLayer = this.leafletLayers[name]
      delete this.leafletLayers[name]
      this.map.removeLayer(leafletLayer)
      const panes = _.get(layer, 'leaflet.panes')
      if (panes) panes.forEach(pane => this.removeLeafletPane(pane.name || pane.zIndex))
      this.onLayerHidden(layer, leafletLayer)
    },
    onLayerHidden (layer, leafletLayer) {
      this.$emit('layer-hidden', layer, leafletLayer)
      this.$engineEvents.emit('layer-hidden', layer, leafletLayer)
    },
    async addLayer (layer) {
      if (layer && !this.hasLayer(layer.name)) {
        layer.isVisible = false
        layer.isDisabled = this.isLayerDisabled(layer)
        // Store the layer
        this.layers[layer.name] = layer
        this.onLayerAdded(layer)
        // Handle the visibility state
        if (_.get(layer, 'leaflet.isVisible', false)) await this.showLayer(layer.name)
      }
      return layer
    },
    onLayerAdded (layer) {
      this.$emit('layer-added', layer)
      this.$engineEvents.emit('layer-added', layer)
    },
    async addGeoJsonLayer (layerSpec, geoJson) {
      // Check wther the geoJson content is a valid geoJson
      if (geoJson.type !== 'FeatureCollection' && geoJson.type !== 'Feature') {
        logger.error('invalid geoJson content')
        return
      }
      const engine = {
        type: 'geoJson',
        isVisible: true,
        realtime: true
      }
      const defaultLayer = {
        type: 'OverlayLayer',
        scope: 'user',
        isDataEditable: true,
        leaflet: engine,
        // Avoid sharing reference to the same object although options are similar
        // otherwise updating one will automatically update the other one
        cesium: Object.assign({}, engine)
      }
      _.defaults(layerSpec, defaultLayer)
      if (!layerSpec.schema) {
        const schema = generatePropertiesSchema(geoJson, layerSpec.name)
        layerSpec.schema = { name: layerSpec.name, content: schema }
      }
      if (!layerSpec.featureId) {
        if (geoJson.type === 'FeatureCollection') _.forEach(geoJson.features, feature => { feature._id = uid().toString() })
        else geoJson._id = uid().toString()
      }
      // Create an empty layer used as a container
      await this.addLayer(layerSpec)
      // Set the content
      await this.updateLayer(layerSpec.name, geoJson)
      // Zoom to it
      if (geoJson.bbox) this.zoomToBBox(geoJson.bbox)
      else this.zoomToLayer(layerSpec.name)
    },
    renameLayer (previousName, newName) {
      const layer = this.getLayerByName(previousName)
      const leafletLayer = this.getLeafletLayerByName(previousName)
      if (!layer) return
      // Update underlying layer if layer has been already shown
      if (leafletLayer) {
        this.leafletLayers[newName] = leafletLayer
        delete this.leafletLayers[previousName]
      }
      // Update underlying layer
      this.layers[newName] = layer
      delete this.layers[previousName]
    },
    removeLayer (name) {
      const layer = this.getLayerByName(name)
      if (!layer) return
      // If it was visible hide it first (ie remove from map)
      this.hideLayer(name)
      // Delete the layer
      delete this.layers[layer.name]
      this.onLayerRemoved(layer)
    },
    onLayerRemoved (layer) {
      this.$emit('layer-removed', layer)
      this.$engineEvents.emit('layer-removed', layer)
    },
    clearLayers () {
      Object.keys(this.layers).forEach((layer) => this.removeLayer(layer))
    },
    toGeoJson (name) {
      const layer = this.getLeafletLayerByName(name)
      if (!layer || (typeof layer.toGeoJSON !== 'function')) return
      return layer.toGeoJSON()
    },
    zoomToLayer (name, options) {
      const layer = this.getLayerByName(name)
      if (!layer) return
      // Check for layers only visible at a given zoom level
      // If so simply jump to that level in order to show some data
      if (this.isLayerDisabled(layer)) {
        const minZoom = _.get(layer, 'leaflet.minZoom')
        if (minZoom) {
          const center = this.getCenter()
          this.center(center.longitude, center.latitude, minZoom)
          return
        }
      }
      const bbox = _.get(layer, 'bbox')
      if (bbox) {
        this.zoomToBBox(bbox)
      } else {
        const leafletLayer = this.getLeafletLayerByName(name)
        if (leafletLayer) {
          if (typeof leafletLayer.getBounds === 'function') {
            const bounds = leafletLayer.getBounds()
            if (bounds.isValid()) this.map.fitBounds(bounds, options)
          } else {
            const bounds = _.get(layer, 'leaflet.bounds', this.map.options.maxBounds)
            this.zoomToBounds(bounds)
          }
        }
      }
    },
    zoomToBounds (bounds) {
      this.map.fitBounds(bounds)
    },
    zoomToBBox (bbox) {
      this.zoomToBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]])
    },
    center (longitude, latitude, zoomLevel, options) {
      const duration = _.get(options, 'duration', 0)
      if (duration) this.map.flyTo(new L.LatLng(latitude, longitude), zoomLevel || this.map.getZoom(), options)
      else this.map.setView(new L.LatLng(latitude, longitude), zoomLevel || this.map.getZoom(), options)
    },
    getCenter () {
      const center = this.map.getCenter()
      const zoom = this.map.getZoom()
      return {
        longitude: center.lng,
        latitude: center.lat,
        zoomLevel: zoom
      }
    },
    getBounds () {
      this.viewBounds = this.map.getBounds()
      const south = this.viewBounds.getSouth()
      const west = this.viewBounds.getWest()
      const north = this.viewBounds.getNorth()
      const east = this.viewBounds.getEast()
      return [[south, west], [north, east]]
    },
    showUserLocation () {
      // If we already have a location jump to it first
      if (Geolocation.hasLocation()) {
        const lng = Geolocation.getLongitude()
        const lat = Geolocation.getLatitude()
        const accuracy = Geolocation.getAccuracy()
        if (accuracy) {
          this.zoomToBounds(new L.LatLng(lat, lng).toBounds(accuracy * 2))
        } else {
          this.center(lng, lat)
        }
      }
      // Then let control run if any
      if (this.locateControl) {
        this.locateControl.start()
      }
    },
    hideUserLocation () {
      if (this.locateControl) {
        this.locateControl.stop()
      }
    },
    isUserLocationVisible () {
      return (this.locateControl && this.locateControl._active)
    },
    setCursor (className) {
      L.DomUtil.addClass(this.map._container, className)
    },
    isCursor (className) {
      return L.DomUtil.hasClass(this.map._container, className)
    },
    unsetCursor (className) {
      L.DomUtil.removeClass(this.map._container, className)
    },
    onCurrentMapTimeChanged (datetime) {
      _.forEach(this.leafletLayers, leafletLayer => {
        if (typeof leafletLayer.setCurrentTime === 'function') leafletLayer.setCurrentTime(datetime)
      })
    },
    onMapZoomChanged () {
      this.updateLeafletPanesVisibility()
      // Update disable state
      const zoomLayers = _.values(this.layers).filter(sift({
        $or: [{ 'leaflet.minZoom': { $exists: true } }, { 'leaflet.maxZoom': { $exists: true } }]
      }))
      zoomLayers.forEach(async layer => { this.updateLayerDisabled(layer) })
    }
  },
  async created () {
    this.leafletLayers = {}
    this.leafletPanes = {}
    this.leafletFactory = []
    // Default Leaflet layer options requiring conversion from string to actual Leaflet objects
    this.leafletObjectOptions = ['crs', 'rendererFactory']
    // Register support for WMS-T
    this.registerLeafletConstructor(this.createLeafletTimedWmsLayer)
    // Internal event bus
    this.$engineEvents = new Emitter()
    this.$engineEvents.on('zoomend', this.onMapZoomChanged)
    this.$events.on('time-current-time-changed', this.onCurrentMapTimeChanged)

    /*
    console.log('***** KDK ****')
    console.log(L.Icon.Default.prototype._getIconUrl())

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: await loadIcon('marker-icon-2x.png'),
      iconUrl: await loadIcon('marker-icon.png'),
      shadowUrl: await loadIcon('marker-shadow.png')
    }) */
  },
  beforeUnmount () {
    this.clearLayers()
    this.$engineEvents.off('zoomend', this.onMapZoomChanged)
    this.$events.off('time-current-time-changed', this.onCurrentMapTimeChanged)
  },
  unmounted () {
    if (this.map) this.map.remove()
  }
}
