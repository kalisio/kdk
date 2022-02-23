<template>
  <div :style="widgetStyle">
    <div class="fit row">
      <!--q-resize-observer @resize="onResized" /-->
      <!-- Actions -->
      <k-panel id="elevation-profile-actions" class="q-pa-sm" :content="actions" direction="vertical" />
      <div v-if='hasProfile' class='col full-width row'>
        <!-- Title -->
        <!--span v-if="layerName" class="col-12 q-pl-sm">
          {{ layerName }} 
        </span-->
        <!-- Graph -->
        <!--k-chart class="q-pa-lg" :config="chartConfig" /-->
      </div>
      <div v-else class="absolute-center">
        <k-stamp icon="las la-exclamation-circle"  icon-size="3rem" :text="$t('KElevationProfile.NO_DATA_AVAILABLE')" text-size="1rem" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { baseWidget } from '../../../../core/client/mixins'
// import Chart from 'chart.js'

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
    chartConfig () {
      return {
        type: 'line',
        data: {
          labels: this.chartLabels,
          datasets: this.chartDatasets
        },
        options: this.chartOptions
      }
    }
  },
  data () {
    return {
      hasProfile: false,
      chartLabels: [],
      chartDatasets: [],
      chartOptions: {}
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
      if (this.feature && this.layer) {
        const geometry = _.get(this.feature, 'geometry.type')
        if (geometry==='LineString') {
          this.kActivity.centerOnSelection()
          // Setup the request url options
          //const endpoint = this.$store.get('capabilities.api.gateway') + '/elevation'
          const endpoint = 'https://api.planet.test.kalisio.xyz/elevation?resolution=30'
          const options = {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(this.feature),
            headers: {
              'Content-Type': 'application/json'
            }
          }
           // Add the Authorization header if jwt is defined
          // TODO const jwt = this.$api.get('storage').getItem(this.$config('gatewayJwt'))
          const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGU1Nzk3NC03NGRjLTQyYTQtOTYxNi1kODc0NzMzMjhkNjgiLCJuYW1lIjoia2FsaXNpby1pbmZyYS1kZXYiLCJpc3MiOiJrYWxpc2lvIiwiYXVkIjoicGxhbmV0LnRlc3Qua2FsaXNpby54eXoifQ.--oouMnPprn2XAiShwmtNaVpvQr0fRju2Qzn4eK2qeQ'
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
              const profile = await response.json()
              console.log(profile)
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
    }
  },
  beforeCreate () {
    // laod the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    //this.$options.components['k-chart'] = this.$load('frame/KChart')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  },
  created () {
    // Registers the actions
    this.actions = {
      default: [
        { id: 'center-view', icon: 'las la-eye', tooltip: this.$t('KInformationBox.CENTER_ON'), handler: this.onCenterOn },
        { id: 'copy-properties', icon: 'las la-clipboard', tooltip: this.$t('KInformationBox.COPY_PROPERTIES'), handler: this.onCopyProperties },
        { id: 'export-feature', icon: 'img:statics/json-icon.svg', tooltip: this.$t('KInformationBox.EXPORT_FEATURE'), handler: this.onExportFeature }
      ]
    }
  }
}
</script>
