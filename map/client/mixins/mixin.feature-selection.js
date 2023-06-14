export const featureSelection = {
  watch: {
    'selection.items': {
      handler () {
        this.updateHighlights()
        const widget = this.getWidgetForSelection()
        // If window already open on another widget keep it
        if (widget && !this.isWidgetWindowVisible(widget)) this.openWidget(widget)
      }
    },
    'probe.item': {
      handler () {
        this.updateHighlights()
        const widget = this.getWidgetForProbe()
        if (widget) this.openWidget(widget)
      }
    }
  },
  methods: {
    updateHighlights () {
      this.clearHighlights()
      this.getSelectedItems().forEach(item => {
        this.highlight(item.feature || item.location, item.layer)
      })
      if (this.hasProbedLocation()) this.highlight(this.getProbedLocation(), this.getProbedLayer())
    }
  }
}
