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
import { segmentEach, coordEach } from '@turf/meta'

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
    async refresh () {
      const nbOfPoints = 200
      const maxResolution = 30
      this.profile = null
      this.refreshActions()
      if (this.feature && this.layer) {
        const geometry = _.get(this.feature, 'geometry.type')
        if (geometry === 'LineString') {
          this.kActivity.centerOnSelection()
          // Setup the computation options
          const featureLength = length(this.feature, { units: 'kilometers' }) * 1000 // in meter
          this.feature.resolution = Math.max(featureLength / nbOfPoints, maxResolution)
          // Setup the request url options
          const endpoint = this.$store.get('capabilities.api.gateway') + '/elevation'
          const options = {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(this.feature),
            headers: {
              'Content-Type': 'application/json'
            }
          }
          // Add the Authorization header if jwt is defined
          const jwt = this.$api.get('storage').getItem(this.$config('gatewayJwt'))
          if (jwt) options.headers.Authorization = 'Bearer ' + jwt
          // Perform the request
          let dismiss = null
          try {
            dismiss = this.$q.notify({
              group: 'profile',
              icon: 'las la-hourglass-half',
              message: this.$t('KElevationProfile.COMPUTING_PROFILE'),
              color: 'primary',
              timeout: 0,
              spinner: true
            })
            const response = await fetch(endpoint, options)
            dismiss()
            if (response.ok) {
              this.profile = await response.json()
              const heights = []
              const labels = []
              let distance = 0
              _.forEach(this.profile.features, feature => {
                heights.push(_.get(feature, 'properties.z', 0))
                labels.push(distance)
                distance += this.feature.resolution
              })

              const chartUpdate = {
                type: 'line',
                data: {
                  // elevation dataset
                  datasets: [{
                    label: 'Elevation',
                    data: heights.map((h, i) => { return { x: labels[i], y: h }}),
                    fill: true,
                    borderColor: '#635541',
                    backgroundColor: '#c9b8a1',
                    pointRadius: 3
                  }]
                },
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
                  parsing: false,
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
                        text: 'Curvilinear abscissa (meters)'
                      }
                    },
                    y: {
                      type: 'linear',
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Height (meters)'
                      }
                    }
                  },
                  vline: {
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
                    /*
                    decimation: {
                      enabled: true,
                      algorithm: 'lttb'
                    },
                    */
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
                    },
                  }
                }
              }

              const featureHeights = []
              const featureLabels = []
              coordEach(this.feature, (coord) => { if (coord.length > 2) featureHeights.push(coord[2]) })
              if (featureHeights.length) {
                // if original feature has elevation values
                distance = 0
                segmentEach(this.feature, (segment) => {
                  if (featureLabels.length === 0) {
                    featureLabels.push(distance)
                  }

                  distance += length(segment, { units: 'kilometers' }) * 1000
                  featureLabels.push(distance)
                })

                chartUpdate.data.datasets.push({
                  label: 'Altitude',
                  data: featureHeights.map((h, i) => { return { x: featureLabels[i], y: h }}),
                  fill: false,
                  borderColor: '#51b0e8',
                  backgroundColor: '#0986bc',
                  pointRadius: 3
                })
              }
              this.$refs.chart.update(chartUpdate)
            } else {
              this.$toast({ type: 'negative', message: this.$t('errors.' + response.status) })
            }
          } catch (error) {
            // Network error
            dismiss()
            this.$toast({ type: 'negative', message: this.$t('errors.NETWORK_ERROR') })
          }
        } else {
          logger.warn('the selected feature has an invald geometry')
          this.$toast({ type: 'negative', message: this.$t('KElevationProfile.INVALID_GEOMETRY') })
        }
      }
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
