import _ from 'lodash'
import sift from 'sift'
import logger from 'loglevel'
import Emitter from 'tiny-emitter'
import { getCssVar } from 'quasar'
import { Ion, Viewer, Color, viewerCesiumInspectorMixin, Rectangle, ScreenSpaceEventType, ScreenSpaceEventHandler, buildModuleUrl,
         Cesium3DTileset, ImageryLayer, Cartesian3, PinBuilder, BoundingSphere, Ellipsoid, Cartographic, Entity, EntityCollection,
         exportKml, VerticalOrigin, Transforms, Quaternion, HeadingPitchRoll, HeadingPitchRange, Matrix3, Matrix4, DebugCameraPrimitive, 
         DebugModelMatrixPrimitive, Math as CesiumMath } from 'cesium'
import * as Cesium from 'cesium'
import 'cesium/Source/Widgets/widgets.css'
import { Geolocation } from '../../geolocation.js'
import { convertCesiumHandlerEvent, isTerrainLayer, convertEntitiesToGeoJson, createCesiumObject } from '../../utils.globe.js'
import { generateLayerDefinition } from '../../utils/utils.layers.js'
import * as maths from '../../../../core/client/utils/utils.math.js'

// The URL on our server where CesiumJS's static files are hosted
window.CESIUM_BASE_URL = '/Cesium/'
buildModuleUrl.setBaseUrl('/Cesium/')

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
      layers: {},
      orphanLayers: []
    }
  },
  methods: {
    refreshGlobe () {
    },
    setupGlobe (domEl, token, options = {}) {
      this.viewerOptions = _.defaults(options, _.get(this, 'activityOptions.engine.viewer', {}), {
        sceneMode: 3, // SceneMode.COLUMBUS_VIEW = 1, SceneMode.SCENE3D = 3,
        sceneModePicker: false,
        infoBox: false,
        scene3DOnly: true,
        homeButton: false,
        geocoder: false,
        navigationHelpButton: false,
        baseLayer: false,
        baseLayerPicker: false,
        vrButton: false,
        fullscreenButton: false,
        animation: false,
        timeline: false,
        depthTestAgainstTerrain: false,
        cameraMoveEventPercentage: 0.2,
        entityLoadTextureDelay: 24
      })
      if (token) Ion.defaultAccessToken = token
      // If we don't need ion
      else Ion.defaultAccessToken = ''
      // Initialize the globe
      Object.assign(this.viewerOptions, {
        imageryProviderViewModels: [],
        terrainProviderViewModels: []
      })
      this.viewer = new Viewer(domEl, this.viewerOptions)
      this.viewer.scene.globe.depthTestAgainstTerrain = _.get(this.viewerOptions, 'depthTestAgainstTerrain', false)
      const backgroundColor = _.get(this.viewerOptions, 'backgroundColor')
      this.viewer.scene.backgroundColor = (backgroundColor ? createCesiumObject('Color', ...backgroundColor) : Color.BLACK)
      if (this.viewer.scene.globe) {
        const baseColor = _.get(this.viewerOptions, 'baseColor')
        this.viewer.scene.globe.baseColor = (baseColor ? createCesiumObject('Color', ...baseColor) : Color.BLACK)
        const undergroundColor = _.get(this.viewerOptions, 'undergroundColor')
        this.viewer.scene.globe.undergroundColor = (undergroundColor ? createCesiumObject('Color', ...undergroundColor) : Color.BLACK)
      }

      // Enable picking for primitives. Usefull for primitives selection with post processing
      if (!_.has(Cesium.Primitive.prototype, 'pickIds')) {
        Object.defineProperties(Cesium.Primitive.prototype, {
          pickIds: {
            get: function () {
              return this._pickIds
            },
            set: function (value) {
              this._pickIds = value
            }
          }
        })
      }

      // Cesium pre-render callback used to update moving materials (animated walls/corridors)
      this.viewer.scene.preRender.addEventListener(() => {
        if (!this.cesiumMaterials) return
        _.forEach(this.cesiumMaterials, m => {
          if (!m.material.uniforms.offset) return
          if (!m.startTime) m.startTime = Date.now()

          const elapsed = (Date.now() - m.startTime) * 0.001
          if (m.animationSpeed) {
            const loopDuration = (m.length / m.material.uniforms.repeat.x) / m.animationSpeed
            m.material.uniforms.offset.x = (elapsed % loopDuration) / loopDuration
          }
        })
      })

      // Debug mode ?
      // this.viewerOptions.debug = true
      if (this.viewerOptions.debug) this.viewer.extend(viewerCesiumInspectorMixin)
      // Cesium always create a default provider when a globe is used
      if (this.viewer.scene.imageryLayers) this.viewer.scene.imageryLayers.removeAll()
      // Add defaults handler
      this.registerCesiumHandler(this.getDefaultPickHandler, 'MOUSE_MOVE')
      this.registerCesiumHandler(this.getDefaultPickHandler, 'LEFT_CLICK')
      this.registerCesiumHandler(this.getDefaultPickHandler, 'RIGHT_CLICK')
      this.viewer.camera.moveStart.addEventListener(this.onCameraMoveStart)
      this.viewer.camera.moveEnd.addEventListener(this.onCameraMoveEnd)
      this.viewer.camera.percentageChanged = this.viewerOptions.cameraMoveEventPercentage
      this.viewer.camera.changed.addEventListener(this.onCameraChanged)
      // Remove default Cesium handlers
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK)
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
      this.viewBounds = new Rectangle()
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
      processedOptions.cesium.iconUrl = buildModuleUrl(processedOptions.iconUrl)
      // Copy generic options
      processedOptions.cesium.name = processedOptions.name
      processedOptions.cesium.attribution = processedOptions.attribution
      return processedOptions
    },
    async createCesiumLayer (options) {
      let cesiumOptions = options.cesium || options
      // Convert required objects
      cesiumOptions = this.convertToCesiumObjects(cesiumOptions)
      let args = [cesiumOptions]
      let provider, createFunction, isImageryProvider
      if (cesiumOptions.type === '3DTileset') {
        provider = createFunction = 'Cesium3DTileset.fromUrl'
        args = [cesiumOptions.url].concat([_.omit(cesiumOptions, ['url', 'style'])])
      } else if (isTerrainLayer(cesiumOptions)) {
        if (cesiumOptions.type === 'Ellipsoid') {
          provider = 'EllipsoidTerrainProvider'
        } else if (cesiumOptions.url || cesiumOptions.assetId) {
          provider = createFunction = (cesiumOptions.url ? 'CesiumTerrainProvider.fromUrl' : 'CesiumTerrainProvider.fromIonAssetId')
          args = [cesiumOptions.url || cesiumOptions.assetId].concat([_.omit(cesiumOptions, ['url', 'assetId'])])
        } else {
          // If no url/asset id given will use default terrain creation function createWorldTerrainAsync()
          provider = createFunction = 'createWorldTerrainAsync'
        }
      } else {
        provider = cesiumOptions.type
        // Handle specific case of built-in creation functions
        createFunction = `create${provider}Async`
        if (_.get(Cesium, createFunction)) {
          provider = createFunction
        } else {
          isImageryProvider = true
          provider += 'ImageryProvider'
          // Some providers also have built-in creation functions
          createFunction = `${provider}.fromUrl`
          if (_.get(Cesium, createFunction)) {
            provider = createFunction
            args = [cesiumOptions.url].concat([_.omit(cesiumOptions, ['url'])])
          }
        }
      }
      const Constructor = _.get(Cesium, provider)
      if (!Constructor) return
      // Built-in creation function or class constructor ?
      if (provider === createFunction) provider = await Constructor(...args)
      else provider = new Constructor(...args)
      // Not possible to set style as constructor options for tile sets
      if ((cesiumOptions.type === '3DTileset') && _.has(cesiumOptions, 'style')) provider.style = _.get(cesiumOptions, 'style')
      return (isImageryProvider ? new ImageryLayer(provider) : provider)
    },
    registerCesiumConstructor (constructor) {
      this.cesiumFactory.push(constructor)
    },
    registerCesiumHandler (handler, eventType) {
      if (!this.cesiumHandler) this.cesiumHandler = new ScreenSpaceEventHandler(this.viewer.scene.canvas)
      const originalEvent = convertCesiumHandlerEvent(eventType)
      this.cesiumHandler.setInputAction((event) => handler(Object.assign(event, { originalEvent })),
        ScreenSpaceEventType[eventType])
    },
    unregisterCesiumHandler (eventType) {
      this.cesiumHandler.removeInputAction(ScreenSpaceEventType[eventType])
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
      layer = layer || await this.createCesiumLayer(processedOptions)
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
      } else if (cesiumLayer instanceof ImageryLayer) {
        return this.viewer.scene.imageryLayers.contains(cesiumLayer)
      } else if (cesiumLayer instanceof Cesium3DTileset) {
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
      } else if (cesiumLayer instanceof ImageryLayer) {
        this.viewer.scene.imageryLayers.add(cesiumLayer)
      } else if (cesiumLayer instanceof Cesium3DTileset) {
        cesiumLayer.show = true
        if (!this.viewer.scene.primitives.contains(cesiumLayer)) this.viewer.scene.primitives.add(cesiumLayer)
      } else { // Entity data source otherwise
        // Handle potential custom primitives
        for (const [id, custom] of cesiumLayer.primitives)
          custom.primitive.show = true
        this.viewer.dataSources.add(cesiumLayer)
      }
      layer.isVisible = true
      this.onLayerShown(layer, cesiumLayer)
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
      } else if (cesiumLayer instanceof ImageryLayer) {
        this.viewer.scene.imageryLayers.remove(cesiumLayer, false)
      } else if (cesiumLayer instanceof Cesium3DTileset) {
        cesiumLayer.show = false
      } else { // Entity data source otherwise
        // Hide custom primitives before removing the data source
        for (const [id, custom] of cesiumLayer.primitives)
          custom.primitive.show = false
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
    async addGeoJsonLayer (layerSpec, geoJson, zoom) {
      if (!generateLayerDefinition(layerSpec, geoJson)) return
      // Create an empty layer
      await this.addLayer(layerSpec)
      // Update the layer with the geoJson content
      await this.updateLayer(layerSpec.name, geoJson)
      // Zoom to the layer
      if (zoom) {
        if (geoJson.bbox) this.zoomToBBox(geoJson.bbox)
        else this.zoomToLayer(layerSpec.name)
      }
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
      if (cesiumLayer instanceof Cesium3DTileset) {
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
      if (!this.isLayerVisible(name)) {
        // Only lookup geojson cache when layer is not visible
        // otherwise use toGeoJSON() on the layer to get most up to date content.
        const cachedGeojson = this.geojsonCache[name]
        if (cachedGeojson) return cachedGeojson
      }

      const layer = this.getCesiumLayerByName(name)
      if (!layer.entities) return
      const geoJson = await convertEntitiesToGeoJson(layer.entities)
      return geoJson
    },
    zoomToBounds (bounds, heading = 0, pitch = -90, roll = 0, duration = 0) {
      this.viewer.camera.flyTo({
        destination: Array.isArray(bounds) // Assume Cesium rectangle object if not array
          ? Rectangle.fromDegrees(bounds[0][1], bounds[0][0], bounds[1][1], bounds[1][0])
          : bounds,
        orientation: {
          heading: CesiumMath.toRadians(heading),
          pitch: CesiumMath.toRadians(pitch),
          roll: CesiumMath.toRadians(roll)
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
    center (longitude, latitude, altitude, heading = 0, pitch = -90, roll = 0, options = {}) {
      const center = this.viewer.camera.positionCartographic
      const duration = _.get(options, 'duration', 0)
      // This is the "base" frame, position with orientation in east north up frame at position
      const destination = Cartesian3.fromDegrees(longitude, latitude, altitude || center.height)
      const orientation = new HeadingPitchRoll(
        CesiumMath.toRadians(heading),
        CesiumMath.toRadians(pitch),
        CesiumMath.toRadians(roll))
      // An offset can be provided relative to the base frame as an additional translation/rotation
      // Typically the base frame can be set to "follow" a vehicle with its GPS position + heading.
      // Then an offset can be used to take driver's position into account relative to the GPS,
      // and simulate the moving head of the driver with an additional rotation
      const destinationOffset = new Cartesian3(
        _.get(options, 'offset.x', 0),
        _.get(options, 'offset.y', 0),
        _.get(options, 'offset.z', 0))
      const orientationOffset = new HeadingPitchRoll(
        CesiumMath.toRadians(_.get(options, 'offset.heading', 0)),
        CesiumMath.toRadians(_.get(options, 'offset.pitch', 0)),
        CesiumMath.toRadians(_.get(options, 'offset.roll', 0)))
      const target = {
        destination,
        orientation: {
          heading: orientation.heading,
          pitch: orientation.pitch,
          roll: orientation.roll
        },
        duration
      }
      if (duration) this.viewer.camera.flyTo(target)
      else this.viewer.camera.setView(target)
      this.viewer.camera.move(this.viewer.camera.right, destinationOffset.x)
      this.viewer.camera.move(this.viewer.camera.direction, destinationOffset.y)
      this.viewer.camera.move(this.viewer.camera.up, destinationOffset.z)
      this.viewer.camera.look(this.viewer.camera.up, orientationOffset.heading)
      this.viewer.camera.look(this.viewer.camera.direction, orientationOffset.pitch)
      this.viewer.camera.look(this.viewer.camera.right, orientationOffset.roll)
      if (this.viewerOptions.debug) {
        const baseQuaternion = Transforms.headingPitchRollQuaternion(destination, orientation, Ellipsoid.WGS84, Transforms.eastNorthUpToFixedFrame)
        const cameraQuaternion = Transforms.headingPitchRollQuaternion(this.viewer.camera.positionWC,
          new HeadingPitchRoll(this.viewer.camera.heading, this.viewer.camera.pitch, this.viewer.camera.roll), Ellipsoid.WGS84, Transforms.eastNorthUpToFixedFrame)
        if (this.baseFrameDebug) {
          this.baseFrameDebug.modelMatrix = Matrix4.fromRotationTranslation(Matrix3.fromQuaternion(baseQuaternion), destination)
          this.finalFrameDebug.modelMatrix = Matrix4.fromRotationTranslation(Matrix3.fromQuaternion(cameraQuaternion), this.viewer.camera.positionWC)
        } else {
          this.baseFrameDebug = new DebugModelMatrixPrimitive({
            modelMatrix : Matrix4.fromRotationTranslation(Matrix3.fromQuaternion(baseQuaternion), destination),
            length : 25,
            width : 5
          })
          this.viewer.scene.primitives.add(this.baseFrameDebug)
          this.finalFrameDebug = new DebugModelMatrixPrimitive({
            modelMatrix : Matrix4.fromRotationTranslation(Matrix3.fromQuaternion(cameraQuaternion), this.viewer.camera.positionWC),
            length : 25,
            width : 5
          })
          this.viewer.scene.primitives.add(this.finalFrameDebug)
        }
        // As we don't want to continue tracking the camera after we need to recreate one each time
        if (this.cameraDebug) this.viewer.scene.primitives.remove(this.cameraDebug)
        this.cameraDebug = new DebugCameraPrimitive({
          camera : this.viewer.camera,
          color : Cesium.Color.YELLOW,
          updateOnChange: false
        })
        this.viewer.scene.primitives.add(this.cameraDebug)
      }
    },
    getCenter () {
      const center = this.viewer.camera.positionCartographic
      return {
        longitude: CesiumMath.toDegrees(center.longitude),
        latitude: CesiumMath.toDegrees(center.latitude),
        altitude: center.height
      }
    },
    getBounds () {
      const bounds = this.viewer.camera.computeViewRectangle(this.viewer.scene.globe.ellipsoid, this.viewBounds)
      const south = CesiumMath.toDegrees(bounds.south)
      const west = CesiumMath.toDegrees(bounds.west)
      const north = CesiumMath.toDegrees(bounds.north)
      const east = CesiumMath.toDegrees(bounds.east)
      return [[south, west], [north, east]]
    },
    getCamera () {
      const position = this.viewer.camera.positionCartographic
      return {
        longitude: CesiumMath.toDegrees(position.longitude),
        latitude: CesiumMath.toDegrees(position.latitude),
        altitude: position.height,
        heading: CesiumMath.toDegrees(this.viewer.camera.heading),
        pitch: CesiumMath.toDegrees(this.viewer.camera.pitch),
        roll: CesiumMath.toDegrees(this.viewer.camera.roll),
        fovy: this.viewer.camera.frustum.fovy,
        viewMatrix: this.viewer.camera.viewMatrix,
        inverseViewMatrix: this.viewer.camera.inverseViewMatrix
      }
    },
    getAnimatedHeading (timestamp) {
      if (!this.headingAnimation.startTime) this.headingAnimation.startTime = timestamp
      const { duration, startTime, easing, startHeading, endHeading } = this.headingAnimation
      const elapsed = timestamp - startTime
      const percent = Math.abs(elapsed / (1000 * duration))
      if (percent > 1) {
        return endHeading
      }

      const easingFunction = _.get(easing, 'function', 'cubicBezier')
      const easingParameters = _.get(easing, 'parameters', [])
      const percentHeading = maths[easingFunction](percent, ...easingParameters)

      return CesiumMath.lerp(
        startHeading,
        endHeading,
        percentHeading
      )
    },
    onEntityTracked (time) {
      const getSmallestAngle = (start, end) => {
        let diff = (end - start + Math.PI) % (2 * Math.PI)
        if (diff < 0) diff += 2 * Math.PI
        return diff - Math.PI
      }

      if (this.viewerOptions.debug) {
        if (this.trackedFrameDebug) {
          this.trackedFrameDebug.modelMatrix = this.viewer.trackedEntity.computeModelMatrix(time)
        } else {
          this.trackedFrameDebug = new DebugModelMatrixPrimitive({
            modelMatrix: this.viewer.trackedEntity.computeModelMatrix(time),
            length: 25,
            width: 5
          })
          this.viewer.scene.primitives.add(this.trackedFrameDebug)
        }
      }

      if (!this.viewer.trackedEntity || !_.get(this.entityTrackingOptions, 'mode')) return
      const mode = this.entityTrackingOptions.mode
      const currentTime = Date.now()
      // If we are in free look mode, we don't want to force camera position
      if (mode === 'freeLook' && !_.get(this.entityTrackingOptions, 'resetHeading')) return

      const targetPosition = this.viewer.trackedEntity.position.getValue(time)
      const orientation = this.viewer.trackedEntity.orientation.getValue(time)
      if (!orientation) return

      const distance = _.get(this.entityTrackingOptions, 'distance', 10)
      const headingOffset = CesiumMath.toRadians(_.get(this.entityTrackingOptions, 'offset.heading', 0))
      const pitchOffset = CesiumMath.toRadians(_.get(this.entityTrackingOptions, 'offset.pitch', 0))
      const headingPitchRoll = HeadingPitchRoll.fromQuaternion(orientation)
      if (_.get(this.entityTrackingOptions, 'animate')) {
        if (!this.headingAnimation) {
          this.headingAnimation = {
            ...this.entityTrackingOptions,
            startTime: currentTime,
            startHeading: this.viewer.camera.heading - headingOffset,
            endHeading: mode === 'freeLook' ? 0 - headingOffset : headingPitchRoll.heading
          }

          // Fix endHeading to get shortest angle
          this.headingAnimation.endHeading = this.headingAnimation.startHeading + getSmallestAngle(this.headingAnimation.startHeading, this.headingAnimation.endHeading)
        } else if (mode === 'followOrientation') {
          // If we are already animating, update the end heading
          this.headingAnimation.endHeading = this.headingAnimation.startHeading + getSmallestAngle(this.headingAnimation.startHeading, headingPitchRoll.heading)
        }
      }

      // Compute heading with animation
      let heading = 0
      if (_.get(this.entityTrackingOptions, 'animate')) {
        heading = this.getAnimatedHeading(currentTime)
        if (heading === this.headingAnimation.endHeading) {
          _.set(this.entityTrackingOptions, 'animate', false)
          _.set(this.entityTrackingOptions, 'resetHeading', false)
          this.headingAnimation = null
        }
      } else if (mode === 'followOrientation') {
        heading = headingPitchRoll.heading
      }

      const position = new Cartesian3(
        targetPosition.x + _.get(this.entityTrackingOptions, 'offset.x', 0),
        targetPosition.y + _.get(this.entityTrackingOptions, 'offset.y', 0),
        targetPosition.z + _.get(this.entityTrackingOptions, 'offset.z', 0)
      )
      const cameraOffset = new HeadingPitchRange(
        heading + headingOffset,
        pitchOffset,
        distance
      )

      this.viewer.camera.lookAt(new Cartesian3(position.x, position.y, position.z), cameraOffset)
    },
    trackEntity (entityId, options = {}) {
      let newEntity = null
      // Check for entities directly added to the viewer
      this.viewer.entities.values.forEach(entity => {
        if (entityId === entity.id) {
          // Make the camera track this entity
          newEntity = entity
        }
      })
      // Check for external data sources
      for (let i = 0; i < this.viewer.dataSources.length; i++) {
        const source = this.viewer.dataSources.get(i)
        source.entities.values.forEach(entity => {
          if (entityId === entity.id) {
            // Make the camera track this entity
            newEntity = entity
          }
        })
      }

      if (!newEntity) return
      this.entityTrackingOptions = options
      _.set(this.entityTrackingOptions, 'animate', true)
      if (newEntity === this.viewer.trackedEntity) return

      // Untrack previous entity
      this.untrackEntity()
      this.viewer.trackedEntity = newEntity
      this.viewer.clock.onTick.addEventListener(this.onEntityTracked)
    },
    untrackEntity () {
      if (this.viewer.trackedEntity) {
        if (this.trackedFrameDebug) this.viewer.scene.primitives.remove(this.trackedFrameDebug)
        this.viewer.clock.onTick.removeEventListener(this.onEntityTracked)
      }
      this.viewer.trackedEntity = null
    },
    async showUserLocation () {
      if (Geolocation.hasLocation()) {
        const longitude = Geolocation.getLongitude()
        const latitude = Geolocation.getLatitude()
        this.center(longitude, latitude)
        const pinBuilder = new PinBuilder()
        const canvas = await pinBuilder.fromMakiIconId('marker', Color.fromCssColorString(getCssVar('primary')), 48)
        this.userLocationEntity = this.viewer.entities.add({
          name: 'user-location',
          position: Cartesian3.fromDegrees(longitude, latitude),
          billboard: {
            image: canvas.toDataURL(),
            verticalOrigin: VerticalOrigin.BOTTOM
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
          position = BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center
        } else if (entity.polyline) {
          position = BoundingSphere.fromPoints(entity.polyline.positions.getValue()).center
        } else if (entity.wall) {
          position = BoundingSphere.fromPoints(entity.wall.positions.getValue()).center
        }
        if (position) Ellipsoid.WGS84.scaleToGeodeticSurface(position, position)
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
        pickedPosition = Cartographic.fromCartesian(pickedPosition)
        const longitude = CesiumMath.toDegrees(pickedPosition.longitude)
        const latitude = CesiumMath.toDegrees(pickedPosition.latitude)
        // This ensure we can use similar handlers than for Leaflet
        emittedEvent.latlng = [latitude, longitude]
        emittedEvent.latlng.lng = longitude
        emittedEvent.latlng.lat = latitude
      }
      const pickedObject = this.viewer.scene.pick(event.endPosition || event.position)
      if (pickedObject) {
        emittedEvent.target = pickedObject.id || pickedObject.primitive.id
        if (emittedEvent.target instanceof Entity) {
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
            if (typeof exportKml === 'function') {
              const selection = new EntityCollection()
              selection.add(emittedEvent.target)
              const geoJson = await convertEntitiesToGeoJson(selection)
              if (geoJson.features.length > 0) {
                Object.assign(feature, geoJson.features[0])
              }
            }
            if (!feature.geometry) {
              const position = Cartographic.fromCartesian(emittedEvent.target.position
                ? emittedEvent.target.position.getValue(0)
                : emittedEvent.pickedPosition)
              feature.geometry = {
                type: 'Point',
                coordinates: [CesiumMath.toDegrees(position.longitude), CesiumMath.toDegrees(position.latitude)]
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
    },
    getCameraEllipsoidTarget () {
      const windowPosition = new Cesium.Cartesian2(this.viewer.container.clientWidth / 2, this.viewer.container.clientHeight / 2)
      const pickedPosition = this.viewer.camera.pickEllipsoid(windowPosition)
      if (!pickedPosition) return null
      const pickedPositionCartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(pickedPosition)
      return {
        longitude: CesiumMath.toDegrees(pickedPositionCartographic.longitude),
        latitude: CesiumMath.toDegrees(pickedPositionCartographic.latitude),
        altitude: pickedPositionCartographic.height
      }
    },
    onCameraMoveStart () {
      let target = this.getCameraEllipsoidTarget()
      if (target) {
        target = { latlng: { lng: target.longitude, lat: target.latitude }, altitude: target.altitude }
      }
      // Mimic Leaflet events
      this.$engineEvents.emit('movestart', this.viewerOptions, target)
    },
    onCameraMoveEnd () {
      let target = this.getCameraEllipsoidTarget()
      if (target) {
        target = { latlng: { lng: target.longitude, lat: target.latitude }, altitude: target.altitude }
      }
      // Mimic Leaflet events
      this.$engineEvents.emit('moveend', this.viewerOptions, target)
    },
    onCameraChanged () {
      let target = this.getCameraEllipsoidTarget()
      if (target) {
        target = { latlng: { lng: target.longitude, lat: target.latitude }, altitude: target.altitude }
      }
      // Mimic Leaflet events
      this.$engineEvents.emit('move', this.viewerOptions, target)
    },
    getPostProcessStage (effect) {
      return this.cesiumPostProcessStages[effect]
    },
    setupPostProcess (effect, options = { enabled: true }) {
      let stage = this.cesiumPostProcessStages[effect]
      if (options.enabled) {
        if (!stage) {
          if (effect === 'desaturation') {
            const fs = `
    uniform sampler2D colorTexture;
    in vec2 v_textureCoordinates;
    void main() {
        vec4 color = texture(colorTexture, v_textureCoordinates);
        if (czm_selected()) {
            out_FragColor = color;
        } else {
            out_FragColor = vec4(czm_saturation(color.rgb, 0.0), color.a);
        }
    }
    `
            stage = this.viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({ fragmentShader: fs }))
            stage.selected = [] // Initialize empty selected set for postprocess.
            this.cesiumPostProcessStages[effect] = stage
          }
        }
      } else {
        if (stage) {
          this.viewer.scene.postProcessStages.remove(stage)
          delete this.cesiumPostProcessStages[effect]
        }
      }
    }
  },
  created () {
    this.cesiumLayers = {}
    this.cesiumFactory = []
    this.cesiumMaterials = []
    this.cesiumPostProcessStages = {}
    // TODO: no specific marker, just keep status
    this.userLocation = false
    // Internal event bus
    this.$engineEvents = new Emitter()
  },
  beforeUnmount () {
    this.clearLayers()
    this.viewer.camera.moveStart.removeEventListener(this.onCameraMoveStart)
    this.viewer.camera.moveEnd.removeEventListener(this.onCameraMoveEnd)
    this.unregisterCesiumHandler('MOUSE_MOVE')
    this.unregisterCesiumHandler('LEFT_CLICK')
    this.unregisterCesiumHandler('RIGHT_CLICK')
  },
  unmounted () {
    this.viewer.destroy()
  }
}
