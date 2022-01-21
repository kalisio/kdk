const baseWidgetMixin = {
  props: {
    mode: {
      type: String,
      default: 'minimized',
      validator: (value) => {
        return ['minimized', 'maximized'].includes(value)
      }
    }
  },
  data () {
    return {
      widgetHeight: 0
    }
  },
  computed: {
    widgetStyle () {
      const screenHeight = this.$q.screen.height
      this.widgetHeight = this.mode === 'maximized' ? screenHeight : screenHeight * 0.3 // 30vh
      return `height: ${this.widgetHeight}px`
    }
  }
}

export default baseWidgetMixin
