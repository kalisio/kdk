<template>
  <div id="elevation-profile" class="column">
    <k-chart ref="chart" class="col q-pl-sm q-pr-sm" />
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { getCssVar, copyToClipboard, exportFile } from 'quasar'
import along from '@turf/along'
import length from '@turf/length'
import flatten from '@turf/flatten'
import { segmentEach, coordEach } from '@turf/meta'
import { featureCollection } from '@turf/helpers'
import { Units } from '../../../../core/client/units'
import { KChart, KPanel, KStamp } from '../../../../core/client/components'
import { useCurrentActivity, useHighlight } from '../../composables'
import { fetchProfileDataset, fetchElevationDataset } from '../../elevation-utils.js'

// TODO: user settings are not loaded (units)
// TODO: update pan/zoom with ability over scale
// TODO: abscissa axis labels seem broken
// TODO: restore security margin ?

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
    }
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
                this.highlightFeature.properties = { 'marker-type': 'marker' }
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
                text: this.$t('KElevationProfile.CURVILINEAR_AXIS_LEGEND', { unit: this.chartDistanceUnit })
              }
            },
            y: {
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: this.$t('KElevationProfile.HEIGHT_AXIS_LEGEND', { unit: this.chartHeightUnit })
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
                /*
                title: (context) => {
                  let title = `${context[0].parsed.x.toFixed(2)} ${this.chartDistanceUnit}`
                  return title
                },
                */
                label: (context) => {
                  let label = context.dataset.label || ''
                  if (label) label += ': '
                  if (context.parsed.y !== null) label += Units.format(context.parsed.y, this.chartHeightUnit)
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
          label: this.$t('KElevationProfile.PROFILE_CHART_LEGEND'),
          data: profileDataset,
          fill: false,
          borderColor: profileColor,
          backgroundColor: '#0986bc',
          pointRadius: 3
        })
        update.options.plugins.legend.display = true
      }

      // Add terrain elevation dataset
      update.data.datasets.push({
        label: this.$t('KElevationProfile.TERRAIN_CHART_LEGEND'),
        data: terrainDataset,
        fill: true,
        borderColor: '#635541',
        backgroundColor: '#c9b8a1',
        pointRadius: 2
      })

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
      this.chartDistanceUnit = 'm'
      this.chartHeightUnit = Units.getDefaultUnit('altitude')

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

      let terrainDataset, profileDataset
      try {
        // Default evelation resolution is max(1 point every 5 pixels, 30m)
        const defaultRes = Math.max(length(this.feature, { units: 'kilometers' }) * 1000 / (chartWidth / 5), 30)
        terrainDataset = await fetchElevationDataset(endpoint, headers, this.feature, this.chartDistanceUnit, this.chartHeightUnit, defaultRes, 'm')
        profileDataset = fetchProfileDataset(this.feature, this.chartDistanceUnit, this.chartHeightUnit)
        // TODO: restore securityMargin
      } catch (error) {
        activity.$notify({ type: 'negative', message: i18n.t('errors.NETWORK_ERROR') })
      }

      dismiss()

      // try to extract line color from layer if available
      const layer = this.layer
      let profileColor
      if (_.has(layer, 'leaflet.stroke-color')) profileColor = _.get(layer, 'leaflet.stroke-color')
      if (profileColor === undefined) profileColor = _.get(this.kActivity, 'activityOptions.engine.featureStyle.stroke-color', '#51b0e8')
      this.updateChart(terrainDataset, profileDataset, profileColor, chartWidth)

      this.profile = featureCollection(this.profile)
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
  setup (props) {
    return {
      ...useCurrentActivity(),
      ...useHighlight('elevation-profile', props.highlight)
    }
  }
}
</script>
