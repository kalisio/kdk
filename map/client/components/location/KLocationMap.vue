<template>
  <div class="fit column">
    <!-- Map container -->
    <div
      :ref="mapRefCreated"
      class="col"
      style="fontWeight: normal; zIndex: 0; position: relative"
    >
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
  </div>
</template>

<script>
import _ from 'lodash'
import L from 'leaflet'
import centroid from '@turf/centroid'
import { getCssVar } from 'quasar'
import { KPanel } from '../../../../core/client/components'
import * as mapMixins from '../../mixins/map'
import { Geolocation } from '../../geolocation'
import { setEngineJwt, formatUserCoordinates, bindLeafletEvents, unbindLeafletEvents } from '../../utils'

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
    mapOptions: {
      type: Object,
      default: () => {
        return {
          maxBounds: [[-90, -180], [90, 180]],
          maxBoundsViscosity: 0.25,
          minZoom: 2,
          maxZoom: 18,
          zoom: 10
        }
      }
    },
    markerStyle: {
      type: Object,
      default: () => {
        return {
          iconClasses: 'fas fa-circle 0.5rem',
          markerColor: getCssVar('primary'),
          iconColor: '#FFFFFF',
          iconXOffset: -1,
          iconYOffset: 0
        }
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
  data () {
    return {
      location: this.defaultLocation()
    }
  },
  computed: {
    header () {
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
            label: this.location ? this.location.name : '',
            handler: this.recenter
          })
        }
        if (component === 'geolocate') {
          components.push({
            id: 'geolocate',
            icon: 'las la-crosshairs',
            handler: this.geolocate
          })
        }
        if (component === 'draw-point') {
          components.push({
            id: 'draw-marker',
            icon: 'las la-map-marker'
          })
        }
        if (component === 'draw-polyline') {
          components.push({
            id: 'draw-polyline',
            icon: 'las la-project-diagram'
          })
        }
        if (component === 'draw-polygon') {
          components.push({
            id: 'draw-polygon',
            icon: 'las la-draw-polygon'
          })
        }
      })
      return components
    }
  },
  watch: {
    modelValue: function () {
      this.location = this.modelValue
      console.log(this.location)
      this.refresh()
    },
    draggable: function () {
      this.refresh()
    }
  },
  methods: {
    defaultLocation () {
      const latitude = this.$store.get('geolocation.position.latitude', 0)
      const longitude = this.$store.get('geolocation.position.longitude', 0)
      return {
        name: formatUserCoordinates(latitude, longitude, this.$store.get('locationFormat', 'FFf')),
        latitude,
        longitude
      }
    },
    recenter () {
      if (this.drawLayer) {
        this.map.fitBounds(this.drawLayer.getBounds())
      } else {
        const longitude = (_.has(this.location, 'longitude')
          ? _.get(this.location, 'longitude')
          : _.get(this.location, 'coordinates[0]'))
        const latitude = (_.has(this.location, 'latitude')
          ? _.get(this.location, 'latitude')
          : _.get(this.location, 'coordinates[1]'))
        this.center(longitude, latitude, this.mapOptions.zoom)
      }
    },
    async geolocate () {
      await Geolocation.update()
      const position = this.$store.get('geolocation.position')
      if (position) {
        console.log(position)
        this.$emit('update:modelValue', Object.assign({}, position, { name: formatUserCoordinates(position.latitude, position.longitude, this.$store.get('locationFormat', 'FFf')) }))
      }
    },
    clear () {
      if (this.marker) {
        this.marker.off('drag', this.onLocationDragged)
        this.marker.removeFrom(this.map)
        this.marker = null
      }
      if (this.drawLayer) {
        this.map.removeLayer(this.drawLayer)
        this.drawLayer = null
      }
      this.map.pm.disableDraw()
      unbindLeafletEvents(this.map, ['pm:create'])
      this.map.pm.setGlobalOptions({ layerGroup: null })
    },
    refresh () {
      if (!this.mapReady) return
      // No location ?
      console.log(this.location)
      const hasLongitude = _.has(this.location, 'longitude')
      const hasLatitude = _.has(this.location, 'latitude')
      const hasGeometry = _.has(this.location, 'coordinates')
      console.log(hasGeometry, hasLatitude, hasLongitude)
      if (hasGeometry || (hasLongitude && hasLatitude)) {
        // No default marker in draw mode
        // if (this.drawable && !hasGeometry) return

        // GeoJson geometry or simple location ?
        if (_.has(this.location, 'type') && (_.get(this.location, 'type') !== 'Point')) {
          this.drawLayer = L.geoJson({ type: 'Feature', geometry: this.location })
          this.map.addLayer(this.drawLayer)
        } else {
          const longitude = (hasLongitude
            ? _.get(this.location, 'longitude')
            : _.get(this.location, 'coordinates[0]'))
          const latitude = (hasLatitude
            ? _.get(this.location, 'latitude')
            : _.get(this.location, 'coordinates[1]'))

          this.marker = L.marker([latitude, longitude], {
            icon: L.icon.fontAwesome(this.markerStyle),
            draggable: this.draggable,
            pmIgnore: true
          })
          this.marker.addTo(this.map)
          if (this.draggable) this.marker.on('drag', this.onLocationDragged)
        }

        // Center the map
        this.recenter()
      } else {
        this.clear()
      }
    },
    async onGeolocate () {
      await this.geolocate()
      this.refresh()
    },
    onLocationDragged () {
      /* this.location.name = formatUserCoordinates(this.marker.getLatLng().lat, this.marker.getLatLng().lng, this.$store.get('locationFormat', 'FFf'))
      if (_.has(this.location, 'type') && (_.get(this.location, 'type') === 'Point')) {
        _.set(this.location, 'coordinates[0]', this.marker.getLatLng().lng)
        _.set(this.location, 'coordinates[1]', this.marker.getLatLng().lat)
      } else {
        this.location.longitude = this.marker.getLatLng().lng
        this.location.latitude = this.marker.getLatLng().lat
      } */
      const location = {
        name: formatUserCoordinates(this.marker.getLatLng().lat, this.marker.getLatLng().lng, this.$store.get('locationFormat', 'FFf')),
        latitude: this.marker.getLatLng().lat,
        longitude: this.marker.getLatLng().lng
      }
      this.$emit('update:modelValue', location)
    },
    startDraw (shape) {
      // Clear any previous edition
      this.clear()
      this.drawLayer = L.geoJson()
      this.map.addLayer(this.drawLayer)
      this.map.pm.setGlobalOptions({ layerGroup: this.drawLayer })
      this.map.pm.enableDraw(shape, {
        snappable: true,
        snapDistance: 20
      })
      bindLeafletEvents(this.map, ['pm:create'], this)
    },
    stopDraw () {
      const geoJson = this.drawLayer.toGeoJSON()
      // The location is the feature geometry
      const feature = _.get(geoJson, 'features[0]', {})
      this.location = feature.geometry
      // Compatibility with GPS-based localization
      const location = centroid(feature)
      this.location.name = formatUserCoordinates(
        _.get(location, 'geometry.coordinates[1]'), _.get(location, 'geometry.coordinates[0]'),
        this.$store.get('locationFormat', 'FFf'))
      this.$emit('update:modelValue', this.location)
    },
    onStartLine () {
      this.startDraw('Line')
    },
    onStartPolygon () {
      this.startDraw('Polygon')
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
    async onMapResized (size) {
      this.refreshMap()
    },
    mapRefCreated (container) {
      if (container) {
        if (!this.mapReady) {
          this.setupMap(container, this.mapOptions)
          this.mapReady = true
          this.refreshBaseLayer()
          this.refresh()
        }
      }
    }
  },
  async mounted () {
    // Initialize component
    this.location = this.modelValue
    if (!this.location) await this.geolocate()
    this.refresh()
    this.$engineEvents.on('pm:create', this.stopDraw)
  },
  beforeUnmount () {
    this.$engineEvents.off('pm:create', this.stopDraw)
    this.clear()
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
