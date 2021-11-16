<template>
  <div class="q-pl-md q-pr-sm row justify-center items-center no-wrap q-gutter-x-sm">
    <q-select 
      v-model="resolution" 
      :options="getResolutions()" 
      dense 
      borderless />
    <q-input 
      v-model.number="width" 
      type="number" 
      mask="(#)###" 
      dense 
      borderless 
      style="max-width: 60px" />
    <span>x</span>
    <q-input 
      v-model.number="height" 
      type="number" 
      mask="(#)###" 
      dense 
      borderless 
      style="max-width: 60px" />
    <k-action 
      id="capture-button" 
      icon="las la-camera" 
      tooltip="KCaptureToolbar.CAPTURE_ACTION" 
      :handler="() => this.capture()" />
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-capture-toolbar',
  inject: ['kActivity'],
  data () {
    return {
      width: 1280,
      height: 720,
      resolution: undefined
    }
  },
  watch: {
    resolution: {
      immediate: true,
      handler (value) {
        if (!value) this.resolution = this.getResolutions()[1]
        else {
          const size=_.split(this.resolution.value, 'x')
          this.width=size[0]
          this.height=size[1]
        }
      }
    }
  },
  methods: {
    getResolutions () {
      return [
        { label: this.$t('KCaptureToolbar.SD'), value: '640x480' },
        { label: this.$t('KCaptureToolbar.HD'), value: '1280x720' },
        { label: this.$t('KCaptureToolbar.FHD'), value: '1920x1080' },
        { label: this.$t('KCaptureToolbar.QHD'), value: '2560x1440' },
        { label: this.$t('KCaptureToolbar.2K'), value: '2048x1080' },
        { label: this.$t('KCaptureToolbar.4K'), value: '3840x2160' },
        { label: this.$t('KCaptureToolbar.8K'), value: '7680x4320' }
      ]
    },
    async capture () {
      // Iterate through the layers 
      // TODO
      /*let layers = await this.kActivity.getCatalogLayers()
      console.log(this.$config('mapActivity.catalog.categories'))*/

      // Setup the request url options
      let endpoint = this.$config('gateway') + '/capture'
      let options = {
        method: 'POST',
        //mode: 'no-cors',
        body: JSON.stringify({ size: { width: this.width, height: this.height }}),
        headers: { 
          'Content-Type': 'application/json'
        }
      }
      // Add the Authorization header if jwt is defined
      const jwt = this.$api.get('storage').getItem(this.$config('gatewayJwt'))
      if (jwt) options.headers['Authorization'] = 'Bearer ' + jwt
      // Perform the request
      try {
        await fetch(endpoint, options)  
      } catch (error) {
        this.$emit()
      }
    }
  },
  beforeCreate () {
    this.$options.components['k-action'] = this.$load('frame/KAction')
  }
}
</script>
