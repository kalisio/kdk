<template>
  <div id="elevation-profile" class="column" :style="widgetStyle">
    <k-chart ref="chart" class="col q-pl-sm q-pr-sm" />
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { baseWidget } from '../../../../core/client/mixins'
import { Units } from '../../../../core/client/units'
import { KChart, KPanel, KStamp } from '../../../../core/client/components'
import { getCssVar, copyToClipboard, exportFile } from 'quasar'
import along from '@turf/along'
import length from '@turf/length'
import flatten from '@turf/flatten'
import { segmentEach, coordEach } from '@turf/meta'
import { featureCollection, point } from '@turf/helpers'

export default {
  name: 'k-elevation-profile',
  inject: ['kActivity'],
  components: {
    KChart,
    KPanel,
    KStamp
  },
  mixins: [baseWidget],
  props: {
    feature: {
      type: Object,
      default: null
    },
    layer: {
      type: Object,
      default: null
    }
  },
  computed: {
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
      immediate: true,
      handler () {
        this.refresh()
      }
    }
  },
  methods: {
    refreshActions () {
      this.$store.patch('window', {
        widgetActions: [
          {
            id: 'center-view',
            icon: 'las la-eye',
            tooltip: this.$t('KElevationProfile.CENTER_ON'),
            visible: this.feature,
            handler: this.onCenterOn
          },
          {
            id: 'copy-properties',
            icon: 'las la-clipboard',
            tooltip: this.$t('KElevationProfile.COPY_PROFILE'),
            visible: this.profile,
            handler: this.onCopyProfile
          },
          {
            id: 'export-feature',
            icon: 'img:statics/json-icon.svg',
            tooltip: this.$t('KElevationProfile.EXPORT_PROFILE'),
            visible: this.profile,
            handler: this.onExportProfile
          }
        ]
      })
    },
    extractProfileData (profiles) {
      // Extract profile heights if available on the segments used to compute elevation
      const profileHeights = []
      const profileLabels = []
      let allCoordsHaveHeight = true
      let curvilinearOffset = 0
      for (let i = 0; i < profiles.length && allCoordsHaveHeight; ++i) {
        const dataUnit = _.get(profiles[i], 'properties.altitudeUnit', 'm')
        // Gather elevation at each coord, make sure all coords have height along the way
        coordEach(profiles[i], (coord) => {
          if (coord.length > 2) profileHeights.push(Units.convert(coord[2], dataUnit, this.chartHeightUnit))
          else allCoordsHaveHeight = false
        })
        // Compute curvilinear abscissa at each point
        if (allCoordsHaveHeight) {
          segmentEach(profiles[i], (segment) => {
            if (profileLabels.length === 0) profileLabels.push(0)
            curvilinearOffset += length(segment, { units: 'kilometers' }) * 1000
            profileLabels.push(Units.convert(curvilinearOffset, 'm', this.chartDistanceUnit))
          })
        }
      }

      return allCoordsHaveHeight ? [profileHeights, profileLabels] : [[], []]
    },
    updateChart (terrainHeights, terrainLabels, profileHeights, profileLabels, chartWidth) {
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
                    if (i != lines.length - 1) {
                      if (abscissaKm > len) { abscissaKm -= len }
                      else { segment = lines[i] }
                    } else {
                      // last multi line segment, must be on this one
                      if (abscissaKm > len) { abscissaKm = len }
                      segment = lines[i]
                    }
                  }
                }

                const feature = along(segment, abscissaKm, { units: 'kilometers' })
                this.kActivity.updateSelectionHighlight('elevation-profile', feature)
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
      if (profileHeights.length) {
        update.data.datasets.push({
          label: this.$t('KElevationProfile.PROFILE_CHART_LEGEND'),
          data: profileHeights.map((h, i) => { return { x: profileLabels[i], y: h } }),
          fill: false,
          borderColor: '#51b0e8',
          backgroundColor: '#0986bc',
          pointRadius: 3
        })
        update.options.plugins.legend.display = true
      }

      // Add terrain elevation dataset
      update.data.datasets.push({
        label: this.$t('KElevationProfile.TERRAIN_CHART_LEGEND'),
        data: terrainHeights.map((h, i) => { return { x: terrainLabels[i], y: h } }),
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
      this.refreshActions()
      if (!this.layer || !this.feature) return

      // Check supported geometry
      const geometry = _.get(this.feature, 'geometry.type')
      if (geometry !== 'LineString' && geometry !== 'MultiLineString') {
        logger.warn('the selected feature has an invald geometry')
        this.$toast({ type: 'negative', message: this.$t('KElevationProfile.INVALID_GEOMETRY') })
        return
      }

      const featureStyle = { properties: { 'marker-type': 'marker' } }
      this.kActivity.addSelectionHighlight('elevation-profile', featureStyle)

      this.chartDistanceUnit = 'm'
      this.chartHeightUnit = Units.getDefaultUnit('altitude')

      // TODO: this is the window size, not the widget size ...
      const windowSize = this.$store.get('window.size')
      const chartWidth = windowSize[0]

      const queries = []
      const resolution = _.get(this.feature, 'properties.elevationProfile.resolution')
      const resolutionUnit = _.get(this.feature, 'properties.elevationProfile.resolutionUnit', 'm')
      const corridor = _.get(this.feature, 'properties.elevationProfile.corridorWidth')
      const corridorUnit = _.get(this.feature, 'properties.elevationProfile.corridorWidthUnit', 'm')
      const securityMargin = _.get(this.feature, 'properties.elevationProfile.securityMargin')
      const securityMarginUnit = _.get(this.feature, 'properties.elevationProfile.securityMarginUnit', 'm')
      if (geometry === 'MultiLineString') {
        flatten(this.feature).features.forEach((feature, index) => {
          queries.push({
            profile: feature,
            resolution: Units.convert(resolution[index], resolutionUnit, 'm'),
            corridorWidth: corridor ? Units.convert(corridor[index], corridorUnit, 'm') : null,
            securityMargin: securityMargin ? Units.convert(securityMargin[index], securityMarginUnit, 'm') : null
          })
        })
      } else {
        const pixelStep = 5
        const res = resolution ? Units.convert(resolution, resolutionUnit, 'm') : Math.max(length(this.feature, { units: 'kilometers' }) * 1000 / (chartWidth / pixelStep), maxResolution)
        queries.push({
          profile: this.feature,
          resolution: res,
          corridorWidth: corridor ? Units.convert(corridor, corridorUnit, 'm') : null,
          securityMargin: securityMargin ? Units.convert(securityMargin, securityMarginUnit, 'm') : null
        })
      }

      // Extract heights from profile if available
      const [profileHeights, profileLabels] = this.extractProfileData(queries.map((q) => q.profile))

      // Setup the request url options
      const endpoint = this.$store.get('capabilities.api.gateway') + '/elevation'
      const headers = { 'Content-Type': 'application/json' }
      // Add the Authorization header if jwt is defined
      const jwt = this.$api.get('storage').getItem(this.$config('gatewayJwt'))
      if (jwt) headers.Authorization = 'Bearer ' + jwt

      // Perform the requests
      let dismiss = null
      dismiss = this.$q.notify({
        group: 'profile',
        icon: 'las la-hourglass-half',
        message: this.$t('KElevationProfile.COMPUTING_PROFILE'),
        color: 'primary',
        timeout: 0,
        spinner: true
      })

      // Build a fetch per profile
      const fetchs = []
      for (const query of queries) {
        fetchs.push(fetch(endpoint +
                          `?resolution=${query.resolution}` +
                          (query.corridorWidth ? `&corridorWidth=${query.corridorWidth}` : '') +
                          (query.securityMargin ? `&elevationOffset=${query.securityMargin}` : ''), {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(query.profile),
          headers
        }))
      }

      let responses
      try {
        responses = await Promise.all(fetchs)
        for (const res of responses) {
          if (!res.ok) throw new Error('Fetch failed')
        }
      } catch (error) {
        // Network error
        dismiss()
        this.$toast({ type: 'negative', message: this.$t('errors.NETWORK_ERROR') })
        return
      }

      dismiss()

      // Each profile will have a point on start and end points
      // When we have multi line string, we skip the first point for all segment
      // after the first one
      let skipFirstPoint = false
      const terrainHeights = []
      const terrainLabels = []
      let curvilinearOffset = 0
      this.profile = []
      for (let i = 0; i < queries.length; ++i) {
        const points = await responses[i].json()
        // Each point on the elevation profile will contains two properties;
        // - z: the elevation in meters
        // - t: the curvilinear abscissa relative to the queried profile in meters
        points.features.forEach((point, index) => {
          if (skipFirstPoint && index === 0) return

          const clone = _.cloneDeep(point)
          // Since we may have multiple profile with different query parameters
          // offset t accordingly
          clone.properties.t = Units.convert(curvilinearOffset + _.get(point, 'properties.t', 0), 'm', this.chartDistanceUnit)
          this.profile.push(clone)

          terrainHeights.push(Units.convert(point.properties.z, 'm', this.chartHeightUnit))
          terrainLabels.push(clone.properties.t)
        })
        // Update curvilinear offset for next profile, and skip next profile's first point
        // since it'll match with the current profile last point
        curvilinearOffset += length(queries[i].profile, { units: 'kilometers' }) * 1000
        skipFirstPoint = true
      }

      this.updateChart(terrainHeights, terrainLabels, profileHeights, profileLabels, chartWidth)

      this.profile = featureCollection(this.profile)

      // Refresh the actions
      this.refreshActions()
    },
    onCenterOn () {
      this.kActivity.centerOnSelection()
    },
    async onCopyProfile () {
      if (this.profile) {
        try {
          await copyToClipboard(JSON.stringify(this.profile))
          this.$toast({ type: 'positive', message: this.$t('KElevationProfile.PROFILE_COPIED') })
        } catch (_) {
          this.$toast({ type: 'negative', message: this.$t('KElevationProfile.CANNOT_COPY_PROFILE') })
        }
      }
    },
    onExportProfile () {
      if (this.profile) {
        const file = this.title + '.geojson'
        const status = exportFile(file, JSON.stringify(this.profile))
        if (status) this.$toast({ type: 'positive', message: this.$t('KElevationProfile.PROFILE_EXPORTED', { file }) })
        else this.$toast({ type: 'negative', message: this.$t('KElevationProfile.CANNOT_EXPORT_PROFILE') })
      }
    }
  },
  beforeDestroy () {
    this.kActivity.removeSelectionHighlight('elevation-profile')
  }
}
</script>
