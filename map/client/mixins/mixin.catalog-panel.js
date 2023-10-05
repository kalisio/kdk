export const catalogPanel = {
  computed: {
    panelStyle () {
      const screenHeight = this.$q.screen.height
      this.scrollAreaMaxHeight = screenHeight * 0.75 // 75vh
      this.scrollAreaMaxWidth = 390
      if (this.$q.screen.lt.sm) {
        this.scrollAreaMaxHeight = screenHeight * 0.6
        this.scrollAreaMaxWidth = 300
      } else if (this.$q.screen.lt.md) {
        this.scrollAreaMaxHeight = screenHeight * 0.65
        this.scrollAreaMaxWidth = 330
      } else if (this.$q.screen.lt.lg) {
        this.scrollAreaMaxHeight = screenHeight * 0.7
        this.scrollAreaMaxWidth = 360
      }
      return `height: ${this.scrollAreaMaxHeight}px; width: ${this.scrollAreaMaxWidth}px`
    }
  },
  data () {
    return {
      scrollAreaMaxHeight: 0,
      scrollAreaMaxWidth: 390
    }
  }
}
