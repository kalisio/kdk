<template>
  <div id="elevation-profile" class="column">
    <k-chart ref="chart" class="col q-pl-sm q-pr-sm" />
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { getCssVar, copyToClipboard, exportFile, colors } from 'quasar'
import along from '@turf/along'
import length from '@turf/length'
import flatten from '@turf/flatten'
import { segmentEach, coordEach } from '@turf/meta'
import { featureCollection } from '@turf/helpers'
import { Units } from '../../../../core/client/units'
import { Store } from '../../../../core/client/store'
import { KChart, KPanel, KStamp } from '../../../../core/client/components'
import { useCurrentActivity, useHighlight } from '../../composables'
import { fetchProfileDataset, fetchElevation, extractElevation } from '../../elevation-utils.js'

// TODO: update pan/zoom with ability over scale
// TODO: customize legends, ghost icon
// TODO: curv abscissa use metho on chart instead
// TODO: no tooltip when not over chart area
// TODO: profile & terrain colors as props ?

export default {
  components: {
    KChart,
    KPanel,
    KStamp
  },
  props: {
    highlight: {
      type: Object,
      default: () => ({ 'stroke-color': 'primary', 'fill-opacity': 0, zOrder: 1 })
    },
    xAxisLabel: '',
    yAxisLabel: '',
    mapGhostIcon: {
      type: Object,
      default: () => ({})
    },
    terrainLegend: ''
  },
  computed: {
    feature () {
      return this.hasSelectedFeature() && this.getSelectedFeature()
    },
    layer () {
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
    hasFeature () {
      return !_.isNil(this.feature)
    },
    hasProfile () {
      return !_.isNil(this.profile)
    },
    getXAxisLabel () {
      const lbl = this.xAxisLabel
      return lbl ? lbl : this.$t('KElevationProfile.CURVILINEAR_AXIS_LEGEND', { unit: this.chartDistanceUnit })
    },
    getYAxisLabel () {
      const lbl = this.yAxisLabel
      return lbl ? lbl : this.$t('KElevationProfile.HEIGHT_AXIS_LEGEND', { unit: this.chartHeightUnit })
    },
    getMapGhostIcon () {
      const def = {
        'marker-type': 'marker',
        'marker-color': 'primary',
        // 'marker-color': 'secondary',
        // 'icon-classes': 'las la-map-marker',
        'icon-classes': 'las la-mountain',
        'icon-color': 'secondary'
        // 'icon-color': 'primary'
      }
      const icon = this.mapGhostIcon
      return _.isEmpty(icon) ? def : icon
    },
    getProfileLegend () {
      // const lbl = this.profileLegend
      // return lbl ? lbl : this.$t('KElevationProfile.PROFILE_CHART_LEGEND')
      return this.title
    },
    getTerrainLegend () {
      const lbl = this.terrainLegend
      return lbl ? lbl : this.$t('KElevationProfile.TERRAIN_CHART_LEGEND')
    },
    updateChart (terrainDataset, profileDataset, profileColor, chartWidth) {
      const update = {
        type: 'line',
        data: { datasets: [] },
        plugins: [{
          // a simple plugin to display a vertical line at cursor position
          beforeEvent: (chart, args) => {
            if (args.event.type === 'mousemove') {
              if ((args.event.x >= chart.chartArea.left) &&
                  (args.event.x <= chart.chartArea.right)) {
                chart.config.options.vline.enabled = true
                chart.config.options.vline.x = args.event.x
              } else {
                chart.config.options.vline.enabled = false
              }
            } else if (args.event.type === 'mouseout') {
              chart.config.options.vline.enabled = false
              this.unhighlight(this.highlightFeature)
            }
          },
          afterDraw: (chart) => {
            const x = chart.config.options.vline.x
            const ctx = chart.ctx
            if (chart.config.options.vline.enabled && !isNaN(x)) {
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
                this.highlightFeature.properties = this.getMapGhostIcon()
                this.highlight(this.highlightFeature)
              }
            }

            // restore tooltip and vline if they've been disabled during
            // pan or zoom animation
            if (context.chart.config.options.plugins.tooltip.enabled) return
            context.chart.config.options.plugins.tooltip.enabled = true
            context.chart.config.options.vline.enabled = true
            context.chart.update()
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
            enabled: false,
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

                  // hide tooltip & vline while zooming
                  context.chart.config.options.plugins.tooltip.enabled = false
                  context.chart.config.options.vline.enabled = false
                  return true
                }
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
                  // hide tooltip & vline while zooming
                  context.chart.config.options.plugins.tooltip.enabled = false
                  context.chart.config.options.vline.enabled = false
                  return true
                }
              }
            }
          }
        }
      }

      // Add profile elevation if provided
      if (profileDataset.length) {
        update.data.datasets.push({
          label: this.getProfileLegend(),
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
      if (terrainDataset.length) {
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

      this.$refs.chart.update(update)
    },

    async refresh () {
      const maxResolution = 30
      this.profile = null
      this.clearHighlights()
      if (!this.layer || !this.feature) return

      // Check supported geometry
      const geometry = _.get(this.feature, 'geometry.type')
      if (geometry !== 'LineString' && geometry !== 'MultiLineString') {
        logger.warn('the selected feature has an invald geometry')
        this.$notify({ type: 'negative', message: this.$t('KElevationProfile.INVALID_GEOMETRY') })
        return
      }
      this.highlight(this.feature)
      this.chartDistanceUnit = Store.get('units.default.length')
      this.chartHeightUnit = Store.get('units.default.altitude')

      // TODO: this is the window size, not the widget size ...
      const { window } = this.kActivity.findWindow('elevation-profile')
      const chartWidth = window.size[0]

      // Setup the request url options
      const endpoint = this.$store.get('capabilities.api.gateway') + '/elevation'
      const headers = { 'Content-Type': 'application/json' }
      // Add the Authorization header if jwt is defined
      const jwt = await this.$api.get('storage').getItem(this.$config('gatewayJwt'))
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
        profileDataset = fetchProfileDataset(this.feature, this.chartDistanceUnit, this.chartHeightUnit)
        this.updateChart([], profileDataset, profileColor, chartWidth)
        const queries = await fetchElevation(
          endpoint, this.feature, this.chartDistanceUnit, this.chartHeightUnit, {
            additionalHeaders: headers,
            defaultResolution: defaultRes,
            defaultResolutionUnit: 'm'
          })
        const { dataset, geojson } = extractElevation(queries)
        terrainDataset = dataset
        this.profile = geojson
      } catch (error) {
        this.$notify({ type: 'negative', message: this.$t('errors.NETWORK_ERROR') })
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
          this.$notify({ type: 'positive', message: this.$t('KElevationProfile.PROFILE_COPIED') })
        } catch (error) {
          this.$notify({ message: this.$t('KElevationProfile.CANNOT_COPY_PROFILE') })
          logger.error(error)
        }
      }
    },
    onExportProfile () {
      if (this.profile) {
        const file = this.title + '.geojson'
        const status = exportFile(file, JSON.stringify(this.profile))
        if (status) this.$notify({ type: 'positive', message: this.$t('KElevationProfile.PROFILE_EXPORTED', { file }) })
        else this.$notify({ message: this.$t('KElevationProfile.CANNOT_EXPORT_PROFILE') })
      }
    }
  },
  mounted () {
    this.debouncedRefresh = _.debounce(this.refresh, 100)

    // Setup listeners
    this.$events.on('units-default-length-changed', this.debouncedRefresh)
    this.$events.on('units-default-altitude-changed', this.debouncedRefresh)
  },
  beforeUnmount () {
    // Release listeners
    this.$events.off('units-default-length-changed', this.debouncedRefresh)
    this.$events.off('units-default-altitude-changed', this.debouncedRefresh)
  },
  setup (props) {
    return {
      ...useCurrentActivity(),
      ...useHighlight('elevation-profile', props.highlight)
    }
  }
}
</script>
