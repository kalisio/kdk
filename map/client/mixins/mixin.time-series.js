
import _ from 'lodash'

export default {
  methods: {
    async onTimeSeriesProbeClicked (options, event) {
      const feature = _.get(event, 'target.feature')
      if (!feature) return
      const windDirection = (this.selectedLevel ? `windDirection-${this.selectedLevel}` : 'windDirection')
      const windSpeed = (this.selectedLevel ? `windSpeed-${this.selectedLevel}` : 'windSpeed')
      const isWeatherProbe = (_.has(feature, `properties.${windDirection}`) &&
                              _.has(feature, `properties.${windSpeed}`) &&
                              (options.name === this.$t('mixins.timeseries.PROBED_LOCATION')))
      // Update timeseries data if required
      const { start, end } = this.getProbeTimeRange()
      if (options.probe) { // Static weacast probe
        const probe = await this.getForecastProbe(options.probe)
        if (probe) {
          await this.getForecastForFeature(_.get(feature, this.probe.featureId), start, end)
        }
      } else if (options.variables && options.service) { // Static measure probe
        await this.getMeasureForFeature(options, feature, start, end)
      } else if (isWeatherProbe) { // Dynamic weacast probe
        const position = feature.geometry.coordinates
        await this.getForecastForLocation(position[0], position[1], start, end)
      } else {
        return
      }
      this.openWidget('time-series')
    },
    async onTimeSeriesSelectionChanged () {
      const feature = this.selection.feature
      if (feature && feature.geometry.type === 'Point') {
        const options = this.selection.options
        const { start, end } = this.getProbeTimeRange()
        if (options.variables && options.service) { // Static measure probe
          await this.getMeasureForFeature(options, feature, start, end)
        } else {
          const position = feature.geometry.coordinates
          await this.getForecastForLocation(position[0], position[1], start, end)
        }
      }
    }
  },
  mounted () {
    this.$on('click', this.onTimeSeriesProbeClicked)
    this.$on('selection-changed', this.onTimeSeriesSelectionChanged)
  },
  beforeDestroy () {
    this.$off('click', this.onTimeSeriesProbeClicked)
    this.$off('selection-changed', this.onTimeSeriesSelectionChanged)
  }
}
