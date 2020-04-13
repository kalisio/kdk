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
      widgetHeight: '30vh'
    }
  },
  methods: {
    widgetStyle () {
      if (this.mode === 'minimized') return 'height: ' + this.widgetHeight
      else return 'height: 100vh'
    }
  }
}

export default baseWidgetMixin
