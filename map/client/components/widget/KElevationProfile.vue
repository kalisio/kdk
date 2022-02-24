<template>
  <div class="row" :style="widgetStyle">
    <!-- Actions -->
    <k-panel id="elevation-profile-actions" class="q-pa-sm" :content="actions" direction="vertical" />
    <div v-if='profile' class='col fit row'>
      <!-- Title -->
      <span v-if="featureName" class="col-12 q-pa-sm">
        {{ featureName }} 
      </span>
      <!-- Graph -->
      <k-chart class="q-pa-xs full-width" :config="chartConfig" />
    </div>
    <div v-else class="absolute-center">
      <k-stamp 
        icon="las la-exclamation-circle"  
        icon-size="3rem" 
        :text="$t('KElevationProfile.NO_DATA_AVAILABLE')" 
        text-size="1rem" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { baseWidget } from '../../../../core/client/mixins'
import { colors, copyToClipboard, exportFile } from 'quasar'
import { Chart, PointElement, LineElement, ArcElement, LineController, CategoryScale, LinearScale, Filler, Tooltip } from 'chart.js'

Chart.register(
  PointElement,
  LineElement,
  ArcElement,
  LineController,
  CategoryScale,  
  LinearScale,
  Filler,
  Tooltip
)

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
    featureName () {
      return _.get(this.feature, 'name') ||
             _.get(this.feature, 'label') ||
             _.get(this.feature, 'properties.name') ||
             _.get(this.feature, 'properties.label') ||
             _.get(this.layer, 'name') ||
             _.get(this.layer, 'properties.name')
    },
    chartConfig () {
      return {
        type: 'line',
        data: {
          labels: this.chartLabels,
          datasets: this.chartDatasets
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true
            }
          }
        }
      }
    },
    actions () {
      return  {
        default: [
          { 
            id: 'center-view', 
            icon: 'las la-eye', 
            tooltip: this.$t('KElevationProfile.CENTER_ON'),
            disabled: this.feature ? false : true,
            handler: this.onCenterOn 
          },
          { 
            id: 'copy-properties', 
            icon: 'las la-clipboard', 
            tooltip: this.$t('KElevationProfile.COPY_PROFILE'), 
            disabled: this.profile ? false : true,
            handler: this.onCopyProfile
          },
          { 
            id: 'export-feature', 
            icon: 'img:statics/json-icon.svg', 
            tooltip: this.$t('KElevationProfile.EXPORT_PROFILE'), 
            disabled: this.profile ? false : true,
            handler: this.onExportProfile
          }
        ]
      }
    }
  },
  data () {
    return {
      profile: null,
      chartLabels: [],
      chartDatasets: []
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
    async refresh () {
      this.profile = null
      if (this.feature && this.layer) {
        const geometry = _.get(this.feature, 'geometry.type')
        if (geometry==='LineString') {
          this.kActivity.centerOnSelection()
          // Setuip the computation options
          this.feature.resolution = '90'
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
              let heights = []
              let labels = []
              let distance = 0
              _.forEach(this.profile.features, feature => {
                  heights.push(_.get(feature, 'properties.z', 0))
                  labels.push(distance)
                  distance+=90
              })
              this.chartLabels=labels
              this.chartDatasets = [{
                data: heights,
                fill: true,
                borderColor: colors.getBrand('primary'),
                backgroundColor: colors.getBrand('accent'),
                pointRadius: 0
              }]
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
        const file = this.featureName + '.geojson'
        const status = exportFile(file, JSON.stringify(this.profile))
        if (status) this.$toast({ type: 'positive', message: this.$t('KElevationProfile.PROFILE_EXPORTED', { file }) })
        else this.$toast({ type: 'negative', message: this.$t('KElevationProfile.CANNOT_EXPORT_PROFILE') })
      }
    }
  },
  beforeCreate () {
    // laod the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-chart'] = this.$load('frame/KChart')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  }
}
</script>
