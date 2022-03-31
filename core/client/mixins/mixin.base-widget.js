const baseWidgetMixin = {
  computed: {
    widgetStyle () {
      const widgetSize = this.window.size
      if (widgetSize) {
        const widgetWidth = this.window.size[0]
        let widgetHeight = this.window.size[1]
        const windowHeaderElement = document.getElementById('window-header')
        if (windowHeaderElement) {
          widgetHeight -= parseInt(window.getComputedStyle(windowHeaderElement).getPropertyValue('height'))
        }
        const windowFooterElement = document.getElementById('window-footer')
        if (windowFooterElement) {
          widgetHeight -= parseInt(window.getComputedStyle(windowFooterElement).getPropertyValue('height'))
        }
        this.widgetHeight = widgetHeight
        return `minWidth: ${widgetWidth}px;
                maxWidth: ${widgetWidth}px;
                minHeight: ${widgetHeight}px; 
                maxHeight: ${widgetHeight}px;`
      }
    }
  },
  data () {
    return {
      window: this.$store.get('window'),
      widgetHeight: 0
    }
  }
}

export default baseWidgetMixin
