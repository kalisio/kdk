<template>
  <div class="fit column">
    <div v-if="toolbar" class="full-width row">
      <q-toolbar class="q-pl-sm q-pr-sm bg-accent text-white">
        <k-text-area :text="locationName" />
        <q-space />
        <q-btn v-if="drawable" icon="las la-road" flat round dense @click="onStartLine">
          <q-tooltip>
            {{ $t('KLocationMap.DRAW_LINE') }}
          </q-tooltip>
        </q-btn>
        <q-btn v-if="drawable" icon="las la-draw-polygon" flat round dense @click="onStartPolygon">
          <q-tooltip>
            {{ $t('KLocationMap.DRAW_POLYGON') }}
          </q-tooltip>
        </q-btn>
        <q-btn v-if="editable" icon="las la-crosshairs" flat round dense @click="onGeolocate">
          <q-tooltip>
            {{ $t('KLocationMap.LOCATE_BUTTON') }}
          </q-tooltip>
        </q-btn>
        <q-btn icon="las la-search-location" flat round dense @click="centerMap">
          <q-tooltip>
            {{ $t('KLocationMap.RECENTER_BUTTON') }}
          </q-tooltip>
        </q-btn>
        <q-btn v-if="closable" icon="las la-times" flat round dense @click="closeMap">
          <q-tooltip>
            {{ $t('KLocationMap.CLOSE_BUTTON') }}
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </div>
    <div :ref="configure" class="col" style="fontWeight: normal; zIndex: 0; position: relative">
      <q-resize-observer @resize="onMapResized" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import L from 'leaflet'
import centroid from '@turf/centroid'
import { getCssVar } from 'quasar'
import { KTextArea } from '../../../core/client/components'
import * as mapMixins from '../mixins/map'
import { Geolocation } from '../geolocation'
import { setGatewayJwt, formatUserCoordinates, bindLeafletEvents, unbindLeafletEvents } from '../utils'

export default {
  name: 'k-location-map',
  components: {
    KTextArea
  },
  emits: [
    'input',
    'close'
  ],
  mixins: [
    mapMixins.baseMap
  ],
  props: {
    value: {
      type: Object,
      default: () => {
        return null
      }
    },
    mapOptions: {
      type: Object,
      default: () => {
        return {
          maxBounds: [[-90, -180], [90, 180]],
          maxBoundsViscosity: 0.25,
          minZoom: 2,
          maxZoom: 18,
          zoom: 14
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
          iconXOffset: 1,
          iconYOffset: 0
        }
      }
    },
    editable: {
      type: Boolean,
      default: false
    },
    drawable: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: false
    },
    toolbar: {
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
    locationName () {
      return this.location ? this.location.name : ''
    }
  },
  watch: {
    value: function () {
      this.location = this.value
      this.refresh()
    },
    editable: function () {
      this.refresh()
    },
    drawable: function () {
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
    centerMap () {
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
    closeMap () {
      this.$emit('close', this.location)
    },
    async geolocate () {
      await Geolocation.update()
      const position = this.$store.get('geolocation.position')
      if (position) {
        this.location = {
          name: formatUserCoordinates(position.latitude, position.longitude, this.$store.get('locationFormat', 'FFf')),
          latitude: position.latitude,
          longitude: position.longitude
        }
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
      this.clear()
      // No location ?
      const hasLongitude = _.has(this.location, 'longitude')
      const hasLatitude = _.has(this.location, 'latitude')
      const hasGeometry = _.has(this.location, 'coordinates')
      if (hasGeometry || (hasLongitude && hasLatitude)) {
        // No default marker in draw mode
        if (this.drawable && !hasGeometry) return
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
            draggable: this.editable,
            pmIgnore: true
          })
          this.marker.addTo(this.map)
          if (this.editable) this.marker.on('drag', this.onLocationDragged)
        }

        // Center the map
        this.centerMap()
      }
    },
    async onGeolocate () {
      await this.geolocate()
      this.refresh()
    },
    onLocationDragged () {
      this.location.name = formatUserCoordinates(this.marker.getLatLng().lat, this.marker.getLatLng().lng, this.$store.get('locationFormat', 'FFf'))
      if (_.has(this.location, 'type') && (_.get(this.location, 'type') === 'Point')) {
        _.set(this.location, 'coordinates[0]', this.marker.getLatLng().lng)
        _.set(this.location, 'coordinates[1]', this.marker.getLatLng().lat)
      } else {
        this.location.longitude = this.marker.getLatLng().lng
        this.location.latitude = this.marker.getLatLng().lat
      }
      this.$emit('input', this.location)
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
      this.$emit('input', this.location)
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
        const gatewayToken = await this.$api.get('storage').getItem(this.$config('gatewayJwt'))
        if (gatewayToken) setGatewayJwt([baseLayer], gatewayToken)
        this.addLayer(baseLayer)
      }
    },
    async onMapResized (size) {
      this.refreshMap()
    },
    configure (container) {
      if (!container) return
      this.setupMap(container, this.mapOptions)
      this.refreshBaseLayer()
      this.refresh()
    }
  },
  async mounted () {
    // Initialize component
    this.location = this.value
    if (!this.location) await this.geolocate()
    this.$engineEvents.on('pm:create', this.stopDraw)
  },
  beforeUnmount () {
    this.$engineEvents.off('pm:create', this.stopDraw)
    this.clear()
  }
}
</script>

<style lang="scss">
  .leaflet-fa-markers {
    width: 15px;
    height: 25px;
  }
  .leaflet-fa-markers .feature-icon {
    font-size: 14px;
  }
</style>
