<template>
  <k-modal ref="modal" :title="$t('KLayerConnectDialog.TITLE')" :buttons="getButtons()" :toolbar="getToolbar()">
    <div slot="modal-content">
      <q-input v-model="url" @blur="onUrlLooseFocus" :label="$t('KLayerConnectDialog.URL_HINT')" :loading="detectingService" type="url">
      </q-input>
      <q-select v-model="selectedLayers" :options="availableLayers" :label="$t('KLayerConnectDialog.LAYER_HINT')" @input="onSelectedLayerChanged">
        <q-badge v-if="service" color="red" floating transparent>
          {{`${service}`}}
        </q-badge>
        <template v-slot:prepend>
          <q-icon name="las la-layer-group" />
        </template>
  <!--
       <template v-slot:append>
         <q-spinner-cube size="3em"/>
       </template>
  -->
      </q-select>
      <q-input v-model="layerName" :label="$t('KLayerConnectDialog.LAYER_NAME_HINT')"/>
      <q-input v-model="layerDescription" :label="$t('KLayerConnectDialog.LAYER_DESCRIPTION_HINT')"/>
      <q-select v-if="featureIdRequired" v-model="selectedFeatureId" :options="availableFeatureIds" label-color="red" :label="$t('KLayerConnectDialog.FID_HINT')" @input="onSelectedFeatureIdChanged">
        <template v-slot:prepend>
          <q-icon name="las la-id-card" />
        </template>
      </q-select>
      <q-select v-if="layerStyleRequired" v-model="selectedLayerStyle" :options="availableLayerStyles" label-color="red" :label="$t('KLayerConnectDialog.LAYER_STYLE_HINT')" @input="onSelectedLayerStyleChanged">
        <template v-slot:prepend>
          <q-icon name="las la-id-card" />
        </template>
      </q-select>
    </div>
  </k-modal>
</template>

<script>
import { KModal } from '../../../core/client/components/frame'
import * as wms from '../../common/wms-utils'
import * as wfs from '../../common/wfs-utils'
import * as wcs from '../../common/wcs-utils'

export default {
  name: 'k-layer-connect-dialog',
  components: {
    KModal
  },
  props: {
  },
  data () {
    return {
      url: '',
      layerName: '',
      layerDescription: '',
      detectingService: false,
      service: '',
      selectedLayers: '',
      availableLayers: [],
      featureIdRequired: false,
      availableFeatureIds: [],
      selectedFeatureId: '',
      layerStyleRequired: false,
      availableLayerStyles: [],
      selectedLayerStyle: ''
    }
  },
  methods: {
    getToolbar () {
      return [
        { name: 'close', icon: 'las la-times', handler: () => { this.doCancel() } }
      ]
    },
    getButtons () {
      return [
        { name: 'connect-button', label: this.$t('KLayerConnectDialog.CONNECT_BUTTON'), color: 'primary', handler: () => this.doConnect() }
      ]
    },
    open () {
      this.$refs.modal.open()
    },
    guessFid () {
      for (const prop of this.availableFeatureIds) {
        const lower = prop.toLowerCase()
        if (lower.includes('fid') || lower.includes('featureid')) return prop
      }

      return null
    },
    findQueryParameter (all, key) {
      const normalizedKey = key.toUpperCase()
      for (const p of all) {
        const k = p[0].toUpperCase()
        if (k === normalizedKey) return p[1].toUpperCase()
      }

      return null
    },
    async probeEndpoint (urlstr) {
      const probe = {
        url: null,
        baseUrl: null,
        service: null,
        availableLayers: [],
        queriedLayers: []
      }

      const url = new URL(urlstr)
      probe.url = url
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        // look for SERVICE=xxx
        const service = this.findQueryParameter(url.searchParams, 'SERVICE')
        if (service === 'WMS') probe.service = 'WMS'
        else if (service === 'WMTS') probe.service = 'WMTS'
        else if (service === 'WFS') probe.service = 'WFS'
        else if (service === 'WCS') probe.service = 'WCS'
        else if (service) console.log(`Unsupported service: ${service}`)
        else console.log('maybe TMS')

        probe.baseUrl = `${url.protocol}//${url.host}${url.pathname}`

        // fetch service capabilities
        let capabilities = null
        if (probe.service) {
          if (probe.service === 'WMS') capabilities = await wms.GetCapabilities(probe.baseUrl)
          else if (probe.service === 'WFS') capabilities = await wfs.GetCapabilities(probe.baseUrl)
          else if (probe.service === 'WCS') capabilities = await wcs.GetCapabilities(probe.baseUrl)
        } else {
          // probe url using different service requests
          const attempts = [
            { service: 'WMS', req: wms.GetCapabilities },
            { service: 'WFS', req: wfs.GetCapabilities },
            { service: 'WCS', req: wcs.GetCapabilities }
          ]

          for (const attempt of attempts) {
            try {
              capabilities = await attempt.req(probe.baseUrl)
              if (capabilities) probe.service = attempt.service
            } catch (err) {}
          }
        }

        // list available layers and check if layer was requested in probe url
        if (probe.service && capabilities) {
          if (probe.service === 'WMS') {
            const caps = wms.decodeCapabilities(capabilities)
            probe.availableLayers = caps.availableLayers
            const request = this.findQueryParameter(url.searchParams, 'REQUEST')
            if (request === 'GETMAP') {
              const layers = this.findQueryParameter(url.searchParams, 'LAYERS')
              probe.queriedLayers = layers.split(',')
            }
          } else if (probe.service === 'WMTS') {
            const request = this.findQueryParameter(url.searchParams, 'REQUEST')
            if (request === 'GETTILE') {
              const layer = this.findQueryParameter(url.searchParams, 'LAYER')
              probe.queriedLayers.push(layer)
            }
          } else if (probe.service === 'WFS') {
            const caps = wfs.decodeCapabilities(capabilities)
            probe.availableLayers = caps.availableLayers
            const request = this.findQueryParameter(url.searchParams, 'REQUEST')
            if (request === 'GETFEATURE') {
              const layer = this.findQueryParameter(url.searchParams, 'TYPENAME')
              probe.queriedLayers.push(layer)
            }
          } else if (probe.service === 'WCS') {
            const caps = wcs.decodeCapabilities(capabilities)
            probe.availableLayers = caps.availableLayers
            const request = this.findQueryParameter(url.searchParams, 'REQUEST')
            if (request === 'GETCOVERAGE') {
              const layer = this.findQueryParameter(url.searchParams, 'COVERAGE')
              probe.queriedLayers.push(layer)
            }
          }
        }
      }

      return probe
    },
    async onUrlLooseFocus () {
      this.detection = null
      this.display2id = {}
      this.featureIdRequired = false
      this.availableFeatureIds = []
      this.layerStyleRequired = false
      this.availableLayerStyles = []

      this.detectingService = true
      try {
        this.detection = await this.probeEndpoint(this.url)
        if (this.detection.availableLayers) {
          for (const layer of this.detection.availableLayers) {
            this.display2id[layer.display] = layer.id
          }
          this.availableLayers = this.detection.availableLayers.map(l => l.display)
        }
        if (this.detection.queriedLayers) {
          this.selectedLayers = this.detection.queriedLayers
        }
      } catch (err) {}
      this.detectingService = false

      if (this.detection) {
        this.service = this.detection.service
        this.featureIdRequired = this.detection.service === 'WFS'
        // this.layerStyleRequired = this.detection.service === 'WMS'
      }
    },
    async onSelectedLayerChanged (value) {
      if (this.layerName === '') this.layerName = value
      if (this.layerDescription === '') this.layerDescription = `${this.selectedLayers} - ${this.detection.url.hostname}`

      if (this.detection.service === 'WMS') {
        this.availableLayerStyles = []
        this.detection.availableLayers.forEach(l => {
          if (l.display === value) this.availableLayerStyles = l.styles.map(s => s.display)
        })

        if (this.availableLayerStyles.length === 1) this.selectedLayerStyle = this.availableLayerStyles[0]
        else this.layerStyleRequired = true
      } else if (this.detection.service === 'WFS') {
        // detect available properties
        this.detectingProps = true
        try {
          const dec = await wfs.DescribeFeatureType(this.detection.baseUrl, this.display2id[value])
                               .then(json => wfs.decodeFeatureType(json))
          this.availableFeatureIds = dec.properties.map(prop => prop.name)
        } catch (err) {}
        this.detectingProps = false

        const guess = this.guessFid()
        if (guess) this.selectedFeatureId = guess
      }
    },
    onSelectedFeatureIdChanged (value) {
    },
    onSelectedLayerStyleChanged (value) {
    },
    doCancel () {
      this.$refs.modal.close()
    },
    doConnect () {
      this.$refs.modal.close()
      if (this.selectedLayers) {
        const parameters = {
          url: this.detection.baseUrl,
          service: this.detection.service,
          name: this.layerName,
          description: this.layerDescription,
          icon: 'las la-plug',
          layer: this.display2id[this.selectedLayers]
        }
        if (parameters.service === 'WFS') {
          parameters.wfs = {
            featureId: this.selectedFeatureId
          }
        }
        if (parameters.service === 'WMS') {
          parameters.wms = {
            // transparent: ,
            // format: ,
            layerStyle: this.selectedLayerStyle
          }
        }
        this.$emit('connect', parameters)
      }
    }
  }
}
</script>
