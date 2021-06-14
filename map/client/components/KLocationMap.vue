<template>
  <div class="fit column">
    <div v-if="toolbar" class="full-width row">
      <q-toolbar class="q-pl-sm q-pr-sm bg-accent text-white">
        <k-text-area :text="location.name" />
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
        <q-btn v-if="editable" icon="las la-home" flat round dense @click="refreshLocation">
          <q-tooltip>
            {{ $t('KLocationMap.RESTORE_BUTTON') }}
          </q-tooltip>
        </q-btn>
        <q-btn icon="las la-search-location" flat round dense @click="centerMap">
          <q-tooltip>
            {{ $t('KLocationMap.RECENTER_BUTTON') }}
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </div>
    <div ref="map" class="col" style="fontWeight: normal; zIndex: 0; position: relative">
      <q-resize-observer @resize="onMapResized" />
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import { colors } from 'quasar'
import i18next from 'i18next'
import { mixins as kCoreMixins } from '../../../core/client'
import * as mapMixins from '../mixins/map'
import { Geolocation } from '../geolocation'
import { setGatewayJwt, formatUserCoordinates, bindLeafletEvents, unbindLeafletEvents } from '../utils'

export default {
  name: 'k-location-map',
  mixins: [
    kCoreMixins.refsResolver(['map']),
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
          markerColor: colors.getBrand('primary'),
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
  watch: {
    value: function () {
      this.refreshLocation()
      this.refreshDraw()
    },
    editable: function () {
      this.refreshLocation()
      this.refreshDraw()
    },
    drawable: function () {
      this.refreshLocation()
      this.refreshDraw()
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
      if (this.drawable) {
        if (this.drawLayer) this.map.fitBounds(this.drawLayer.getBounds())
      } else {
        this.center(this.location.longitude, this.location.latitude, this.mapOptions.zoom)
      }
    },
    clearLocation () {
      if (this.marker) {
        this.marker.off('drag', this.onLocationDragged)
        this.marker.removeFrom(this.map)
        this.marker = null
      }
    },
    clearDraw () {
      if (this.drawLayer) {
        this.map.removeLayer(this.drawLayer)
        this.drawLayer = null
      }
      this.map.pm.disableDraw()
      unbindLeafletEvents(this.map, ['pm:create'])
      this.map.pm.setGlobalOptions({ layerGroup: null })
    },
    async refreshLocation () {
      this.clearLocation()
      if (this.drawable) return
      // Update the location
      if (this.value) {
        this.location = this.value
      } else {
        await Geolocation.update()
        const position = this.$store.get('geolocation.position')
        if (position) {
          this.location = {
            name: formatUserCoordinates(position.latitude, position.longitude, this.$store.get('locationFormat', 'FFf')),
            latitude: position.latitude,
            longitude: position.longitude
          }
        }
      }
      if (!_.has(this.location, 'latitude') || !_.has(this.location, 'longitude')) return
      // Center the map
      this.centerMap()
      // Create the marker
      if (!this.marker) {
        this.marker = L.marker([this.location.latitude, this.location.longitude], {
          icon: L.icon.fontAwesome(this.markerStyle),
          draggable: this.editable,
          pmIgnore: true
        })
        if (this.location.name) {
          this.marker.bindPopup(this.location.name)
        }
        this.marker.addTo(this.map)
        if (this.editable) this.marker.on('drag', this.onLocationDragged)
      }
    },
    onLocationDragged () {
      this.location.name = formatUserCoordinates(this.marker.getLatLng().lat, this.marker.getLatLng().lng, this.$store.get('locationFormat', 'FFf'))
      this.location.latitude = this.marker.getLatLng().lat
      this.location.longitude = this.marker.getLatLng().lng
      this.$emit('input', this.location)
    },
    refreshDraw () {
      this.clearDraw()
      if (!this.drawable) return
      // Update the location
      if (this.value) {
        this.location = this.value
        this.drawLayer = L.geoJson({ type: 'Feature', geometry: this.location })
        this.map.addLayer(this.drawLayer)
      }
      if (!_.has(this.location, 'coordinates')) return
      // Center the map
      this.centerMap()
    },
    startDraw(shape) {
      // Clear any previous edition
      this.clearDraw()
      this.drawLayer = L.geoJson()
      this.map.addLayer(this.drawLayer)
      this.map.pm.setGlobalOptions({ layerGroup: this.drawLayer })
      this.map.pm.enableDraw(shape, {
        snappable: true,
        snapDistance: 20,
      })
      bindLeafletEvents(this.map, ['pm:create'], this)
    },
    stopDraw() {
      const geoJson = this.drawLayer.toGeoJSON()
      // The location is the feature geometry
      this.location = _.get(geoJson, 'features[0].geometry')
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
        // do we need to inject a token
        const gatewayToken = this.$api.get('storage').getItem(this.$config('gatewayJwt'))
        if (gatewayToken) setGatewayJwt([baseLayer], gatewayToken)
        this.addLayer(baseLayer)
      }
    },
    async onMapResized (size) {
      this.refreshMap()
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
  },
  async mounted () {
    await this.loadRefs()
    this.setupMap(this.$refs.map, this.mapOptions)
    await this.refreshBaseLayer()
    if (this.drawable) this.refreshDraw()
    else this.refreshLocation()
    this.$events.$emit('map-ready')
    this.$on('pm:create', this.stopDraw)
  },
  beforeDestroy () {
    this.$off('pm:create', this.stopDraw)
    if (this.drawable) this.clearDraw()
    else this.clearLocation()
  }
}
</script>

<style>
  .leaflet-fa-markers {
    width: 15px;
    height: 25px;
  }
  .leaflet-fa-markers .feature-icon {
    font-size: 14px;
  }
</style>
