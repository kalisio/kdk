<template>
  <div id="elevation-profile" class="column" :style="widgetStyle">
    <k-chart ref="chart" class="col q-pl-sm q-pr-sm" />
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { baseWidget } from '../../../../core/client/mixins'
import { KChart, KPanel, KStamp } from '../../../../core/client/components'
import { colors, copyToClipboard, exportFile } from 'quasar'
import { getCssVar, copyToClipboard, exportFile } from 'quasar'
import length from '@turf/length'

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
              this.$refs.chart.update({
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [{
                    data: heights,
                    fill: true,
                    borderColor: getCssVar('primary'),
                    backgroundColor: getCssVar('accent'),
                    pointRadius: 3
                  }]
                },
                options: {
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      type: 'linear',
                      beginAtZero: true
                    }
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
                    }
                  }
                }
              })
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
  }
}
</script>
