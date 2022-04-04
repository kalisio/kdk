<template>
  <div ref="map" class="col" style="fontWeight: normal; zIndex: 0; position: relative">
    <q-resize-observer @resize="onMapResized" />
  </div>
</template>

<script>
import _ from 'lodash'
import L from 'leaflet'
import { colors } from 'quasar'
import { mixins as kCoreMixins } from '../../../core/client'
import * as mapMixins from '../mixins/map'
import * as kMapMixins from '../mixins'
import { setGatewayJwt } from '../utils'
import meta from 'moment-timezone/data/meta/latest.json'

// Convert timezones to GeoJson
const timezones = _.values(meta.zones).map(timezone => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [timezone.long, timezone.lat]
  },
  properties: {
    name: timezone.name
  }
}))

export default {
  name: 'k-timezone-map',
  mixins: [
    kCoreMixins.refsResolver(['map']),
    kMapMixins.style,
    mapMixins.baseMap,
    mapMixins.geojsonLayers,
    mapMixins.style,
    mapMixins.tooltip
  ],
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      timezone: ''
    }
  },
  watch: {
    value: function () {
      this.setTimezone(this.value)
    }
  },
  methods: {
    setTimezone (timezone) {
      // If empty need to initialize
      if (timezone && (timezone === this.timezone)) return
      // Check if input time zone has a location
      timezone = _.get(meta, 'zones.' + timezone, {})
      this.timezone = _.get(timezone, 'name', '')
      this.refreshTimezonesLayer()
      if (this.timezone) {
        this.center(timezone.long, timezone.lat, this.map.getZoom())
      }
    },
    async refreshBaseLayer () {
      const catalogService = this.$api.getService('catalog', '')
      // Get first visible base layer
      const response = await catalogService.find({ query: { type: 'BaseLayer', 'leaflet.isVisible': true } })
      if (response.data.length > 0) {
        const baseLayer = response.data[0]
        // Do we need to inject a token ?
        const gatewayToken = this.$api.get('storage').getItem(this.$config('gatewayJwt'))
        if (gatewayToken) setGatewayJwt([baseLayer], gatewayToken)
        this.addLayer(baseLayer)
      }
    },
    getTimezoneMarker (feature, latlng) {
      const isSelected = (this.timezone === feature.properties.name)
      return this.createMarkerFromStyle(latlng,
        this.convertFromSimpleStyleSpec({
          'marker-type': 'circleMarker',
          radius: isSelected ? 8 : 5,
          'stroke-color': colors.getBrand('primary'),
          'stroke-opacity': isSelected ? 1 : 0,
          'fill-opacity': 0.5,
          'fill-color': isSelected ? colors.getBrand('secondary') : colors.getBrand('primary')
        })
      )
    },
    getTimezoneTooltip (feature, layer) {
      const name = _.get(feature, 'properties.name')
      let tooltip
      if (name) {
        const isSelected = (this.timezone === name)
        tooltip = L.tooltip({ permanent: isSelected }, layer)
        tooltip.setContent(name)
      }
      return tooltip
    },
    async refreshTimezonesLayer () {
      const layer = this.getLayerByName('Timezones')
      if (!layer) {
        await this.addLayer({
          name: 'Timezones',
          type: 'OverlayLayer',
          featureId: 'name',
          leaflet: {
            type: 'geoJson',
            isVisible: true,
            realtime: true
          }
        })
      }
      this.updateLayer('Timezones', { type: 'FeatureCollection', features: timezones })
    },
    async onMapResized (size) {
      this.refreshMap()
    },
    onTimezoneSelected (layer, event) {
      const feature = _.get(event, 'target.feature')
      if (feature) {
        const timezone = _.get(feature, 'properties.name')
        this.setTimezone(timezone)
        this.$emit('timezone-selected', timezone)
      }
    }
  },
  created () {
    this.registerStyle('markerStyle', this.getTimezoneMarker)
    this.registerStyle('tooltip', this.getTimezoneTooltip)
    this.$on('click', this.onTimezoneSelected)
  },
  async mounted () {
    // Initialize component
    await this.loadRefs()
    this.setupMap(this.$refs.map, {
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 0.25,
      minZoom: 3,
      maxZoom: 6,
      zoom: 3,
      center: [0, 0],
      scale: false,
      geolocate: false
    })
    await this.refreshBaseLayer()
    this.setTimezone(this.value)
    this.$events.$emit('map-ready')
  },
  beforeDestroy () {
    this.$off('click', this.onTimezoneSelected)
  }
}
</script>
