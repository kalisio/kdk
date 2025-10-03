import _ from 'lodash'
import sift from 'sift'
import logger from 'loglevel'
import moment from 'moment'
import { EventBus } from 'quasar'
import { point, rhumbDistance, rhumbBearing, rhumbDestination } from '@turf/turf'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// This ensure we have all required plugins
import 'leaflet-fullscreen'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import '@kalisio/leaflet.donutcluster/src/Leaflet.DonutCluster.css'
import '@kalisio/leaflet.donutcluster'
import 'leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled.js'
import 'leaflet.geodesic'
import '@kalisio/leaflet-graphicscale'
import '@kalisio/leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css'
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.css'
import iso8601 from 'iso8601-js-period' // Required by leaflet.timedimension
import 'leaflet-wms-header'
import 'leaflet-timedimension/dist/leaflet.timedimension.src.js'
import 'leaflet-timedimension/dist/leaflet.timedimension.control.css'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import 'leaflet-rotate/dist/leaflet-rotate-src.js'

import { Time } from '../../../../core/client/time.js'
import { Events } from '../../../../core/client/events.js'
import { getLocale } from '../../../../core/client/utils/index.js'
import '../../leaflet/BoxSelection.js'
import '../../leaflet/WindBarb.js'
import { Geolocation } from '../../geolocation.js'
import { LeafletEvents, TouchEvents, bindLeafletEvents, getNearestTime } from '../../utils.map.js' // https://github.com/socib/Leaflet.TimeDimension/issues/124
import { generateLayerDefinition } from '../../utils/utils.layers.js'
import * as maths from '../../../../core/client/utils/utils.math.js'

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

// Override default Leaflet tile layer to allow for more tile preloading
const _getTiledPixelBounds = L.GridLayer.prototype._getTiledPixelBounds
L.GridLayer.include({
  _getTiledPixelBounds: function (center) {
    let pixelBounds = _getTiledPixelBounds.call(this, center)
    const edgeBufferTiles = this.options.edgeBufferTiles
    if (edgeBufferTiles > 0) {
      const pixelEdgeBuffer = L.GridLayer.prototype.getTileSize.call(this).multiplyBy(edgeBufferTiles)
      pixelBounds = new L.Bounds(pixelBounds.min.subtract(pixelEdgeBuffer), pixelBounds.max.add(pixelEdgeBuffer))
    }
    return pixelBounds
  }
})

// Override default Leaflet map renderer create function to be able to provide options to it
const _createRenderer = L.Map.prototype._createRenderer
L.Map.include({
  _createRenderer: function (options) {
    return _createRenderer.call(this, Object.assign(_.get(this.options, 'rendererOptions', {}), options))
  }
})

export const baseMap = {
  emits: [
    'map-ready',
    'layer-added',
    'layer-removed',
    'layer-shown',
    'layer-hidden',
    'layer-enabled',
    'layer-disabled',
    'pane-added',
    'pane-removed',
    'pane-shown',
    'pane-hidden'
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
    setupMap (domEl, options = {}) {
      const viewerOptions = _.defaults(options, _.get(this, 'activityOptions.engine.viewer', {}), {
        minZoom: 3,
        maxZoom: 21,
        center: [47, 3],
        zoom: 6,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 0.25,
        scale: true,
        geolocate: true,
        rotateControl: false // Rotate plugin show this even if rotation is disabled
      })
      // Initialize the map
      this.map = L.map(domEl, Object.assign({ zoomControl: false }, viewerOptions))
      const backgroundColor = _.get(viewerOptions, 'backgroundColor')
      if (backgroundColor) this.map._container.style.backgroundColor = backgroundColor
      // Make sure geoman is initialized on the map
      if (this.map.pm === undefined) {
        this.map.options.pmIgnore = false
        L.PM.reInitLayer(this.map)
        this.map.pm.setLang(getLocale())
      }
      // Leaflet does not really manage touch events, it provides compatibility mapping with mouse events
      // but it will not really trigger touch event from the map object, as a consequence we manage this by ourselves
      L.DomEvent.on(this.map._container, TouchEvents.join(' '), this.onTouchEvent, this)
      bindLeafletEvents(this.map, LeafletEvents.Map, this, viewerOptions)
      const scale = _.get(viewerOptions, 'scale', true)
      if (scale) this.setupScaleControl(scale)
      const geolocate = _.get(viewerOptions, 'geolocate', true)
      if (geolocate) this.setupGeolocateControl(geolocate)
      // Add a special hidden pane, used to hide individual features
      const hiddenPane = this.map.createPane('kdk-hidden-features')
      hiddenPane.style.display = 'none'
      this.onMapReady()
    },
    convertTouches (touches) {
      const convertedTouches = []
      if (touches && touches.length) {
        for (let i = 0; i < touches.length; i++) {
          const touch = (typeof touches.item === 'function' ? touches.item(i) : touches[i])
          const data = {
            containerPoint: this.map.mouseEventToContainerPoint(touch)
          }
          if (data.containerPoint) {
            data.layerPoint = this.map.containerPointToLayerPoint(data.containerPoint)
            data.latlng = this.map.layerPointToLatLng(data.layerPoint)
          }
          convertedTouches.push(data)
        }
      }
      return convertedTouches
    },
    onTouchEvent (event) {
      // Some browsers like firefox rely on pointer events, in this case Leaflet automatically
      // manages mapping with mouse/touch events but then this listener will be called by mouse pointer events
      if (event.pointerType === 'mouse') return

      // This code is largely based on Leaflet map _fireDOMEvent handler and DomEvent.Pointer for pointer event management
      const pointerEventsMapping = {
        pointerdown: 'touchstart',
        pointermove: 'touchmove',
        pointerup: 'touchend',
        pointercancel: 'touchcancel'
      }
      const pointerEvent = pointerEventsMapping[event.type]
      const type = pointerEvent || event.type
      // Find the layer the event is propagating from and its parents.
      let targets = this.map._findEventTargets(event, type)
      if (!targets.length) return

      // Convert all touches to container/map coordinates
      const touches = this.convertTouches(event.touches)
      const changedTouches = this.convertTouches(event.changedTouches)
      const targetTouches = this.convertTouches(event.targetTouches)

      for (let i = 0; i < targets.length; i++) {
        const target = targets[i]
        const data = {
          originalEvent: event,
          touches, changedTouches, targetTouches
        }
        // For touchend we need to use changesTouches to know where the touch leaves the surface
        const touchesForTarget = (_.isEmpty(touches) ? (_.isEmpty(changedTouches) ? [] : changedTouches) : touches)
        const isMarker = target.getLatLng && (!target._radius || target._radius <= 10)
        data.containerPoint = (isMarker ? this.map.latLngToContainerPoint(target.getLatLng()) : _.get(touchesForTarget, '[0].containerPoint'))
        if (data.containerPoint) {
          data.layerPoint = this.map.containerPointToLayerPoint(data.containerPoint)
          data.latlng = (isMarker ? target.getLatLng() : this.map.layerPointToLatLng(data.layerPoint))
        }
        target.fire(type, data, true)
        if (data.originalEvent._stopped) return
      }
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
      return (typeof paneOrZIndex === 'object' ? paneOrZIndex.name || paneOrZIndex.zIndex.toString() : paneOrZIndex.toString())
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
        // Check for parent pane if any, useful for leaflet-rotate plugin
        let container = paneOrZIndex.container
        // Defaults to rotate pane
        if (this.map._rotate && !container) container = 'rotatePane'
        container = this.map.getPane(container)
        pane = this.map.createPane(paneName, container)
        _.set(pane, 'style.zIndex', zIndex || 400) // Defaults for overlay in Leaflet
      }
      this.leafletPanes[paneName] = pane
      this.onPaneAdded(paneName, pane)
      return pane
    },
    onPaneAdded (name, leafletPane) {
      this.$emit('pane-added', name, leafletPane)
      this.$engineEvents.emit('pane-added', name, leafletPane)
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
      this.onPaneRemoved(paneName, pane)
    },
    onPaneRemoved (name, leafletPane) {
      this.$emit('pane-removed', name, leafletPane)
      this.$engineEvents.emit('pane-removed', name, leafletPane)
    },
    isPaneVisible (name) {
      const pane = this.getLeafletPaneByName(name)
      return pane && (pane.style.display === 'block')
    },
    showPane(name) {
      const pane = this.getLeafletPaneByName(name)
      if (!pane || (pane.style.display === 'block')) return
      pane.style.display = 'block'
      this.onPaneShown(name, pane)
    },
    onPaneShown (name, leafletPane) {
      this.$emit('pane-shown', name, leafletPane)
      this.$engineEvents.emit('pane-shown', name, leafletPane)
    },
    hidePane(name) {
      const pane = this.getLeafletPaneByName(name)
      if (!pane || (pane.style.display === 'none')) return
      pane.style.display = 'none'
      this.onPaneHidden(name, pane)
    },
    onPaneHidden (name, leafletPane) {
      this.$emit('pane-hidden', name, leafletPane)
      this.$engineEvents.emit('pane-hidden', name, leafletPane)
    },
    updateLeafletPanesVisibility () {
      // Take care to possible fractional zoom while panes uses integer zoom levels
      const zoom = Math.floor(this.map.getZoom())
      // Check if we need to hide/show some panes based on current zoom level
      _.forOwn(this.leafletPanes, (pane, paneName) => {
        const hasMinZoom = !!_.get(pane, 'minZoom')
        const hasMaxZoom = !!_.get(pane, 'maxZoom')
        if (!hasMinZoom && !hasMaxZoom) return
        if (!pane.style) pane.style = {}
        if (hasMinZoom && (zoom < _.get(pane, 'minZoom'))) {
          this.hidePane(paneName)
          return
        }
        if (hasMaxZoom && (zoom > _.get(pane, 'maxZoom'))) {
          this.hidePane(paneName)
          return
        }
        this.showPane(paneName)
      })
    },
    createLeafletLayer (options) {
      const name = options.name
      const leafletOptions = options.leaflet || options
      // Manage panes to make z-index work for all types of layers.
      // Indeed, although DOM-based layers can use setZIndex() to manage rendering order
      // SVG/Canvas-based layers provide no mean to manage render order except using bringToFront() or bringToBack().
      // This is why Leaflet 1.0 introduced panes: https://leafletjs.com/reference.html#map-pane & https://leafletjs.com/examples/map-panes/
      // By implicitely create a pane for each provided z-index makes this transparent for the user.
      const layerPane = { name }
      const hasMinZoom = !!_.get(leafletOptions, 'minZoom')
      const hasMaxZoom = !!_.get(leafletOptions, 'maxZoom')
      const hasZIndex = !!_.get(leafletOptions, 'zIndex')
      if (hasMinZoom) layerPane.minZoom = _.get(leafletOptions, 'minZoom')
      if (hasMaxZoom) layerPane.maxZoom = _.get(leafletOptions, 'maxZoom')
      if (hasZIndex) layerPane.zIndex = _.get(leafletOptions, 'zIndex')
      if (hasZIndex) {
        this.createLeafletPane(layerPane)
        // Set layer to use its default pane as target
        // Avoid erasing any existing pane, if so the pane should have been created taken into account the layer zIndex up-front
        if (!_.has(leafletOptions, 'pane')) _.set(leafletOptions, 'pane', layerPane.name)
      }
      // Different panes inside a layer can be used to manage visibility according to zoom level
      const panes = _.get(leafletOptions, 'panes', [])
      if (panes) {
        panes.forEach(paneOptions => {
          const pane = this.createLeafletPane(paneOptions)
          Object.assign(pane, paneOptions)
        })
      }
      this.updateLeafletPanesVisibility()

      // Some Leaflet constructors can have additional arguments given as options
      let args = _.get(leafletOptions, 'options', [])
      // Can be an array or a single object for a single additonnal argument
      if (typeof args === 'object') args = [args]
      let layer, type = leafletOptions.type
      // We use the source option as the first parameter of leaflet layer constructors,
      // which is usually the base URL
      if (leafletOptions.source) {
        const source = leafletOptions.source
        // Remove it from options to avoid sending it twice
        // and side effects like https://github.com/kalisio/kdk/issues/219
        delete leafletOptions.source
        layer = _.get(L, type)(source, _.omit(leafletOptions, ['options']), ...args)
      } else {
        layer = _.get(L, type)(_.omit(leafletOptions, ['options']), ...args)
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
      if ((leafletOptions.type !== 'tileLayer.wms') && (leafletOptions.type !== 'TileLayer.wmsHeader')) return
      let layer = this.createLeafletLayer(options)
      // Specific case of time dimension layer where we embed the underlying WMS layer
      const timeDimension = _.get(leafletOptions, 'timeDimension')
      if (timeDimension) {
        // It appears that sometimes the time resolution is missing, default as 1 day
        // Please refer to https://www.mapserver.org/ogc/wms_time.html#specifying-time-extents
        _.set(timeDimension, 'period', 'P1D')
        const timeRange = _.get(timeDimension, 'times')
        const timeRangeComponents = (typeof timeRange === 'string' ? timeRange.split('/') : [])
        const timeList = (typeof timeRange === 'string' ? timeRange.split(',') : [])
        let times = [] // Time list as moment objects to ease search
        if (!_.isEmpty(timeList)) {
          // In this case there is no period as time list should be ISO
          _.unset(timeDimension, 'period')
          // Convert to moment objects
          times = _.sortBy(timeList.map(time => moment.utc(time)), (time) => time.valueOf())
        } else if (timeRangeComponents.length === 2) {
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
        layer.setCurrentTime = (datetime) => {
          layer._timeDimension.setCurrentTime(datetime.toDate().getTime())
        }
        // Default implementation always generate ISO datetime that might break some servers with eg day period only
        layer._createLayerForTime = (time) => {
          time = moment.utc(time)
          // Remove some internals to avoid polluting request
          const wmsParams = _.omit(layer._baseLayer.options, ['timeDimension', 'isVisible', 'type'])
          // Format time according to period
          if (periodAsDuration.years() > 0) {
            wmsParams.time = time.format('YYYY').toISOString()
          } else if (periodAsDuration.months() > 0) {
            wmsParams.time = time.format('YYYY-MM')
          } else if (periodAsDuration.days() > 0) {
            wmsParams.time = time.format('YYYY-MM-DD')
          } else if (!_.isEmpty(times)) {
            // Find nearest available time, as we keep the list ordered it could use a faster algorithm in utility function
            const { index, difference } = getNearestTime(time, times, true)
            // Keep original time format in any case it is not ISO
            if (index >= 0) wmsParams.time = timeList[index]
            else wmsParams.time = time.toISOString()
          } else {
            wmsParams.time = time.toISOString()
          }
          // Some Leaflet constructors can have additional arguments given as options
          let args = _.get(leafletOptions, 'options', [])
          // Can be an array or a single object for a single additonnal argument
          if (typeof args === 'object') args = [args]
          return new layer._baseLayer.constructor(layer._baseLayer.getURL(), wmsParams, ...args)
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
    async addGeoJsonLayer (layerSpec, geoJson, zoom = true) {
      if (!generateLayerDefinition(layerSpec, geoJson)) return
      // Create an empty layer used as a container
      await this.addLayer(layerSpec)
      // Set the content
      await this.updateLayer(layerSpec.name, geoJson)
      // Zoom to the layer
      if (zoom) {
        if (geoJson.bbox) this.zoomToBBox(geoJson.bbox)
        else this.zoomToLayer(layerSpec.name)
      }
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
      if (!this.isLayerVisible(name)) {
        // Only lookup geojson cache when layer is not visible
        // otherwise use toGeoJSON() on the layer to get most up to date content.
        const cachedGeojson = this.geojsonCache[name]
        if (cachedGeojson) return cachedGeojson
      }

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
    bringLayerToFront (name) {
      let leafletLayer = this.getLeafletLayerByName(name)
      if (!leafletLayer) return
      // If panes are declared on this layer push it front to make it on top of others should be sufficient.
      const panes = _.get(leafletLayer, 'options.panes')
      if (panes) {
        panes.forEach(paneOptions => {
          const pane = this.getLeafletPaneByName(this.getLeafletPaneName(paneOptions))
          if (pane) L.DomUtil.toFront(pane)
        })
        return
      }
      // Handle case where there's clustering on top (cf. updateLayer)
      if (leafletLayer instanceof L.MarkerClusterGroup) {
        const container = leafletLayer
        leafletLayer = leafletLayer.getLayers().find(layer => layer._container === container)
      }
      if (leafletLayer && (typeof leafletLayer.bringToFront === 'function')) leafletLayer.bringToFront()
    },
    bringLayerToBack (name) {
      let leafletLayer = this.getLeafletLayerByName(name)
      if (!leafletLayer) return
      // If panes are declared on this layer push it back to make it under others should be sufficient.
      const panes = _.get(leafletLayer, 'options.panes')
      if (panes) {
        panes.forEach(paneOptions => {
          const pane = this.getLeafletPaneByName(this.getLeafletPaneName(paneOptions))
          if (pane) L.DomUtil.toBack(pane)
        })
        return
      }
      // Handle case where there's clustering on top (cf. updateLayer)
      if (leafletLayer instanceof L.MarkerClusterGroup) {
        const container = leafletLayer
        leafletLayer = leafletLayer.getLayers().find(layer => layer._container === container)
      }
      if (leafletLayer && (typeof leafletLayer.bringToBack === 'function')) leafletLayer.bringToBack()
    },
    animateCenter (timestamp) {
      // Note: as this callback is called frequently by the animation system
      // we don't use lodash utility functions like _.get/_.set to improve performances
      
      // Initialize animation time origin
      if (!this.centerAnimation.startTime) this.centerAnimation.startTime = timestamp
      const { id, duration, startTime, fps,
        animate: { center, zoom, bearing },
        startLongitude, endLatitude, startLatitude, startZoom, startBearing,
        endLongitude, endZoom, endBearing } = this.centerAnimation
      const elapsedSinceStart = timestamp - startTime
      // If we target a specific frame rate check if we need to update or not
      if (fps && this.centerAnimation.lastTime) {
        const elapsedSinceLastFrame = timestamp - this.centerAnimation.lastTime
        const fpsInterval = 1000 / fps
        if (elapsedSinceLastFrame < fpsInterval) {
          this.centerAnimation.id = requestAnimationFrame(this.animateCenter)
          // For debug purpose only, avoid flooding the browser
          //logger.debug('[KDK] Skipping center animation frame')
          return
        } else {
          // For debug purpose only, avoid flooding the browser
          //logger.debug('[KDK] Drawing center animation frame')
        }
      }
      // Else animate if animation not yet finished
      const percent = Math.abs(elapsedSinceStart / (1000 * duration))
      let percentCenter, percentZoom, percentBearing
      if (percent <= 1) {
        const currentCenter = this.getCenter()
        if (center) {
          const easingCenterFunction = center.easing.function
          const easingCenterParameters = center.easing.parameters || []
          percentCenter = maths[easingCenterFunction](percent, ...easingCenterParameters)
        }
        if (zoom) {
          const easingZoomFunction = zoom.easing.function
          const easingZoomParameters = zoom.easing.parameters || []
          percentZoom = maths[easingZoomFunction](percent, ...easingZoomParameters)
        }
        if (bearing) {
          const easingBearingFunction = bearing.easing.function
          const easingBearingParameters = bearing.easing.parameters || []
          percentBearing = maths[easingBearingFunction](percent, ...easingBearingParameters)
        }
        const offset = this.centerAnimation.offset
        const dx = (center && offset ? percentCenter * offset.x || 0 : 0)
        const dy = (center && offset ? percentCenter * offset.y || 0 : 0)
        let dLongitude = currentCenter.longitude, dLatitude = currentCenter.latitude
        if (center) {
          if (center.rhumb) {
            const destination = rhumbDestination(this.centerAnimation.rhumbStart, percentCenter * this.centerAnimation.rhumbDistance, this.centerAnimation.rhumbBearing)
            dLongitude = destination.geometry.coordinates[0]
            dLatitude = destination.geometry.coordinates[1]
          } else {
            dLongitude = startLongitude + percentCenter * (endLongitude - startLongitude)
            dLatitude = startLatitude + percentCenter * (endLatitude - startLatitude)
          }
        }
        const dZoom = (zoom ? startZoom + percentZoom * (endZoom - startZoom) : null)
        let dBearing
        if (!_.isNil(startBearing)) {
          // Take care to animate using the shortest "path", eg from 355° to 5° avoid running counterclockwise
          // First computes the smallest angle difference, either clockwise or counterclockwise.
          const bearingDifference = (endBearing - startBearing + 540) % 360 - 180
          // Then normalize the final result to be between 0 and 360
          dBearing = (bearing ? (startBearing + percentBearing * bearingDifference + 360) % 360 : null)
        }
        this.center(dLongitude, dLatitude, dZoom, dBearing, { offset: { x: Math.round(dx), y: Math.round(dy) }, bearingTolerance: this.centerAnimation.bearingTolerance })
        this.centerAnimation.lastTime = timestamp
        this.centerAnimation.id = requestAnimationFrame(this.animateCenter)
      } else {
        this.centerAnimation.id = null
      }
    },
    center  (longitude, latitude, zoomLevel, bearing, options = {}) {
      const offset = L.point(_.get(options, 'offset.x', 0), _.get(options, 'offset.y', 0))
      if (_.isNil(zoomLevel)) zoomLevel = this.map.getZoom()
      if (_.isNil(bearing)) bearing = this.map.getBearing()
      // Keep bearing positive, required for interpolation to work correctly
      if (bearing < 0) bearing += 360
      const duration = _.get(options, 'duration', 0)
      if (duration) {
        // For debug purpose only, avoid flooding the browser
        //logger.debug('Calling center() with', longitude, latitude, options)
        _.defaultsDeep(options, {
          animate: {
            center: { easing: { function: 'linear' }, rhumb: false },
            zoom: { easing: { function: 'linear' } },
            bearing: { easing: { function: 'linear' } }
          }
        })
        // Leaflet rotate does not manage animation so that we cannot rely on Leaflet built-in animation
        if (_.has(this.centerAnimation, 'id')) cancelAnimationFrame(_.get(this.centerAnimation, 'id'))
        const currentCenter = this.getCenter(options)
        const rhumbStart = point([currentCenter.longitude, currentCenter.latitude])
        const rhumbEnd = point([longitude, latitude])
        this.centerAnimation = {
          id: requestAnimationFrame(this.animateCenter),
          ...options,
          startLongitude: currentCenter.longitude,
          startLatitude: currentCenter.latitude,
          startZoom: currentCenter.zoom,
          endLongitude: longitude,
          endLatitude: latitude,
          rhumbStart,
          rhumbEnd,
          rhumbBearing: rhumbBearing(rhumbStart, rhumbEnd),
          rhumbDistance: rhumbDistance(rhumbStart, rhumbEnd),
          endZoom: zoomLevel
        }
        if (typeof this.map.getBearing === 'function') {
          Object.assign(this.centerAnimation, {
            startBearing: this.map.getBearing(),
            endBearing: bearing
          })
        }
      } else {
        if (typeof this.map.setBearing === 'function') {
          this.setBearing(bearing, options)
        }
        this.map.setView(new L.LatLng(latitude, longitude), zoomLevel, { animate: false, duration: 0 })
        this.map.panBy(offset, { animate: false, duration: 0 })
      }
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
    setBearing(bearing, options = {}) {
      if (typeof this.map.setBearing !== 'function') {
        logger.warn(`[KDK] Map not configured to handle bearing, ignoring`)
        return
      }
      const offset = L.point(_.get(options, 'offset.x', 0), _.get(options, 'offset.y', 0))
      // As rotating is costly by default we don't really rotate unless the human eye is able to perceive it
      const tolerance = _.get(options, 'bearingTolerance', 0.1)
      if (Math.abs(this.map.getBearing() - bearing) >= tolerance) {
        this.map.setBearing(bearing, offset)
      }
    },
    getBearing () {
      if (typeof this.map.getBearing !== 'function') {
        return 0
      }
      return this.map.getBearing()
    },
    setCompassBearingTrackingEnabled (enabled) {
      if (enabled) {
        if (!this.map.compassBearing.enabled()) this.map.compassBearing.enable()
      } else if (this.map.compassBearing.enabled()) {
        this.map.compassBearing.disable()
      }
    },
    setTouchRotateEnabled (enabled) {
      if (enabled) {
        if (!this.map.touchRotate.enabled()) this.map.touchRotate.enable()
      } else if (this.map.touchRotate.enabled()) {
        this.map.touchRotate.disable()
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
    this.$engineEvents = new EventBus()
    this.$engineEvents.on('zoomend', this.onMapZoomChanged)
    Events.on('time-current-time-changed', this.onCurrentMapTimeChanged)
  },
  beforeUnmount () {
    this.clearLayers()
    L.DomEvent.off(this.map._container, TouchEvents.join(' '), this.onTouchEvent, this)
    this.$engineEvents.off('zoomend', this.onMapZoomChanged)
    Events.off('time-current-time-changed', this.onCurrentMapTimeChanged)
  },
  unmounted () {
    if (this.map) {
      this.map.off()
      this.map.remove()
    }
  }
}
