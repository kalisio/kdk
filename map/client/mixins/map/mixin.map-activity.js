export const activity = {
  methods: {
    async initializeMap (container) {
      if (this.map) return
      this.setupMap(container)
      await this.initialize() // Generic activity initialization
      this.map.on('moveend', this.storeView)
    },
    finalizeMap () {
      this.map.off('moveend', this.storeView)
    },
    storeView () {
      // Check if the activity is using context restoration
      if (typeof this.storeContext === 'function') this.storeContext('view')
    },
    onMapResized (size) {
      // Avoid to refresh the layout when leaving the component
      if (this.observe) {
        this.refreshMap()
        if (this.$refs.map) {
          this.engineContainerWidth = this.$refs.map.getBoundingClientRect().width
          this.engineContainerHeight = this.$refs.map.getBoundingClientRect().height
        }
      }
    }
  },
  created () {
    // Setup mapping engine
    this.engine = 'leaflet'
    // Enable the observers in order to refresh the layout
    this.observe = true
  },
  mounted () {
  },
  beforeUnmount () {
    // No need to refresh the layout when leaving the component
    this.observe = false
    this.finalizeMap()
  }
}
