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
  computed: {
    widgetStyle () {
      if (this.mode === 'minimized') return 'min-height: 35vh;'
      else return 'height: 100vh'
    }
  }
}

export default baseWidgetMixin
