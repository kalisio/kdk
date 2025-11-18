import _ from 'lodash'
import { ForecastProbeId, updateTimeSeries } from '../utils/utils.time-series.js'
import { Layout } from '../../../core/client/layout.js'

export const featureSelection = {
  watch: {
    'selection.items': {
      handler () {
        this.updateSelection()
      }
    },
    'probe.item': {
      handler () {
        this.updateSelection()
      }
    }
  },
  methods: {
    updateHighlights () {
      this.clearHighlights()
      this.getSelectedItems().forEach(item => {
        this.highlight(item.feature || item.location, item.layer)
      })
    },
    async updateProbedLocationHighlight () {
      if (this.hasProbedLocation()) {
        this.highlight(this.getProbedLocation(), this.getProbedLayer() || { name: ForecastProbeId })
      }
    },
    async updateSelection () {
      this.updateHighlights()
      await this.updateTimeSeries()
      // As probed location depends on time series do this after
      await this.updateProbedLocationHighlight()
      if (this.hasProbedLocation() || this.hasSelectedItems()) {
        this.handleWidget(this.getWidgetForProbe() || this.getWidgetForSelection())
      }
    },
    async updateTimeSeries (path = 'state.timeSeries') {
      if (!_.has(this, path)) return
      const timeSeries = await updateTimeSeries(_.get(this, path))
      _.set(this, path, timeSeries)
    },
    handleWidget (widget) {
      // If window already open on another widget keep it
      if (widget && (widget !== 'none') && !this.isWidgetWindowVisible(widget)) this.openWidget(widget)
    }
  },
  mounted () {
    this.$engineEvents.on('forecast-model-changed', this.updateSelection)
    this.$engineEvents.on('selected-level-changed', this.updateSelection)
    // We use debounce here to avoid multiple refresh when editing settings for instance
    this.requestTimeSeriesUpdate = _.debounce(() => this.updateTimeSeries(), 250)
    this.$events.on('timeseries-group-by-changed', this.requestTimeSeriesUpdate)
    this.$events.on('units-changed', this.requestTimeSeriesUpdate)
    this.$events.on('time-current-time-changed', this.updateProbedLocationHighlight)
  },
  beforeUnmount () {
    this.$engineEvents.off('forecast-model-changed', this.updateSelection)
    this.$engineEvents.off('selected-level-changed', this.updateSelection)
    this.$events.off('timeseries-group-by-changed', this.updateTimeSeries)
    this.$events.off('units-changed', this.requestTimeSeriesUpdate)
    this.$events.off('time-current-time-changed', this.requestTimeSeriesUpdate)
  }
}
