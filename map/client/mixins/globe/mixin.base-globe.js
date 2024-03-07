import _ from 'lodash'
import sift from 'sift'
import logger from 'loglevel'
import Emitter from 'tiny-emitter'
import { getCssVar } from 'quasar'
import Cesium from 'cesium/Source/Cesium.js'
import 'cesium/Source/Widgets/widgets.css'
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl.js'
import { Geolocation } from '../../geolocation.js'
import { convertCesiumHandlerEvent, isTerrainLayer, convertEntitiesToGeoJson } from '../../utils.globe.js'
// Cesium has its own dynamic module loader requiring to be configured
// Cesium files need to be also added as static assets of the applciation
BuildModuleUrl.setBaseUrl('/Cesium/')

export const baseGlobe = {
  emits: [
    'globe-ready',
    'layer-added',
    'layer-removed',
    'layer-shown',
    'layer-hidden'
  ],
  data () {
    return {
      layers: {}
    }
  },
  methods: {
    refreshGlobe () {
    },
    setupGlobe (domEl, token, options) {
      const viewerOptions = options ||
        // For activities
        _.get(this, 'activityOptions.engine.viewer', {
          sceneMode: 3, // SceneMode.COLUMBUS_VIEW = 1, SceneMode.SCENE3D = 3,
          sceneModePicker: false,
          infoBox: false,
          scene3DOnly: true,
          homeButton: false,
          geocoder: false,
          navigationHelpButton: false,
          baseLayerPicker: false,
          vrButton: false,
          fullscreenButton: false,
          animation: false,
          timeline: false
        })
      if (token) Cesium.Ion.defaultAccessToken = token
      // If we don't need ion
      else Cesium.Ion.defaultAccessToken = ''
      // Initialize the globe
      Object.assign(viewerOptions, {
        imageryProviderViewModels: [],
        terrainProviderViewModels: []
      })
      this.viewer = new Cesium.Viewer(domEl, viewerOptions)
      // Cesium always create a default provider
      this.viewer.scene.imageryLayers.removeAll()
      // Add defaults handler
      this.registerCesiumHandler(this.getDefaultPickHandler, 'MOUSE_MOVE')
      this.registerCesiumHandler(this.getDefaultPickHandler, 'LEFT_CLICK')
      this.registerCesiumHandler(this.getDefaultPickHandler, 'RIGHT_CLICK')
      // Remove default Cesium handlers
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
      this.viewBounds = new Cesium.Rectangle()
      this.onGlobeReady()
    },
    onGlobeReady () {
      this.$emit('globe-ready', 'cesium')
      this.$engineEvents.emit('globe-ready', 'cesium')
    },
    processCesiumLayerOptions (options) {
      // Because we update objects in place and don't want cesium internal objects to be reactive
      const processedOptions = _.cloneDeep(options)
      // Transform from string to actual object
      processedOptions.cesium.iconUrl = Cesium.buildModuleUrl(processedOptions.iconUrl)
      // Copy generic options
      processedOptions.cesium.name = processedOptions.name
      processedOptions.cesium.attribution = processedOptions.attribution
      return processedOptions
    },
    createCesiumLayer (options) {
      const cesiumOptions = options.cesium || options
      if (cesiumOptions.type === '3DTileset') {
        const convertedOptions = this.convertToCesiumObjects(cesiumOptions)
        const tileset = new Cesium.Cesium3DTileset(_.omit(convertedOptions, ['style']))
        // Not possible to get style as constructor options
        if (_.has(convertedOptions, 'style')) tileset.style = _.get(convertedOptions, 'style')
        return tileset
      }
      let provider
      if (isTerrainLayer(cesiumOptions)) {
        if (cesiumOptions.url || (cesiumOptions.type === 'Ellipsoid')) provider = cesiumOptions.type + 'TerrainProvider'
        // If no url given will use default terrain creation function createWorldTerrain()
        else provider = 'WorldTerrain'
      } else {
        provider = cesiumOptions.type + 'ImageryProvider'
      }
      // Handle specific case of built-in creation functions
      const createFunction = 'create' + provider
      if (Cesium[provider]) provider = new Cesium[provider](cesiumOptions)
      else provider = Cesium[createFunction](cesiumOptions)
      // Terrain is directly managed using a provider
      return (isTerrainLayer(cesiumOptions) ? provider : new Cesium.ImageryLayer(provider))
    },
    registerCesiumConstructor (constructor) {
      this.cesiumFactory.push(constructor)
    },
    registerCesiumHandler (handler, eventType) {
      if (!this.cesiumHandler) this.cesiumHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
      const originalEvent = convertCesiumHandlerEvent(eventType)
      this.cesiumHandler.setInputAction((event) => handler(Object.assign(event, { originalEvent })),
        Cesium.ScreenSpaceEventType[eventType])
    },
    unregisterCesiumHandler (eventType) {
      this.cesiumHandlers.removeInputAction(Cesium.ScreenSpaceEventType[eventType])
    },
    async createLayer (options) {
      const processedOptions = this.processCesiumLayerOptions(options)
      let layer
      // Iterate over all registered constructors until we find one
      for (let i = 0; i < this.cesiumFactory.length; i++) {
        const constructor = this.cesiumFactory[i]
        layer = await constructor(processedOptions)
        if (layer) break
      }
      // Use default Cesium layer constructor if none found
      layer = layer || this.createCesiumLayer(processedOptions)
      // Keep track of processed options
      layer.processedOptions = processedOptions
      return layer
    },
    hasLayer (name) {
      return _.has(this.layers, name)
    },
    isLayerVisible (name) {
      const layer = this.getLayerByName(name)
      if (!layer) return false
      const cesiumLayer = this.getCesiumLayerByName(name)
      if (isTerrainLayer(layer)) {
        return this.viewer.terrainProvider === cesiumLayer
      } else if (cesiumLayer instanceof Cesium.ImageryLayer) {
        return this.viewer.scene.imageryLayers.contains(cesiumLayer)
      } else if (cesiumLayer instanceof Cesium.Cesium3DTileset) {
        return this.viewer.scene.primitives.contains(cesiumLayer) && cesiumLayer.show
      } else { // Entity data source otherwise
        return this.viewer.dataSources.contains(cesiumLayer)
      }
    },
    isLayerDisabled (layer) {
      // TODO
      return false
    },
    getLayerByName (name) {
      return this.layers[name]
    },
    getCesiumLayerByName (name) {
      return this.cesiumLayers[name]
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
      // Retieve the layer
      const layer = this.getLayerByName(name)
      if (!layer) return
      // Check the visibility state
      if (this.isLayerVisible(name)) return
      // Create the Cesium layer on show
      let cesiumLayer = this.getCesiumLayerByName(name)
      if (!cesiumLayer) {
        try {
          cesiumLayer = await this.createLayer(layer)
        } catch (error) {
          logger.error(error)
          return
        }
      }
      // Add the cesium layer to the globe
      this.cesiumLayers[name] = cesiumLayer
      if (isTerrainLayer(layer)) {
        this.viewer.terrainProvider = cesiumLayer
      } else if (cesiumLayer instanceof Cesium.ImageryLayer) {
        this.viewer.scene.imageryLayers.add(cesiumLayer)
      } else if (cesiumLayer instanceof Cesium.Cesium3DTileset) {
        cesiumLayer.show = true
        if (!this.viewer.scene.primitives.contains(cesiumLayer)) this.viewer.scene.primitives.add(cesiumLayer)
      } else { // Entity data source otherwise
        this.viewer.dataSources.add(cesiumLayer)
      }
      layer.isVisible = true
      this.onLayerShown('layer-shown', layer, cesiumLayer)
    },
    onLayerShown (layer, cesiumLayer) {
      this.$emit('layer-shown', layer, cesiumLayer)
      this.$engineEvents.emit('layer-shown', layer, cesiumLayer)
    },
    hideLayer (name) {
      // retrieve the layer
      const layer = this.getLayerByName(name)
      if (!layer) return
      // Check the visibility state
      if (!this.isLayerVisible(name)) return
      layer.isVisible = false
      // Remove the cesium layer from globe
      const cesiumLayer = this.cesiumLayers[name]
      delete this.cesiumLayers[name]
      if (isTerrainLayer(layer)) {
        this.viewer.terrainProvider = null
      } else if (cesiumLayer instanceof Cesium.ImageryLayer) {
        this.viewer.scene.imageryLayers.remove(cesiumLayer, false)
      } else if (cesiumLayer instanceof Cesium.Cesium3DTileset) {
        cesiumLayer.show = false
      } else { // Entity data source otherwise
        this.viewer.dataSources.remove(cesiumLayer, true)
      }
      this.onLayerHidden(layer, cesiumLayer)
    },
    onLayerHidden (layer, cesiumLayer) {
      this.$emit('layer-hidden', layer, cesiumLayer)
      this.$engineEvents.emit('layer-hidden', layer, cesiumLayer)
    },
    async addLayer (layer) {
      if (layer && !this.hasLayer(layer.name)) {
        layer.isVisible = false
        layer.isDisabled = this.isLayerDisabled(layer)
        // Store the layer
        this.layers[layer.name] = layer
        this.onLayerAdded(layer)
        // Handle the visibility state
        if (_.get(layer, 'cesium.isVisible', false)) await this.showLayer(layer.name)
      }
      return layer
    },
    onLayerAdded (layer) {
      this.$emit('layer-added', layer)
      this.$engineEvents.emit('layer-added', layer)
    },
    renameLayer (previousName, newName) {
      const layer = this.getLayerByName(previousName)
      const cesiumLayer = this.getCesiumLayerByName(previousName)
      if (!layer) return
      // Update underlying layer if layer has been already shown
      if (cesiumLayer) {
        this.cesiumLayers[newName] = cesiumLayer
        delete this.cesiumLayers[previousName]
      }
      // Update underlying layer
      this.layers[newName] = layer
      delete this.layers[previousName]
    },
    removeLayer (name) {
      const layer = this.getLayerByName(name)
      if (!layer) return
      // If it was visible hide it first (ie remove from globe)
      this.hideLayer(name)
      const cesiumLayer = this.cesiumLayers[name]
      if (cesiumLayer instanceof Cesium.Cesium3DTileset) {
        this.viewer.scene.primitives.remove(cesiumLayer)
      }
      // Delete the layer
      delete this.layers[layer.name]
      delete this.cesiumLayers[name]
      this.onLayerRemoved(layer)
    },
    onLayerRemoved (layer) {
      this.$emit('layer-removed', layer)
      this.$engineEvents.emit('layer-removed', layer)
    },
    clearLayers () {
      Object.keys(this.layers).forEach((layer) => this.removeLayer(layer))
    },
    async toGeoJson (name) {
      const layer = this.getCesiumLayerByName(name)
      if (!layer.entities) return
      const geoJson = await convertEntitiesToGeoJson(layer.entities)
      return geoJson
    },
    zoomToBounds (bounds, heading = 0, pitch = -90, roll = 0, duration = 0) {
      this.viewer.camera.flyTo({
        destination: Array.isArray(bounds) // Assume Cesium rectangle object if not array
          ? Cesium.Rectangle.fromDegrees(bounds[0][1], bounds[0][0], bounds[1][1], bounds[1][0])
          : bounds,
        orientation: {
          heading: Cesium.Math.toRadians(heading),
          pitch: Cesium.Math.toRadians(pitch),
          roll: Cesium.Math.toRadians(roll)
        },
        duration
      })
    },
    zoomToBBox (bbox, heading = 0, pitch = -90, roll = 0, duration = 0) {
      this.zoomToBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]], heading, pitch, roll, duration)
    },
    zoomToLayer (name) {
      const layer = this.getCesiumLayerByName(name)
      if (!layer) return

      if (layer.entities) {
        this.viewer.flyTo(layer.entities, { duration: 0 })
      } else {
        const bbox = _.get(layer, 'bbox')
        if (bbox) {
          this.zoomToBBox(bbox)
        } else {
          const bounds = _.get(layer, 'cesium.rectangle', [[-90, -180], [90, 180]])
          this.zoomToBounds(bounds)
        }
      }
    },
    center (longitude, latitude, altitude, heading = 0, pitch = -90, roll = 0, duration = 0) {
      const center = this.viewer.camera.positionCartographic
      const target = {
        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude || center.height),
        orientation: {
          heading: Cesium.Math.toRadians(heading),
          pitch: Cesium.Math.toRadians(pitch),
          roll: Cesium.Math.toRadians(roll)
        },
        duration
      }
      if (duration) this.viewer.camera.flyTo(target)
      else this.viewer.camera.setView(target)
    },
    getCenter () {
      const center = this.viewer.camera.positionCartographic
      return {
        longitude: Cesium.Math.toDegrees(center.longitude),
        latitude: Cesium.Math.toDegrees(center.latitude),
        altitude: center.height
      }
    },
    getBounds () {
      const bounds = this.viewer.camera.computeViewRectangle(this.viewer.scene.globe.ellipsoid, this.viewBounds)
      const south = Cesium.Math.toDegrees(bounds.south)
      const west = Cesium.Math.toDegrees(bounds.west)
      const north = Cesium.Math.toDegrees(bounds.north)
      const east = Cesium.Math.toDegrees(bounds.east)
      return [[south, west], [north, east]]
    },
    async showUserLocation () {
      if (Geolocation.hasLocation()) {
        const longitude = Geolocation.getLongitude()
        const latitude = Geolocation.getLatitude()
        this.center(longitude, latitude)
        const pinBuilder = new Cesium.PinBuilder()
        const canvas = await pinBuilder.fromMakiIconId('marker', Cesium.Color.fromCssColorString(getCssVar('primary')), 48)
        this.userLocationEntity = this.viewer.entities.add({
          name: 'user-location',
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
          billboard: {
            image: canvas.toDataURL(),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
          }
        })
        this.viewer.selectedEntity = this.userLocationEntity
        this.userLocation = true
      }
    },
    hideUserLocation () {
      if (this.userLocationEntity) {
        this.viewer.entities.remove(this.userLocationEntity)
        this.userLocationEntity = null
      }
      this.userLocation = false
    },
    isUserLocationVisible () {
      // TODO: no specific marker to show yet
      return this.userLocation
    },
    setCursor (className) {
      this.viewer.container.classList.add(className)
    },
    isCursor (className) {
      return this.viewer.container.classList.contains(className)
    },
    unsetCursor (className) {
      this.viewer.container.classList.remove(className)
    },
    getLayerNameForEntity (entity) {
      let layerName
      _.forOwn(this.cesiumLayers, (value, key) => {
        if (!layerName && value.entities) {
          if (value.entities.contains(entity)) layerName = key
        }
      })
      return layerName
    },
    getNbChildrenForEntity (entity) {
      if (entity._children) return entity._children.length
      else return 0
    },
    getChildForEntity (entity, index) {
      if (this.getNbChildrenForEntity(entity) > 0) return entity._children[index || 0]
    },
    getPositionForEntity (entity) {
      let position = entity.position
      if (!position) {
        if (entity.polygon) {
          position = Cesium.BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center
        } else if (entity.polyline) {
          position = Cesium.BoundingSphere.fromPoints(entity.polyline.positions.getValue()).center
        }
        Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(position, position)
      }
      return position
    },
    async getDefaultPickHandler (event) {
      const emittedEvent = {}
      let options
      let pickedPosition = this.viewer.camera.pickEllipsoid(event.endPosition || event.position, this.viewer.scene.globe.ellipsoid)
      if (pickedPosition) {
        // This is for 3D handlers
        emittedEvent.pickedPosition = pickedPosition
        pickedPosition = Cesium.Cartographic.fromCartesian(pickedPosition)
        const longitude = Cesium.Math.toDegrees(pickedPosition.longitude)
        const latitude = Cesium.Math.toDegrees(pickedPosition.latitude)
        // This ensure we can use similar handlers than for Leaflet
        emittedEvent.latlng = [latitude, longitude]
        emittedEvent.latlng.lng = longitude
        emittedEvent.latlng.lat = latitude
      }
      const pickedObject = this.viewer.scene.pick(event.endPosition || event.position)
      if (pickedObject) {
        emittedEvent.target = pickedObject.id || pickedObject.primitive.id
        if (emittedEvent.target instanceof Cesium.Entity) {
          // If feature have been lost at import try to recreate it in order to be compatible with 2D
          // We attach it to the target entity so that we won't compute it each time the mouse move
          // FIXME: should it be a problem with real-time updates ?
          if (!emittedEvent.target.feature) {
            // Cesium expect id to be in a 'id' property but internally we use _id
            // Get it back as otherwise it might break code relying on feature ID
            let feature = {
              _id: emittedEvent.target.id,
              type: 'Feature'
            }
            // Generate GeoJson feature if possible (requires Cesium 1.59)
            if (typeof Cesium.exportKml === 'function') {
              const selection = new Cesium.EntityCollection()
              selection.add(emittedEvent.target)
              const geoJson = await convertEntitiesToGeoJson(selection)
              if (geoJson.features.length > 0) {
                Object.assign(feature, geoJson.features[0])
              }
            }
            if (!feature.geometry) {
              const position = Cesium.Cartographic.fromCartesian(emittedEvent.target.position
                ? emittedEvent.target.position.getValue(0)
                : emittedEvent.pickedPosition)
              feature.geometry = {
                type: 'Point',
                coordinates: [Cesium.Math.toDegrees(position.longitude), Cesium.Math.toDegrees(position.latitude)]
              }
            }
            feature.properties = (emittedEvent.target.properties ? emittedEvent.target.properties.getValue(0) : {})
            emittedEvent.target.feature = feature
          }
          let layer = this.getLayerNameForEntity(emittedEvent.target)
          if (layer) layer = this.getCesiumLayerByName(layer)
          if (layer) options = layer.processedOptions
        }
      }
      // Mimic Leaflet events
      this.$engineEvents.emit(event.originalEvent.name, options, emittedEvent)
    }
  },
  created () {
    this.cesiumLayers = {}
    this.cesiumFactory = []
    // TODO: no specific marker, just keep status
    this.userLocation = false
    // Internal event bus
    this.$engineEvents = new Emitter()
  },
  beforeUnmount () {
    this.clearLayers()
  },
  unmounted () {
    this.viewer.destroy()
  }
}
