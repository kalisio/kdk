<template>
  <div id="elevation-profile" class="column">
    <KChart :ref="onChartRefCreated" class="col q-pl-sm q-pr-sm" />
  </div>
</template>

<script>
import _ from 'lodash'
import config from 'config'
import logger from 'loglevel'
import { getCssVar, copyToClipboard, exportFile, Notify } from 'quasar'
import along from '@turf/along'
import length from '@turf/length'
import flatten from '@turf/flatten'
import { Units } from '../../../../core/client/units'
import { Store } from '../../../../core/client/store'
import { Events } from '../../../../core/client/events'
import { api } from '../../../../core/client/api.js'
import { KChart, KPanel, KStamp } from '../../../../core/client/components'
import { useCurrentActivity, useHighlight } from '../../composables'
import { fetchProfileDataset, fetchElevation, extractElevation } from '../../elevation-utils.js'

// TODO: update pan/zoom with ability over scale
// TODO: reset zoom
// TODO: curv abscissa use metho on chart instead

export default {
  components: {
    KChart,
    KPanel,
    KStamp
  },
  props: {
    layerStorePath: {
      type: String,
      default: ''
    },
    featureStorePath: {
      type: String,
      default: ''
    },
    xAxisLabel: { type: String, default: '' },
    yAxisLabel: { type: String, default: '' },
    terrainLegend: { type: String, default: '' }
  },
  computed: {
    feature () {
      if (this.featureStorePath) {
        const f = Store.get(this.featureStorePath)
        return f
      }
      return this.hasSelectedFeature() && this.getSelectedFeature()
    },
    layer () {
      if (this.layerStorePath) {
        const l = Store.get(this.layerStorePath)
        return l
      }
      return this.hasSelectedLayer() && this.getSelectedLayer()
    },
    title () {
      return _.get(this.feature, 'name') ||
             _.get(this.feature, 'label') ||
             _.get(this.feature, 'properties.name') ||
             _.get(this.feature, 'properties.label') ||
             _.get(this.layer, 'name') ||
             _.get(this.layer, 'properties.name')
    }
  },
  data () {
    return {
      ready: false,
      profile: null
    }
  },
  watch: {
    feature: {
      handler () {
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    onChartRefCreated (reference) {
      if (reference) {
        this.chartRef = reference
      }
    },
    hasFeature () {
      return !_.isNil(this.feature)
    },
    hasProfile () {
      return !_.isNil(this.profile)
    },
    getXAxisLabel () {
      const ctx = { unit: this.chartDistanceUnit }
      return this.xAxisLabel ? _.template(this.xAxisLabel)(ctx) : this.$t('KElevationProfile.CURVILINEAR_AXIS_LEGEND', ctx)
    },
    getYAxisLabel () {
      const ctx = { unit: this.chartHeightUnit }
      return this.yAxisLabel ? _.template(this.yAxisLabel)(ctx) : this.$t('KElevationProfile.HEIGHT_AXIS_LEGEND', ctx)
    },
    getTerrainLegend () {
      const lbl = this.terrainLegend
      return lbl || this.$t('KElevationProfile.TERRAIN_CHART_LEGEND')
    },
    updateChart (terrainDataset, profileDataset, profileColor, chartWidth) {
      if (!this.chartRef) throw new Error('Cannot update the chart while not created')
      const update = {
        type: 'line',
        data: { datasets: [] },
        plugins: [{
          // a simple plugin to display a vertical line at cursor position
          // and hide tooltip on specific conditions
          beforeEvent: (chart, args) => {
            if (args.event.type === 'mousemove') {
              const inChartY = (args.event.y >= chart.chartArea.top) && (args.event.y <= chart.chartArea.bottom)
              const inChartX = (args.event.x >= chart.chartArea.left) && (args.event.x <= chart.chartArea.right)

              this.mouseOverChart = inChartX && inChartY
              if (this.mouseOverChart) {
                chart.config.options.vline.x = args.event.x
              } else if (this.highlightFeature) {
                this.unhighlight(this.highlightFeature)
                this.highlightFeature = undefined
              }
            } else if (args.event.type === 'mouseout') {
              this.mouseOverChart = false
            }
          },
          beforeTooltipDraw: (ctx, args) => {
            if (!this.mouseOverChart || this.panningOrZooming) { args.tooltip.opacity = 0 }
          },
          afterDraw: (chart) => {
            if (!this.mouseOverChart || this.panningOrZooming) return

            const x = chart.config.options.vline.x
            const ctx = chart.ctx
            if (!isNaN(x)) {
              ctx.save()
              ctx.translate(0.5, 0.5)
              ctx.lineWidth = 1
              ctx.strokeStyle = chart.config.options.vline.color
              ctx.beginPath()
              ctx.moveTo(x, chart.chartArea.bottom)
              ctx.lineTo(x, chart.chartArea.top)
              ctx.stroke()
              ctx.restore()
            }
          }
        }],
        options: {
          maintainAspectRatio: false,
          // stepped: 'middle',
          parsing: false, // because we'll provide data in chart native format
          onHover: (context, elements) => {
            // update marker highlight along profile
            if (elements.length) {
              const abscissa = _.get(elements[0].element, '$context.parsed.x')
              if (abscissa !== undefined) {
                let abscissaKm = Units.convert(abscissa, this.chartDistanceUnit, 'km')
                let segment = this.feature
                // handle multi line strings too, find segment in which abscissa is
                if (_.get(this.feature, 'geometry.type') === 'MultiLineString') {
                  const lines = flatten(this.feature).features
                  for (let i = 0; i < lines.length && segment === this.feature; ++i) {
                    const len = length(lines[i], { units: 'kilometers' })
                    if (i !== lines.length - 1) {
                      if (abscissaKm > len) { abscissaKm -= len } else { segment = lines[i] }
                    } else {
                      // last multi line segment, must be on this one
                      if (abscissaKm > len) { abscissaKm = len }
                      segment = lines[i]
                    }
                  }
                }

                this.highlightFeature = along(segment, abscissaKm, { units: 'kilometers' })
                this.highlightFeature.style = _.get(this.kActivity, 'activityOptions.engine.style.location.point')
                this.highlight(this.highlightFeature, null, false)
              }
            }
          },
          interaction: {
            mode: 'xSingle',
            intersect: false
          },
          scales: {
            x: {
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: this.getXAxisLabel()
              },
              ticks: {
                callback: (value, index, ticks) => {
                  return Units.format(value, this.chartDistanceUnit, this.chartDistanceUnit, {
                    notation: 'auto', precision: 8, lowerExp: -8, upperExp: 8, symbol: false
                  })
                }
              }
            },
            y: {
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: this.getYAxisLabel()
              }
            }
          },
          vline: { // option values related to vertical line plugin defined inline
            x: 0,
            color: 'black'
          },
          plugins: {
            title: {
              display: true,
              text: this.title,
              align: 'start'
            },
            legend: {
              display: false
            },
            datalabels: {
              display: false
            },
            tooltip: {
              position: 'cursorPosition',
              callbacks: {
                title: (context) => {
                  let title = ''
                  if (context.length) {
                    title = Units.format(context[0].parsed.x, this.chartDistanceUnit, this.chartDistanceUnit, {
                      notation: 'fixed', precision: 2
                    })
                  }
                  return title
                },
                label: (context) => {
                  let label = context.dataset.label || ''
                  if (label) label += ': '
                  if (context.parsed.y !== null) {
                    label += Units.format(context.parsed.y, this.chartHeightUnit, this.chartHeightUnit, {
                      notation: 'fixed', precision: 2
                    })
                  }
                  return label
                }
              }
            },
            decimation: {
              enabled: true,
              algorithm: 'lttb',
              // algorithm: 'min-max',
              samples: Math.floor(chartWidth / 6),
              threshold: Math.floor(chartWidth / 2)
            },
            zoom: {
              pan: {
                // pan with mouse and no modifiers
                enabled: true,
                // modifierKey: 'ctrl',
                onPanStart: (context) => {
                  // robin: for some reason, pan starts even with some modifiers keys
                  // make sure here there's no modifiers here
                  const event = _.get(context, 'event.srcEvent')
                  const hasModifiers = event ? (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) : false
                  if (hasModifiers) return false

                  this.panningOrZooming = true
                  return true
                },
                onPanComplete: (context) => { this.panningOrZooming = false }
              },
              limits: {
                x: { min: 'original', max: 'original' },
                y: { min: 'original', max: 'original' }
              },
              zoom: {
                // zoom with mouse + ctrl, or wheel
                drag: {
                  enabled: true,
                  modifierKey: 'ctrl',
                  backgroundColor: getCssVar('secondary')
                },
                wheel: {
                  enabled: true
                },
                mode: 'x',
                onZoomStart: (context) => {
                  this.panningOrZooming = true
                  return true
                },
                onZoomComplete: (context) => { this.panningOrZooming = false }
              }
            }
          }
        }
      }

      // Add profile elevation if provided
      if (_.size(profileDataset)) {
        update.data.datasets.push({
          label: this.title,
          data: profileDataset,
          fill: false,
          borderColor: profileColor,
          backgroundColor: profileColor,
          // backgroundColor: '#0986bc',
          // pointRadius: 3,
          normalized: true
        })
        update.options.plugins.legend.display = true
      }

      // Add terrain elevation dataset
      if (_.size(terrainDataset)) {
        update.data.datasets.push({
          label: this.getTerrainLegend(),
          data: terrainDataset,
          fill: true,
          // borderColor: colors.lighten(profileColor, 30),
          borderColor: '#635541',
          borderWidth: 1,
          // backgroundColor: colors.lighten(profileColor, -30),
          backgroundColor: '#c9b8a1',
          pointRadius: 0,
          normalized: true
        })
      }

      this.chartRef.update(update)
    },

    async refresh () {
      // const maxResolution = 30
      this.profile = null
      this.clearHighlights()
      if (!this.layer || !this.feature) return

      // Check supported geometry
      const geometry = _.get(this.feature, 'geometry.type')
      if (geometry !== 'LineString' && geometry !== 'MultiLineString') {
        logger.warn('[KDK] the selected feature has an invald geometry')
        Notify.create({ type: 'negative', message: this.$t('KElevationProfile.INVALID_GEOMETRY') })
        return
      }
      this.highlight(this.feature, false)
      this.chartDistanceUnit = Store.get('units.default.length')
      this.chartHeightUnit = Store.get('units.default.altitude')

      // TODO: this is the window size, not the widget size ...
      const { window } = this.kActivity.findWindow('elevation-profile')
      const chartWidth = window.size[0]

      // Setup the request url options
      const endpoint = Store.get('capabilities.api.gateway') + '/elevation'
      const headers = { 'Content-Type': 'application/json' }
      // Add the Authorization header if jwt is defined
      const jwt = await api.get('storage').getItem(config.gatewayJwt)
      if (jwt) headers.Authorization = 'Bearer ' + jwt

      const dismiss = this.$q.notify({
        group: 'profile',
        icon: 'las la-hourglass-half',
        message: this.$t('KElevationProfile.COMPUTING_PROFILE'),
        color: 'primary',
        timeout: 0,
        spinner: true
      })

      // try to extract line color from layer if available
      const profileColor = _.get(this.layer, 'leaflet.stroke-color', _.get(this.kActivity, 'activityOptions.engine.featureStyle.stroke-color', '#51b0e8'))
      let terrainDataset, profileDataset
      try {
        // Default evelation resolution is max(1 point every 5 pixels, 30m)
        const defaultRes = Math.max(length(this.feature, { units: 'kilometers' }) * 1000 / (chartWidth / 5), 30)
        const result = fetchProfileDataset(this.feature, this.chartDistanceUnit, this.chartHeightUnit)
        profileDataset = result.dataset
        this.updateChart([], profileDataset, profileColor, chartWidth)
        const queries = await fetchElevation(
          endpoint, this.feature, this.chartDistanceUnit, this.chartHeightUnit, {
            additionalHeaders: headers,
            defaultResolution: defaultRes,
            defaultResolutionUnit: 'm',
            // The lowest point on dry land is the shore of the Dead Sea, shared by Israel, Palestine,
            // and Jordan, 432.65 m (1,419 ft) below sea level
            // cf. https://en.wikipedia.org/wiki/Extremes_on_Earth
            minElevationValue: Units.convert(-500, 'm', this.chartHeightUnit)
          })
        const { dataset, geojson } = extractElevation(queries)
        terrainDataset = dataset
        this.profile = geojson
      } catch (error) {
        Notify.create({ type: 'negative', message: this.$t('errors.NETWORK_ERROR') })
      }

      dismiss()

      this.updateChart(terrainDataset, profileDataset, profileColor, chartWidth)
    },
    onCenterOn () {
      this.centerOnSelection()
    },
    async onCopyProfile () {
      if (this.profile) {
        try {
          await copyToClipboard(JSON.stringify(this.profile))
          Notify.create({ type: 'positive', message: this.$t('KElevationProfile.PROFILE_COPIED') })
        } catch (error) {
          Notify.create({ type: 'negative', message: this.$t('KElevationProfile.CANNOT_COPY_PROFILE') })
          logger.error(error)
        }
      }
    },
    onExportProfile () {
      if (this.profile) {
        const file = this.title + '.geojson'
        const status = exportFile(file, JSON.stringify(this.profile))
        if (status) Notify.create({ type: 'positive', message: this.$t('KElevationProfile.PROFILE_EXPORTED', { file }) })
        else Notify.create({ rtpe: 'negative', message: this.$t('KElevationProfile.CANNOT_EXPORT_PROFILE') })
      }
    }
  },
  mounted () {
    this.panningOrZooming = false
    this.mouseOverChart = false

    this.debouncedRefresh = _.debounce(this.refresh, 100)

    // Setup listeners
    Events.on('units-default-length-changed', this.debouncedRefresh)
    Events.on('units-default-altitude-changed', this.debouncedRefresh)
    if (this.layerStorePath) { Events.on(`${_.kebabCase(this.layerStorePath)}-changed`, this.debouncedRefresh) }
    if (this.featureStorePath) { Events.on(`${_.kebabCase(this.featureStorePath)}-changed`, this.debouncedRefresh) }
  },
  beforeUnmount () {
    // Release listeners
    Events.off('units-default-length-changed', this.debouncedRefresh)
    Events.off('units-default-altitude-changed', this.debouncedRefresh)
    if (this.layerStorePath) { Events.off(`${_.kebabCase(this.layerStorePath)}-changed`, this.debouncedRefresh) }
    if (this.featureStorePath) { Events.off(`${_.kebabCase(this.featureStorePath)}-changed`, this.debouncedRefresh) }
  },
  setup (props) {
    return {
      ...useCurrentActivity(),
      ...useHighlight('elevation-profile')
    }
  }
}
</script>
