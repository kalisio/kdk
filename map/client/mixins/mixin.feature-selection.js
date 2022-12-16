export const featureSelection = {
  watch: {
    'selection.items': {
      handler () {
        this.updateHighlights()
        const widget = this.getWidgetForSelection()
        if (widget) this.openWidget(widget)
      },
      deep: true
    },
    'probe.item': {
      handler () {
        this.updateHighlights()
        const widget = this.getWidgetForProbe()
        if (widget) this.openWidget(widget)
      },
      deep: true
    }
  },
  methods: {
    updateHighlights () {
      this.clearHighlights()
      this.getSelectedItems().forEach(item => {
        this.highlight(item.feature || item.location, item.layer)
      })
      if (this.hasProbedLocation()) this.highlight(this.probe)
    }
  }
}
