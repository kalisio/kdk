<template>
  <div :ref="configure" class="col" style="fontWeight: normal; zIndex: 0; position: relative">
    <q-resize-observer @resize="onMapResized" />
  </div>
</template>

<script>
import _ from 'lodash'
import L from 'leaflet'
import { getCssVar } from 'quasar'
import { api, utils as kCoreUtils } from '../../../core/client'
import * as mapMixins from '../mixins/map'
import * as mixins from '../mixins'
import { useCatalog, useCurrentActivity } from '../composables'
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
  emits: [
    'timezone-selected'
  ],
  mixins: [
    mixins.style,
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
      const layers = await this.getLayers()
      // Get first visible base layer
      if (layers.length > 0) {
        this.addLayer(layers[0])
      }
    },
    getTimezoneMarker (feature, latlng) {
      const isSelected = (this.timezone === feature.properties.name)
      return this.createMarkerFromStyle(latlng,
        this.convertFromSimpleStyleSpec({
          'marker-type': 'circleMarker',
          radius: isSelected ? 8 : 5,
          'stroke-color': getCssVar('primary'),
          'stroke-opacity': isSelected ? 1 : 0,
          'fill-opacity': 0.5,
          'fill-color': isSelected ? getCssVar('secondary') : getCssVar('primary')
        })
      )
    },
    getTimezoneTooltip (feature, layer) {
      const name = _.get(feature, 'properties.name')
      let tooltip
      if (name) {
        const isSelected = (this.timezone === name)
        tooltip = L.tooltip({ permanent: isSelected }, layer)
        tooltip.setContent(kCoreUtils.getTimezoneLabel(name))
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
    },
    configure (container) {
      if (!container || this.map) return
      this.setupMap(container, {
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 0.25,
        minZoom: 3,
        maxZoom: 6,
        zoom: 3,
        center: [0, 0],
        scale: false,
        geolocate: false
      })
      this.refreshBaseLayer()
    }
  },
  created () {
    this.registerStyle('markerStyle', this.getTimezoneMarker)
    this.registerStyle('tooltip', this.getTimezoneTooltip)
    this.$engineEvents.on('click', this.onTimezoneSelected)
  },
  mounted () {
    // Initialize component
    this.setTimezone(this.value)
  },
  beforeUnmount () {
    this.$engineEvents.off('click', this.onTimezoneSelected)
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
