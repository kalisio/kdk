import Cesium from 'cesium/Source/Cesium.js'

export const globeActivity = {
  methods: {
    async initializeGlobe (token) {
      if (this.viewer) return
      // Ensure DOM ref is here as well
      await this.loadRefs()
      this.setupGlobe(this.$refs.globe, token)
      await this.initialize() // Generic activity initialization
      this.viewer.camera.moveEnd.addEventListener(this.storeView)
    },
    finalizeGlobe () {
      this.viewer.camera.moveEnd.removeEventListener(this.storeView)
    },
    storeView () {
      // Check if the activity is using context restoration
      if (typeof this.storeContext === 'function') this.storeContext('view')
    },
    onGlobeResized (size) {
      // Avoid to refresh the layout when leaving the component
      if (this.observe) {
        this.refreshGlobe()
        if (this.$refs.globe) {
          this.engineContainerWidth = this.$refs.globe.getBoundingClientRect().width
          this.engineContainerHeight = this.$refs.globe.getBoundingClientRect().height
        }
      }
    },
    onToggleVr () {
      // VR requires fullscreen mode
      if (this.viewer.scene.useWebVR) {
        if (Cesium.Fullscreen.fullscreen) Cesium.Fullscreen.exitFullscreen()
        this.viewer.scene.useWebVR = false
      } else {
        if (!Cesium.Fullscreen.fullscreen) Cesium.Fullscreen.requestFullscreen(document.body)
        this.viewer.scene.useWebVR = true
      }
    }
  },
  created () {
    // Setup mapping engine
    this.engine = 'cesium'
    // Enable the observers in order to refresh the layout
    this.observe = true
  },
  mounted () {
  },
  beforeUnmount () {
    // No need to refresh the layout when leaving the component
    this.observe = false
    this.finalizeGlobe()
  }
}
