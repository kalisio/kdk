import L from 'leaflet'
import logger from 'loglevel'
import * as Mapillary from 'mapillary-js'

export default {
  data () {
    return {
      mapillary: {
        location: null
      }
    }
  },
  methods: {
    createLeafletMapillaryCorverage (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid types
      if (leafletOptions.type !== 'vectorGrid.protobuf') return
      const layer = this.createLeafletLayer(options)
      if (leafletOptions.interactive) {
        layer.on('click', (event) => {
          if (event.latlng) {
            this.openWidget('mapillary')
            this.mapillary.location = event.latlng
          }
        })
      }
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
    updateMapillaryLocation (lat, lon) {
      this.mapillary.location = { lat: lat, lng: lon }
      if (this.mapillaryMarker) this.mapillaryMarker.setLatLng(new L.LatLng(lat, lon))
    },
    moveCloseToCurrentLocation () {
      const center = this.map.getCenter()
      this.updateMapillaryLocation(center.lat, center.lng)
    },
    centerOnMapillaryLocation () {
      if (this.mapillary.location) this.center(this.mapillary.location.lng, this.mapillary.location.lat)
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
    this.registerLeafletConstructor(this.createLeafletMapillaryCorverage)
  }
}
