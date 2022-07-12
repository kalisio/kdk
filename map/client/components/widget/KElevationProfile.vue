<template>
  <div id="elevation-profile" class="column" :style="widgetStyle">
    <k-chart ref="chart" class="col q-pl-sm q-pr-sm" />
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { baseWidget } from '../../../../core/client/mixins'
import { colors, copyToClipboard, exportFile } from 'quasar'
import length from '@turf/length'
import flatten from '@turf/flatten'
import { segmentEach, coordEach } from '@turf/meta'
import { featureCollection } from '@turf/helpers'

export default {
  name: 'k-elevation-profile',
  inject: ['kActivity'],
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
        // Gather elevation at each coord, make sure all coords have height along the way
        coordEach(profiles[i], (coord) => {
          if (coord.length > 2) profileHeights.push(coord[2])
          else allCoordsHaveHeight = false
        })
        // Compute curvilinear abscissa at each point
        if (allCoordsHaveHeight) {
          segmentEach(profiles[i], (segment) => {
            if (profileLabels.length === 0) profileLabels.push(0)
            curvilinearOffset += length(segment, { units: 'kilometers' }) * 1000
            profileLabels.push(curvilinearOffset)
          })
        }
      }

      return allCoordsHaveHeight ? [profileHeights, profileLabels] : [[], []]
    },
    updateChart (terrainHeights, terrainLabels, profileHeights, profileLabels) {
      const update = {
        type: 'line',
        data: { datasets: [] },
        plugins: [{
          // a simple plugin to display a vertical line at cursor position
          beforeEvent: (chart, args) => {
            if ((args.event.type === 'mousemove')
                && (args.event.x >= chart.chartArea.left)
                && (args.event.x <= chart.chartArea.right)
               ) {
              chart.config.options.vline.enabled = true
              chart.config.options.vline.x = args.event.x
            } else if (args.event.type === 'mouseout') {
              chart.config.options.vline.enabled = false
            } else {
              console.log('foo')
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
          parsing: false, // because we'll provide data in chart native format
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
                text: this.$t('KElevationProfile.CURVILINEAR_AXIS_LEGEND')
              }
            },
            y: {
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: this.$t('KElevationProfile.HEIGHT_AXIS_LEGEND')
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
              /*
                callbacks: {
                label: (context) => {
                let label = context.dataset.label || ''
                if (label) label += ': '
                if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                }
                return label;
                }
                }
              */
            },
            decimation: {
              enabled: true,
              algorithm: 'lttb'
              },
            zoom: {
              zoom: {
                drag: {
                  enabled: true,
                  modifierKey: 'ctrl',
                  backgroundColor: colors.getBrand('secondary')
                },
                wheel: {
                  enabled: true
                },
                mode: 'x'
              },
              pan: {
                enabled: true
              },
              limits: {
                x: { min: 'original', max: 'original' },
                y: { min: 'original', max: 'original' }
              }
            }
          }
        }
      }

      // Add profile elevation if provided
      if (profileHeights.length) {
        update.data.datasets.push({
          label: this.$t('KElevationProfile.PROFILE_CHART_LEGEND'),
          data: profileHeights.map((h, i) => { return { x: profileLabels[i], y: h }}),
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
        data: terrainHeights.map((h, i) => { return { x: terrainLabels[i], y: h }}),
        fill: true,
        borderColor: '#635541',
        backgroundColor: '#c9b8a1',
        pointRadius: 2
      })

      this.$refs.chart.update(update)
    },

    async refresh () {
      const nbOfPoints = 200
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

      const queries = []
      const resolutions = _.get(this.feature, 'properties.elevationProfileResolution')
      const corridors = _.get(this.feature, 'properties.elevationProfileCorridorWidth')
      if (geometry === 'MultiLineString') {
        flatten(this.feature).features.forEach((feature, index) => {
          queries.push({
            profile: feature,
            resolution: resolutions[index],
            corridorWidth: corridors ? corridors[index] : null
          })
        })
      } else {
        queries.push({
          profile: this.feature,
          resolution: resolutions ? resolutions : Math.max(length(this.feature, { units: 'kilometers' }) * 1000 / nbOfPoints, maxResolution),
          corridorWidth: corridors ? corridors : null
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
        fetchs.push(fetch(endpoint + `?resolution=${query.resolution}` + (query.corridorWidth ? `&corridorWidth=${query.corridorWidth}` : ''), {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(query.profile),
          headers }))
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
          clone.properties.t = curvilinearOffset + _.get(point, 'properties.t', 0)
          this.profile.push(clone)

          terrainHeights.push(point.properties.z)
          terrainLabels.push(clone.properties.t)
        })
        // Update curvilinear offset for next profile, and skip next profile's first point
        // since it'll match with the current profile last point
        curvilinearOffset += length(queries[i].profile, { units: 'kilometers' }) * 1000
        skipFirstPoint = true
      }

      this.updateChart(terrainHeights, terrainLabels, profileHeights, profileLabels)

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
  beforeCreate () {
    // laod the required components
    this.$options.components['k-chart'] = this.$load('chart/KChart')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  }
}
</script>
