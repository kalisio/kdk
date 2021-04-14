
export default {
  methods: {
    createLeafletCanvasLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'canvasLayer') return

      let layer = this.createLeafletLayer(options)
      layer.delegate(this)
      return layer
    },

    onDrawLayer (info) {
      const ctx = info.canvas.getContext('2d')
      ctx.clearRect(0, 0, info.canvas.width, info.canvas.height)
      ctx.fillStyle = "rgba(255,116,0, 0.2)"
      ctx.fillRect(0, 0, info.canvas.width, info.canvas.height)
    }
  },

  created () {
    this.registerLeafletConstructor(this.createLeafletCanvasLayer)
  },

  beforeDestroy () {
  }
}
