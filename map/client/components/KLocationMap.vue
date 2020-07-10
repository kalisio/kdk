<template>
  <q-card class="q-pa-none" :style="cardStyle">
    <q-card-section class="fit q-pa-none">
      <div class="fit column">
        <div class="col-auto">
          <q-toolbar class="q-pa-sm bg-secondary text-white">
            <k-text-area :text="location.name" ellipsis="2-lines" />
            <q-space />
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
    </q-card-section>
  </q-card>
</template>

<script>
import L from 'leaflet'
import formatcoords from 'formatcoords'
import { colors } from 'quasar'
import { mixins as kCoreMixins } from '../../../core/client'
import * as mapMixins from '../mixins/map'

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
    editable: {
      type: Boolean,
      default: true
    },
    size: {
      type: Object,
      default: () => {
        return {
          width: 360,
          height: 400
        }
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
          iconClasses: 'fas fa-circle 0.75rem',
          markerColor: colors.getBrand('primary'),
          iconColor: '#FFFFFF',
          iconXOffset: 1,
          iconYOffset: 0
        }
      }
    }
  },
  computed: {
    cardStyle () {
      return 'width: ' + this.size.width + 'px; height:' + this.size.height + 'px;'
    }
  },
  data () {
    return {
      location: this.defaultLocation(),
      isModified: false
    }
  },
  methods: {
    defaultLocation () {
      return {
        name: '',
        latitude: this.$store.get('user.position.latitude', 0),
        longitude: this.$store.get('user.position.longitude', 0)
      }
    },
    centerMap () {
      this.center(this.location.longitude, this.location.latitude, this.mapOptions.zoom)
    },
    refreshLocation () {
      // Updated the location
      if (this.value) this.location = this.value
      // Center the map
      this.centerMap()
      // Updated the marker
      if (!this.marker) {
        this.marker = L.marker([this.location.latitude, this.location.longitude], {
          icon: L.icon.fontAwesome(this.markerStyle),
          draggable: this.editable
        })
        this.marker.addTo(this.map)
        if (this.editable) this.marker.on('drag', this.onLocationDragged)
      } else {
        this.marker.setLatLng([this.location.latitude, this.location.longitude])
      }
      this.isModified = false
    },
    onLocationDragged () {
      this.location.name = formatcoords(this.marker.getLatLng().lat, this.marker.getLatLng().lng).format(this.$store.get('locationFormat', 'FFf'))
      this.location.latitude = this.marker.getLatLng().lat
      this.location.longitude = this.marker.getLatLng().lng
      this.isModified = true
    },
    async refreshBaseLayer () {
      this.layers = {}
      const catalogService = this.$api.getService('catalog', '')
      // Get first visible base layer
      const response = await catalogService.find({ query: { type: 'BaseLayer', 'leaflet.isVisible': true } })
      if (response.data.length > 0) this.addLayer(response.data[0])
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
    this.refreshLocation()
    this.$events.$emit('map-ready')
  },
  destroyed () {
    if (this.isModified) this.$emit('input', this.location)
  }
}
</script>

<style>
  .leaflet-fa-markers .feature-icon {
      font-size: 14px;
  }
</style>
