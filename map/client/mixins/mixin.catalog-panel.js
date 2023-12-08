export const catalogPanel = {
  computed: {
    panelStyle () {
      const screenHeight = this.$q.screen.height
      this.scrollAreaMaxHeight = screenHeight * 0.75 // 75vh
      this.scrollAreaMinWidth = 390
      if (this.$q.screen.lt.sm) {
        this.scrollAreaMaxHeight = screenHeight * 0.6
        this.scrollAreaMinWidth = 300
      } else if (this.$q.screen.lt.md) {
        this.scrollAreaMaxHeight = screenHeight * 0.65
        this.scrollAreaMinWidth = 330
      } else if (this.$q.screen.lt.lg) {
        this.scrollAreaMaxHeight = screenHeight * 0.7
        this.scrollAreaMinWidth = 360
      }
      return `height: ${this.scrollAreaMaxHeight}px; min-width: ${this.scrollAreaMinWidth}px;'`
    }
  },
  data () {
    return {
      scrollAreaMaxHeight: 0,
      scrollAreaMinWidth: 390
    }
  }
}
