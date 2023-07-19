<template>
  <div class="fit column">
    <!-- Map container -->
    <div
      :ref="mapRefCreated"
      class="col"
    >
      <q-resize-observer @resize="refreshMap" />
      <!-- Map header -->
      <div class="row justify-center">
        <KPanel
          id="header"
          :content="headerComponents"
          class="k-location-map-toolbar"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import L from 'leaflet'
import config from 'config'
import centroid from '@turf/centroid'
import { KPanel } from '../../../../core/client/components'
import * as mapMixins from '../../mixins/map'
import { Geolocation } from '../../geolocation'
import { setEngineJwt, coordinatesToGeoJSON, formatUserCoordinates, bindLeafletEvents, unbindLeafletEvents } from '../../utils'

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
    header: {
      type: Array,
      default: () => []
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    headerComponents () {
      const components = []
      _.forEach(this.header, component => {
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
            icon: 'img:icons/kdk/center-on-feature.svg',
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
    allowGeolocation () {
      return !_.isNil(this.header.geolocate)
    }
  },
  watch: {
    modelValue: function () {
      this.refresh()
    },
    draggable: function () {
      this.refresh()
    }
  },
  methods: {
    async geolocate () {
      await Geolocation.update()
      const position = this.$store.get('geolocation.position')
      if (position) {
        this.update(position.latitude, position.longitude)
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
      // clear the existing layer if any
      if (this.locationLayer) {
        this.map.removeLayer(this.locationLayer)
        this.locationLayer = null
      }
      // update the location
      this.location = this.modelValue
      if (!this.location) return
      // backward compatibility with old format with only lat/lon or a geometry, not a feature
      if (this.location.type !== 'Feature') {
        const feature = { type: 'Feature', geometry: this.location, properties: { name: this.location.name } }
        if (!_.has(feature, 'geometry.type')) feature.geometry = { type: 'Point', coordinates: [this.location.longitude, this.location.latitude] }
        this.location = feature
      }
      // create a new layer
      const type = _.get(this.location, 'geometry.type')
      if (type === 'Point') {
        const coordinates = _.get(this.location, 'geometry.coordinates')
        this.locationLayer = L.marker([coordinates[1], coordinates[0]], {
          icon: L.icon.fontAwesome(this.engineOptions.pointStyle),
          draggable: this.draggable,
          pmIgnore: true
        })
        if (this.draggable) this.locationLayer.on('dragend', this.onLocationDragged)
      } else {
        this.locationLayer = L.geoJson(this.location)
      }
      this.locationLayer.addTo(this.map)
      // wait for the next tick to recenter the view
      this.$nextTick(() => this.recenter())
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
    async refreshBaseLayer () {
      const catalogService = this.$api.getService('catalog', '')
      // Get first visible base layer
      const response = await catalogService.find({ query: { type: 'BaseLayer', 'leaflet.isVisible': true } })
      if (response.data.length > 0) {
        const baseLayer = response.data[0]
        // Do we need to inject a token ?
        await setEngineJwt([baseLayer])
        this.addLayer(baseLayer)
      }
    },
    mapRefCreated (container) {
      if (container) {
        if (!this.mapReady) {
          this.setupMap(container, this.engineOptions.viewer)
          this.mapReady = true
          this.refreshBaseLayer()
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
