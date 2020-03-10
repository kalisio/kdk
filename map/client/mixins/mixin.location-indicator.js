import Vue from 'vue'
import KLocationIndicator from '../components/KLocationIndicator.vue'

export default {
  data () {
    return {
      currentLocation: [0, 0],
      currentLocationFormat: this.$store.get('locationFormat') || 'FFf'
    }
  },
  methods: {
    createLocationIndicator () {
      if (this.locationIndicator) return
      const Component = Vue.extend(KLocationIndicator)
      this.locationIndicator = new Component({
        propsData: {
          location: this.currentLocation,
          locationFormat: this.currentLocationFormat
        }
      })
      this.locationIndicator.$on('close', this.removeLocationIndicator)
      this.locationIndicator.$mount()
      this.$el.appendChild(this.locationIndicator.$el)
      this.$on('mousemove', this.updateLocationIndicator)
    },
    removeLocationIndicator () {
      if (!this.locationIndicator) return
      this.$off('mousemove', this.updateLocationIndicator)
      this.locationIndicator.$off('close', this.removeLocationIndicator)
      this.$el.removeChild(this.locationIndicator.$el)
      this.locationIndicator = null
    },
    setLocationFormat (format) {
      this.currentLocationFormat = format
    },
    updateLocationIndicator (options, event) {
      this.currentLocation = [event.latlng.lat, event.latlng.lng]
      this.locationIndicator.location = this.currentLocation
    }
  },
  created () {
    // Whenever the location format is updated, update indicator as well
    this.$events.$on('location-format-changed', this.setLocationFormat)
  },
  beforeDestroy () {
    this.$events.$off('location-format-changed', this.setLocationFormat)
  }
}
