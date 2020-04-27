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
    updateMapillaryMarker (lat, lon, bearing) {
      // Remove the existing marker
      this.map.removeLayer(this.mapillaryMarker)
      // Create a new one with the corresponding rotation
      const angle = bearing + 225 // because if the initial rotation of the icon
      const markerIcon = L.divIcon({
        html: `<img style="${L.DomUtil.TRANSFORM}: translateX(-20px) translateY(-20px) rotateZ(${angle}deg); width: 40p; height: 40px;" src="./statics/mapillary-marker.png">`
      })
      this.mapillaryMarker = L.marker([lat, lon], { icon: markerIcon })
      // Add it to the map
      this.map.addLayer(this.mapillaryMarker)
      // Backup the position without reactivity
      this.mapillary.location.lat = lat
      this.mapillary.location.lon = lon
    },
    onMapillaryFeatureClicked (layer, event) {
      // Not yet initialized or not expected layer ?
      if (!this.mapillaryLayer || (this.mapillaryLayer.name !== layer.name)) return
      if (event.latlng) {
        this.mapillary.location = { lat: event.latlng.lat, lon: event.latlng.lng }
        this.openWidget('mapillary')
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
