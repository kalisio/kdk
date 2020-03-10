export default {
  methods: {
    async initializeMap () {
      if (this.map) return
      // Ensure DOM ref is here as well
      await this.loadRefs()
      this.setupMap(this.$refs.map)
      this.map.on('moveend', this.storeView)
      await this.initialize() // Generic activity initialization
    },
    finalizeMap () {
      this.map.off('moveend', this.storeView)
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
  beforeDestroy () {
    // No need to refresh the layout when leaving the component
    this.observe = false
    this.finalizeMap()
  }
}
