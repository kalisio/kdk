<template>
  <k-modal ref="modal" :title="$t('KLayerConnectDialog.TITLE')" :buttons="getButtons()" :toolbar="getToolbar()">
    <div slot="modal-content">
      <q-select v-model="selectedUrl" :options="urlOptions" use-input @filter="filterUrl" @new-value="newUrl" :label="$t('KLayerConnectDialog.URL_HINT')" @input="selectUrl" clearable/>
      <q-select v-model="selectedLayers" :options="layerOptions" :label="$t('KLayerConnectDialog.LAYER_HINT')" :loading="probingService" @input="selectLayer">
        <q-badge v-if="service" color="red" floating transparent>
          {{`${service}`}}
        </q-badge>
        <template v-slot:prepend>
          <q-icon name="las la-layer-group" />
        </template>
      </q-select>
      <q-input v-model="layerName" :label="$t('KLayerConnectDialog.LAYER_NAME_HINT')" clearable/>
      <q-input v-model="layerDescription" :label="$t('KLayerConnectDialog.LAYER_DESCRIPTION_HINT')" clearable/>
      <q-select v-if="featureIdRequired" v-model="selectedFeatureId" :options="featureIdOptions" label-color="red" :label="$t('KLayerConnectDialog.FID_HINT')" @input="selectFeatureId" :loading="probingFeatureProps">
        <template v-slot:prepend>
          <q-icon name="las la-id-card" />
        </template>
      </q-select>
      <q-select v-if="layerStyleRequired" v-model="selectedLayerStyle" :options="layerStyleOptions" label-color="red" :label="$t('KLayerConnectDialog.LAYER_STYLE_HINT')" @input="selectLayerStyle">
        <template v-slot:prepend>
          <q-icon name="las la-palette" />
        </template>
      </q-select>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { KModal } from '../../../core/client/components/frame'
import * as wms from '../../common/wms-utils'
import * as wfs from '../../common/wfs-utils'
// import * as wcs from '../../common/wcs-utils'

export default {
  name: 'k-layer-connect-dialog',
  components: {
    KModal
  },
  props: {
    availableUrls: {
      type: Array,
      default: () => {
        return []
      }
    },
    baseLayer: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      urlOptions: [],
      selectedUrl: '',
      layerName: '',
      layerDescription: '',
      probingService: false,
      service: '',
      layerOptions: [],
      selectedLayers: '',
      probingFeatureProps: false,
      featureIdRequired: false,
      selectedFeatureId: '',
      featureIdOptions: [],
      selectedLayerStyle: '',
      layerStyleRequired: false,
      layerStyleOptions: []
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
      this.urlOptions = this.availableUrls
      this.url = null

      this.$refs.modal.open()
    },
    guessFeatureId () {
      for (const prop of this.featureIdOptions) {
        const lower = prop.toLowerCase()
        if (lower === 'id' || lower.includes('fid') || lower.includes('featureid')) return prop
      }

      return null
    },
    guessLayerStyle () {
      if (this.layerStyleOptions.length === 1) return this.layerStyleOptions[0]
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
    async probeEndpoint (url) {
      const probe = {
        baseUrl: null,
        service: null,
        version: '',
        availableLayers: []
      }

      // we expect WMS/WFS/WCS/WMTS/TMS get capabilities url here

      try {
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          probe.baseUrl = `${url.protocol}//${url.host}${url.pathname}`

          // look for SERVICE=xxx
          const service = this.findQueryParameter(url.searchParams, 'SERVICE')
          if (service === 'WMS') probe.service = 'WMS'
          else if (service === 'WMTS') probe.service = 'WMTS'
          else if (service === 'WFS') probe.service = 'WFS'
          else if (service === 'WCS') probe.service = 'WCS'
          else if (service) console.log(`Unsupported service: ${service}`)
          else console.log('maybe TMS')
        }

        if (probe.service === 'WMS') {
          const caps = await wms.fetchAsJson(url.href)
          const decoded = wms.decodeCapabilities(caps)
          probe.availableLayers = decoded.availableLayers
          probe.version = this.findQueryParameter(url.searchParams, 'VERSION')
          if (!probe.version) probe.version = decoded.version
        } else if (probe.service === 'WFS') {
          const caps = await wfs.fetchAsJson(url.href)
          const decoded = wfs.decodeCapabilities(caps)
          probe.availableLayers = decoded.availableLayers
          probe.version = this.findQueryParameter(url.searchParams, 'VERSION')
          if (!probe.version) probe.version = decoded.version
        } else if (probe.service === 'WCS') {
        }
      } catch (err) { console.error(err) }

      return probe
    },
    newUrl (val, done) {
      // keep in the model when val is a valid url
      try {
        const asurl = new URL(val)
        done(asurl.href, 'add-unique')
      } catch (err) {}
    },
    filterUrl (val, update) {
      update(() => {
        if (val === '') {
          this.urlOptions = this.availableUrls
        } else {
          const needle = val.toLowerCase()
          this.urlOptions = this.availableUrls.filter(v => v.toLowerCase().indexOf(needle) > -1)
        }
      })
    },
    async selectUrl (val) {
      this.url = new URL(val)
      this.searchParams = {}

      this.probe = null
      this.layerOptions = []
      this.selectedLayers = ''
      this.layerDisplay2id = {}
      this.featureIdRequired = false
      this.featureIdOptions = []
      this.layerStyleRequired = false
      this.layerStyleOptions = []
      this.layerSchema = {}

      // probe endpoint
      this.probingService = true
      this.probe = await this.probeEndpoint(this.url)
      this.probingService = false

      // extract additional search parameters required to make requests work
      const querySearchParams = []
      if (this.probe.service === 'WMS') {
        querySearchParams.push('SERVICE', 'VERSION', 'REQUEST')
      } else if (this.probe.service === 'WFS') {
        querySearchParams.push('SERVICE', 'VERSION', 'REQUEST')
      } else if (this.probe.service === 'WCS') {
      }

      if (querySearchParams) {
        for (const sp of this.url.searchParams) {
          if (querySearchParams.indexOf(sp[0].toUpperCase()) === -1) {
            this.searchParams[sp[0]] = sp[1]
          }
        }
      }

      if (this.probe.availableLayers) {
        for (const layer of this.probe.availableLayers) this.layerDisplay2id[layer.display] = layer.id
        this.layerOptions = this.probe.availableLayers.map(l => l.display)
      }

      this.service = this.probe.service
      this.featureIdRequired = this.probe.service === 'WFS'
    },
    async selectLayer (val) {
      if (val === '') return

      if (this.layerName === '') this.layerName = val
      if (this.layerDescription === '') this.layerDescription = `${this.selectedLayers} - ${this.url.hostname}`

      if (this.probe.service === 'WMS') {
        // WMS => detect available layer styles
        this.layerStyleOptions = []
        this.layerStyleDisplay2id = {}
        this.probe.availableLayers.forEach(l => {
          if (l.display === val) {
            if (l.styles) {
              for (const s of l.styles) this.layerStyleDisplay2id[s.display] = s.id
              this.layerStyleOptions = l.styles.map(s => s.display)
            }
          }
        })

        this.layerStyleRequired = this.layerStyleOptions.length > 1
        this.selectedLayerStyle = this.guessLayerStyle()
      } else if (this.probe.service === 'WFS') {
        // WFS => detect available properties
        this.probingFeatureProps = true
        try {
          const desc = await wfs.DescribeFeatureType(this.probe.baseUrl, this.probe.version, this.layerDisplay2id[val], this.searchParams)
          const decoded = wfs.decodeFeatureType(desc)
          this.featureIdOptions = decoded.properties.map(prop => prop.name)
          // generate properies schema using DescribeFeatureType request
          this.layerSchema = wfs.generatePropertiesSchema(desc, val)
        } catch (err) { console.error(err) }
        this.probingFeatureProps = false

        this.selectedFeatureId = this.guessFeatureId()
      }
    },
    selectFeatureId (val) {
    },
    selectLayerStyle (val) {
    },
    doCancel () {
      this.$refs.modal.close()
    },
    doConnect () {
      this.$refs.modal.close()

      if (!this.selectedLayers) return

      const createdLayer = Object.assign({}, this.baseLayer, {
        name: this.layerName,
        description: this.layerDescription
      })

      if (this.probe.service === 'WMS') {
        const layers = (typeof this.selectedLayers === 'Array')
              ? this.selectedLayers.map(l => this.layerDisplay2id[l]).join(',')
              : this.layerDisplay2id[this.selectedLayers]

        if (createdLayer.leaflet) {
          Object.assign(createdLayer.leaflet, {
            type: 'tileLayer.wms',
            source: this.probe.baseUrl,
            layers: layers,
            version: this.probe.version,
            // styles: this.layerStyleDisplay2id[this.selectedLayerStyle]
            format: 'image/png',
            transparent: true,
            bgcolor: 'FFFFFFFF'
          }, this.searchParams)
        }
      } else if (this.probe.service === 'WFS') {
        const layer = this.layerDisplay2id[this.selectedLayers]

        Object.assign(createdLayer, {
          isStyleEditable: true,
          featureId: this.selectedFeatureId,
          wfs: {
            url: this.probe.baseUrl,
            version: this.probe.version,
            searchParams: this.searchParams,
            layer: layer
          }
        })
        if (createdLayer.leaflet) {
          Object.assign(createdLayer.leaflet, {
            type: 'geoJson',
            realtime: true,
            tiled: true
          })
        }
        _.set(createdLayer, 'schema.content', this.layerSchema)
      }

      this.$emit('applied', createdLayer)
    }
  }
}
</script>
