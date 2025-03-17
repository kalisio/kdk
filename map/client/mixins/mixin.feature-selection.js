export const featureSelection = {
  watch: {
    'selection.items': {
      handler () {
        this.updateHighlights()
        this.handleWidget(this.getWidgetForSelection())
      }
    },
    'probe.item': {
      handler () {
        this.updateHighlights()
        this.handleWidget(this.getWidgetForProbe())
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
    },
    handleWidget (widget) {
      // If window already open on another widget keep it
      if (widget && (widget !== 'none') && !this.isWidgetWindowVisible(widget)) this.openWidget(widget)
    }
  }
}
