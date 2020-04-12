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
      if (this.mode === 'minimized') return 'height: 30vh;'
      else return 'height: 100vh'
    }
  }
}

export default baseWidgetMixin
