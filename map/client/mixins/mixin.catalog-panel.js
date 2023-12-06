export const catalogPanel = {
  computed: {
    panelStyle () {
      const screenHeight = this.$q.screen.height
      this.scrollAreaMaxHeight = screenHeight * 0.75 // 75vh
      if (this.$q.screen.lt.sm) {
        this.scrollAreaMaxHeight = screenHeight * 0.6
      } else if (this.$q.screen.lt.md) {
        this.scrollAreaMaxHeight = screenHeight * 0.65
      } else if (this.$q.screen.lt.lg) {
        this.scrollAreaMaxHeight = screenHeight * 0.7
      }
      return `height: ${this.scrollAreaMaxHeight}px;`
    }
  },
  data () {
    return {
      scrollAreaMaxHeight: 0,
    }
  }
}
