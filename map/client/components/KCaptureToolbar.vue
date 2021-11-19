<template>
  <div class="q-pl-sm q-pr-xs row justify-center items-center no-wrap q-gutter-x-xs">
    <q-select 
      v-model="resolution" 
      :options="getResolutions()"
      dense 
      borderless>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
          <q-item-section>
            <q-item-label v-html="scope.opt.label" />
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>{{ scope.opt.description }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input 
      v-model.number="width" 
      type="number" 
      mask="(#)###" 
      borderless
      dense
      input-class="text-center"
      style="max-width: 54px" />
    <span>x</span>
    <q-input 
      v-model.number="height" 
      type="number" 
      mask="(#)###" 
      dense 
      borderless
      input-class="text-center" 
      style="max-width: 54px" />
    <k-action 
      id="capture-button" 
      icon="las la-camera" 
      tooltip="KCaptureToolbar.CAPTURE_ACTION" 
      :handler="() => this.capture()" />
  </div>
</template>

<script>
import _ from 'lodash'
import { exportFile } from 'quasar'

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
        { label: this.$t('KCaptureToolbar.SD_LABEL'), description: this.$t('KCaptureToolbar.SD_DESCRIPTION'), value: '640x480' },
        { label: this.$t('KCaptureToolbar.HD_LABEL'), description: this.$t('KCaptureToolbar.HD_DESCRIPTION'), value: '1280x720' },
        { label: this.$t('KCaptureToolbar.FHD_LABEL'), description: this.$t('KCaptureToolbar.FHD_DESCRIPTION'), value: '1920x1080' },
        { label: this.$t('KCaptureToolbar.QHD_LABEL'), description: this.$t('KCaptureToolbar.QHD_DESCRIPTION'), value: '2560x1440' },
        { label: this.$t('KCaptureToolbar.2K_LABEL'), description: this.$t('KCaptureToolbar.2K_DESCRIPTION'), value: '2048x1080' },
        { label: this.$t('KCaptureToolbar.4K_LABEL'), description: this.$t('KCaptureToolbar.4K_DESCRIPTION'), value: '3840x2160' }
      ]
    },
    async capture () {
      console.log(this.width, this.height)
      // Iterate through the layers
      let layers = []
      const catalogLayers = await this.kActivity.getCatalogLayers()
      _.forOwn(this.kActivity.layers, (layer, name) => {
        const isDisabled = _.get(layer, 'isDisabled', false)
        if (!isDisabled) {
          const catalogLayer = _.find(catalogLayers, { name })
          if (catalogLayer) {
            if (layer.isVisible != _.get(catalogLayer, 'leaflet.isVisible', false)) {
              layers.push(name)
              console.log(name, layer)
            }
          }
        }
      })

      // Setup the request url options
      let endpoint = this.$config('gateway') + '/capture'
      endpoint = 'http://localhost:8090/capture'
      let options = {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({ layers, size: { width: +this.width, height: +this.height } }),
        headers: { 
          'Content-Type': 'application/json'
        }
      }
      // Add the Authorization header if jwt is defined
      const jwt = this.$api.get('storage').getItem(this.$config('gatewayJwt'))
      if (jwt) options.headers['Authorization'] = 'Bearer ' + jwt
      // Perform the request
      try {
        const response = await fetch(endpoint, options) 
        exportFile('capture.png', response.body)
        
      } catch (error) {

        // TODO this.$emit(error)
      }
    }
  },
  beforeCreate () {
    this.$options.components['k-action'] = this.$load('frame/KAction')
  }
}
</script>

