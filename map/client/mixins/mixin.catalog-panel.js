export const catalogPanel = {
  computed: {
    panelStyle () {
      const screenHeight = this.$q.screen.height
      this.scrollAreaMaxHeight = screenHeight * 0.75 // 75vh
      let width = 420
      if (this.$q.screen.lt.sm) {
        this.scrollAreaMaxHeight = screenHeight * 0.60
        width = 300
      } else if (this.$q.screen.lt.md) {
        this.scrollAreaMaxHeight = screenHeight * 0.65
        width = 340
      } else if (this.$q.screen.lt.lg) {
        this.scrollAreaMaxHeight = screenHeight * 0.70
        width = 380
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
