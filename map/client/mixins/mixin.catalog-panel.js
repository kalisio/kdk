export const catalogPanel = {
  computed: {
    panelStyle () {
      const screenHeight = this.$q.screen.height
      this.scrollAreaMaxHeight = screenHeight * 0.75 // 75vh
      let width = 390
      if (this.$q.screen.lt.sm) {
        this.scrollAreaMaxHeight = screenHeight * 0.6
        width = 300
      } else if (this.$q.screen.lt.md) {
        this.scrollAreaMaxHeight = screenHeight * 0.65
        width = 330
      } else if (this.$q.screen.lt.lg) {
        this.scrollAreaMaxHeight = screenHeight * 0.7
        width = 360
      }
      return `height: ${this.scrollAreaMaxHeight}px; width: ${width}px`
    }
  },
  data () {
    return {
      scrollAreaMaxHeight: 0
    }
  }
}
