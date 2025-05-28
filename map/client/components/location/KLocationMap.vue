<template>
  <div :ref="mapRefCreated" class="fit">
    <q-resize-observer @resize="refreshMap" />
    <!-- Map header -->
    <div class="row justify-center">
      <KPanel
        id="header"
        :content="header"
        class="k-location-map-toolbar"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import L from 'leaflet'
import config from 'config'
import centroid from '@turf/centroid'
import { KPanel } from '../../../../core/client/components'
import { api } from '../../../../core/client/api.js'
import * as mapMixins from '../../mixins/map'
import { Geolocation } from '../../geolocation.js'
import { useCatalog, useCurrentActivity } from '../../composables'
import {
  coordinatesToGeoJSON, formatUserCoordinates,
  bindLeafletEvents, unbindLeafletEvents, getFeatureStyleType,
  getDefaultPointStyle, getDefaultLineStyle, getDefaultPolygonStyle, createMarkerFromPointStyle
} from '../../utils.map.js'

export default {
  components: {
    KPanel
  },
  emits: ['update:modelValue'],
  mixins: [mapMixins.baseMap],
  props: {
    modelValue: {
      type: Object,
      default: () => null
    },
    engineOptions: {
      type: Object,
      default: () => {
        return _.get(config, 'engines.leaflet')
      }
    },
    tools: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    header () {
      const components = []
      _.forEach(this.tools, component => {
        if (component === 'separator') {
          components.push({
            component: 'QSeparator',
            vertical: true,
            color: 'lighgrey'
          })
        }
        if (component === 'location') {
          components.push({
            id: 'location',
            icon: 'img:kdk/center-on-feature.svg',
            tooltip: 'KLocationMap.RECENTER_MAP',
            label: _.get(this.modelValue, 'properties.name', _.get(this.modelValue, 'name', '')),
            handler: this.recenter
          })
        }
        if (component === 'geolocate') {
          components.push({
            id: 'geolocate',
            icon: 'las la-crosshairs',
            tooltip: 'KLocationMap.LOCATE_ME',
            handler: this.geolocate
          })
        }
        if (component === 'draw-point') {
          components.push({
            id: 'draw-marker',
            icon: 'las la-map-marker',
            tooltip: 'KLocationMap.DRAW_POINT',
            propagate: false,
            handler: () => this.startDraw('Marker')
          })
        }
        if (component === 'draw-polyline') {
          components.push({
            id: 'draw-polyline',
            icon: 'las la-project-diagram',
            tooltip: 'KLocationMap.DRAW_LINE',
            propagate: false,

            handler: () => this.startDraw('Line')
          })
        }
        if (component === 'draw-rectangle') {
          components.push({
            id: 'draw-rectangle',
            icon: 'las la-vector-square',
            tooltip: 'KLocationMap.DRAW_RECTANGLE',
            propagate: false,
            handler: () => this.startDraw('Rectangle')
          })
        }
        if (component === 'draw-polygon') {
          components.push({
            id: 'draw-polygon',
            icon: 'las la-draw-polygon',
            tooltip: 'KLocationMap.DRAW_POLYGON',
            propagate: false,
            handler: () => this.startDraw('Polygon')
          })
        }
      })
      return components
    },
    interactive () {
      return !_.isEmpty(this.tools)
    },
    draggable () {
      return _.indexOf(this.tools, 'draw-point') !== -1
    },
    allowGeolocation () {
      return !_.isNil(this.header.geolocate)
    }
  },
  watch: {
    modelValue: function () {
      this.refresh()
    }
  },
  methods: {
    async geolocate () {
      await Geolocation.update()
      if (Geolocation.hasLocation()) {
        this.update(Geolocation.getLatitude(), Geolocation.getLongitude())
      }
    },
    recenter () {
      if (!this.locationLayer) return
      if (this.locationLayer instanceof L.Marker) {
        this.map.panTo(this.locationLayer.getLatLng())
      } else {
        this.map.fitBounds(this.locationLayer.getBounds(), { maxZoom: 12 })
      }
    },
    refresh () {
      if (!this.mapReady) return
      // disable handler if non interactive
      if (!this.interactive) {
        _.forEach(this.map._handlers, handler => { handler.disable() })
      }
      // clear the existing layer if any
      if (this.locationLayer) {
        this.map.removeLayer(this.locationLayer)
        this.locationLayer = null
      }
      // update the location 
      this.location = this.modelValue
      // check wether it holds some features
      if (!this.location) return
      const featureType = this.location.type
      if (featureType === 'FeatureCollection' && _.isEmpty(this.location.features)) return
      // backward compatibility with old format with only lat/lon or a geometry, not a feature
      if (featureType !== 'Feature' && featureType !== 'FeatureCollection') {
        const feature = { type: 'Feature', geometry: this.location, properties: { name: this.location.name } }
        if (!_.has(feature, 'geometry.type')) feature.geometry = { type: 'Point', coordinates: [this.location.longitude, this.location.latitude] }
        this.location = feature
      }
      // create a new layer
      const geometryType = _.get(this.location, 'geometry.type')
      if (geometryType === 'Point') {
        const coordinates = _.get(this.location, 'geometry.coordinates')
        const style = _.get(this.location, 'style', _.get(this.engineOptions, 'style.location.point'))
        this.locationLayer = createMarkerFromPointStyle([coordinates[1], coordinates[0]],
          Object.assign({ interactive: this.draggable, draggable: this.draggable, pmIgnore: true }, style))
        if (this.draggable) this.locationLayer.on('dragend', this.onLocationDragged)
      } else {
        this.locationLayer = L.geoJson(this.location, {
          interactive: false,
          style: (feature) => {
            const styleType = getFeatureStyleType(feature)
            if (!styleType) {
              logger.warn(`[KDK] cannot get a style type from the feature of geometry type ${feature.geometry.type}`)
              return
            }
            if (styleType === 'line') return getDefaultLineStyle(feature, null, _.get(this.engineOptions, 'style.location.line'))
            return getDefaultPolygonStyle(feature, null, _.get(this.engineOptions, 'style.location.polygon'))
          },
          pointToLayer: (feature, latlng) => {
            const style = getDefaultPointStyle(feature, null, _.get(this.engineOptions, 'style.location.point'))
            if (!style) {
              logger.warn('[KDK] cannot generate point style from a feature')
              return
            }
            return createMarkerFromPointStyle(latlng, style)
          }
        })
      }
      this.locationLayer.addTo(this.map)
      this.recenter()
    },
    onLocationDragged () {
      const latLng = this.locationLayer.getLatLng()
      const newLocation = coordinatesToGeoJSON(latLng.lat, latLng.lng, this.$store.get('locationFormat', 'FFf'))
      this.$emit('update:modelValue', newLocation)
    },
    startDraw (shape) {
      // clear location layer
      if (this.locationLayer) {
        this.map.removeLayer(this.locationLayer)
        this.locationLayer = null
      }
      // create draw layer
      this.drawLayer = L.geoJson()
      this.map.addLayer(this.drawLayer)
      // set draw mode
      this.map.pm.setGlobalOptions({ layerGroup: this.drawLayer })
      this.map.pm.enableDraw(shape, {
        snappable: true,
        snapDistance: 20
      })
      bindLeafletEvents(this.map, ['pm:create'], this)
    },
    stopDraw () {
      this.map.pm.disableDraw()
      // retrieve the feature
      const geoJson = this.drawLayer.toGeoJSON()
      const feature = _.get(geoJson, 'features[0]')
      const geometry = feature.geometry.type
      if (geometry === 'Point') {
        const coords = feature.geometry.coordinates
        feature.properties.name = formatUserCoordinates(coords[1], coords[0], this.$store.get('locationFormat', 'FFf'))
      } else {
        const prefix = this.$t(geometry === 'Polygon' ? 'KLocationMap.ZONE' : 'KLocationMap.PATH')
        const coords = _.get(centroid(feature), 'geometry.coordinates')
        feature.properties.name = `${prefix} (${formatUserCoordinates(coords[1], coords[0], this.$store.get('locationFormat', 'FFf'))})`
      }
      this.$emit('update:modelValue', feature)
      // clear draw layer
      this.map.removeLayer(this.drawLayer)
      this.drawLayer = null
      // unset draw mode
      unbindLeafletEvents(this.map, ['pm:create'])
      this.map.pm.setGlobalOptions({ layerGroup: null })
    },
    async mapRefCreated (container) {
      if (container) {
        if (!this.mapReady) {
          // setup map
          logger.debug('[KDK] Create location map with viewer options', this.engineOptions.viewer)
          this.setupMap(container, this.engineOptions.viewer)
          this.mapReady = true
          // setup base layer
          const baseLayers = await this.getLayers({ type: 'BaseLayer' })
          if (baseLayers.length > 0) await this.addLayer(baseLayers[0])
          // setup location
          this.refresh()
        }
      }
    },
    getLocation () {
      return this.modelValue
    }
  },
  async mounted () {
    this.$engineEvents.on('pm:create', this.stopDraw)
  },
  beforeUnmount () {
    this.$engineEvents.off('pm:create', this.stopDraw)
    if (this.locationLayer) {
      this.map.removeLayer(this.locationLayer)
      this.locationLayer = null
    }
  },
  async setup () {
    // Get current project for activity if any
    const { getActivityProject } = useCurrentActivity({ selection: false, probe: false })
    const project = getActivityProject()
    // We expect the project object to expose the underlying API
    const planetApi = project && typeof project.getPlanetApi === 'function' ? project.getPlanetApi() : api
    // Use target catalog according to project and filtering options to get base layer
    const { getLayers } = useCatalog({
      project,
      layers: { type: 'BaseLayer', 'leaflet.isVisible': true },
      planetApi
    })
    // expose
    return {
      getLayers
    }
  }
}
</script>

<style lang="scss" scoped>
.k-location-map-toolbar {
  position: absolute;
  background-color: #FFFFFF;
  border: solid 1px lightgrey;
  border-radius: 3px;
  margin: 0 auto;
  z-index: 9999;
}
.k-location-map-toolbar:hover {
  border: solid 1px $primary;
}
</style>
