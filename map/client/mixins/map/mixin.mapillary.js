import L from 'leaflet'
import _ from 'lodash'
import logger from 'loglevel'
import * as Mapillary from 'mapillary-js'
import { TiledMapillaryLayer } from '../../leaflet/TiledMapillaryLayer'

export default {
  data () {
    return {
      mapillary: {
        location: null
      }
    }
  },
  methods: {
    async createLeafletMapillaryCoverageLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid type
      if (leafletOptions.type !== 'mapillary') return
      if (typeof this.createLeafletGeoJsonLayer !== 'function') {
        throw new Error('Mapillary layer needs support of GeoJson layer to work correctly')
      }
      // Based on real-time geojson to be created first
      const layer = await this.createLeafletGeoJsonLayer(_.merge(options, {
        featureId: 'key',
        leaflet: {
          type: 'geoJson',
          realtime: true,
          removeMissing: false,
          cluster: false
        }
      }))
      // Then tiled layer
      const tiledLayer = new TiledMapillaryLayer(leafletOptions)
      tiledLayer.setup(this, options)
      layer.tiledLayer = tiledLayer
      tiledLayer.addTo(this.map)
      layer.on('add', () => tiledLayer.addTo(this.map))
      layer.on('remove', () => tiledLayer.removeFrom(this.map))
      this.mapillaryLayer = options
      return layer
    },
    addMapillaryMarker () {
      const markerIcon = L.icon({
        iconUrl: './statics/mapillary-marker.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })
      this.mapillaryMarker = L.marker([0, 0], { icon: markerIcon })
      this.map.addLayer(this.mapillaryMarker)
    },
    removeMapillaryMarker () {
      this.map.removeLayer(this.mapillaryMarker)
      this.mapillaryMarker = null
    },
    updateMapillaryMarker (lat, lon) {
      if (this.mapillaryMarker) this.mapillaryMarker.setLatLng(new L.LatLng(lat, lon))
    },
    saveMapillaryLocation (lat, lon) {
      this.mapillary.location = { lat: lat, lon: lon }
    },
    onMapillaryFeatureClicked (layer, event) {
      // Not yet initialized or not expected layer ?
      if (!this.mapillaryLayer || (this.mapillaryLayer.name !== layer.name)) return
      if (event.latlng) {
        this.openWidget('mapillary')
        this.mapillary.location = event.latlng
      }
    },
    onMapillarySelectionChanged () {
      if (this.selection.feature && this.selection.feature.geometry.type === 'Point') {
        const coordinates = this.selection.feature.geometry.coordinates
        this.mapillary.location = { lat: coordinates[1], lon: coordinates[0] }
      }
    },
    onCurrentTimeChangedMapillaryCoverage (time) {
      // Not yet initialized ?
      if (!this.mapillaryLayer) return
      // Retrieve the layer
      const layer = this.getLeafletLayerByName(this.mapillaryLayer.name)
      // Then update tiles
      if (layer.tiledLayer) layer.tiledLayer.redraw()
    }
  },
  created () {
    // Initialize the component
    this.mapillaryMarker = null
    this.mapillaryClientID = null
    // Check whether Mapillary is suppoted
    if (!Mapillary.isSupported()) {
      logger.warn('Mapillary is not supported on your platform')
      return
    }
    // Chec whether the clientID is initailized
    this.mapillaryClientID = this.$store.get('capabilities.api.mapillary.clientID')
    if (!this.mapillaryClientID) {
      logger.warn('You must provide a clientID to use Mapillary')
      return
    }
    // Register the mapillary coverage
    this.registerLeafletConstructor(this.createLeafletMapillaryCoverageLayer)
  },
  mounted () {
    this.$on('click', this.onMapillaryFeatureClicked)
    this.$on('selection-changed', this.onMapillarySelectionChanged)
    this.$on('current-time-changed', this.onCurrentTimeChangedMapillaryCoverage)
  },
  beforeDestroy () {
    this.$off('click', this.onMapillaryFeatureClicked)
    this.$off('selection-changed', this.onMapillarySelectionChanged)
    this.$off('current-time-changed', this.onCurrentTimeChangedMapillaryCoverage)
  }
}
