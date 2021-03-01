<template>
  <k-modal ref="modal" :title="$t('KLayerConnectDialog.TITLE')" :buttons="getButtons()" :toolbar="getToolbar()">
    <div slot="modal-content">
      <q-select v-model="selectedUrl" :options="urlOptions" use-input @filter="filterUrl" @new-value="newUrl" :label="$t('KLayerConnectDialog.URL_HINT')" @input="selectUrl" clearable/>
      <q-select v-model="selectedLayer" :options="layerOptions" :label="$t('KLayerConnectDialog.LAYER_HINT')" :loading="probingService" @input="selectLayer">
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
import fetch from 'node-fetch'
import xml2js from 'xml2js'
import { buildUrl } from '../../../core/common'
import { KModal } from '../../../core/client/components/frame'
import * as wms from '../../common/wms-utils'
import * as wfs from '../../common/wfs-utils'
import * as wmts from '../../common/wmts-utils'
import * as tms from '../../common/tms-utils'
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
      selectedLayer: '',
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
        searchParams: {},
        service: null,
        version: '',
        availableLayers: []
      }

      // we expect WMS/WFS/WCS/WMTS/TMS get capabilities url here

      /* if user:pwd
       * var headers = new Headers();
       headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
       fetch('https://host.com', {headers: headers})
       */

      try {
        let caps = null
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          probe.baseUrl = `${url.protocol}//${url.host}${url.pathname}`
          for (const [k, v] of url.searchParams) probe.searchParams[k] = v

          // fetch content and try to convert to json
          const query = url.href
          caps = await fetch(query)
                .then(resp => resp.text())
                .then(txt => xml2js.parseStringPromise(txt, { tagNameProcessors: [ xml2js.processors.stripPrefix ] }))

          // look for SERVICE=xxx
          const service = this.findQueryParameter(url.searchParams, 'SERVICE')
          if (service === 'WMS') probe.service = 'WMS'
          else if (service === 'WMTS') probe.service = 'WMTS'
          else if (service === 'WFS') probe.service = 'WFS'
          else if (service === 'WCS') probe.service = 'WCS'

          if (!probe.service) {
            // might be REST WMTS request, or TMS
            if (caps.Capabilities) {
              probe.service = 'WMTS'
              const lastSlash = url.pathname.lastIndexOf('/')
              probe.baseUrl = `${url.protocol}//${url.host}${url.pathname.slice(0, lastSlash)}`
            } else if (caps.TileMapService) {
              probe.service = 'TMS'
            }
          }

          // remove some known search params depending on service
          const knownSearchParams = new Set()
          if (probe.service === 'WMS' || probe.service === 'WFS' || probe.service === 'WMTS') {
            knownSearchParams.add('SERVICE')
            knownSearchParams.add('REQUEST')
            knownSearchParams.add('VERSION')
          }
          if (knownSearchParams) {
            _.keys(probe.searchParams).forEach(k => {
              if (knownSearchParams.has(k.toUpperCase())) {
                delete probe.searchParams[k]
              }
            })
          }
        }

        if (probe.service === 'WMS') {
          const decoded = await wms.discover(probe.baseUrl, probe.searchParams, caps)
          probe.availableLayers = decoded.availableLayers
          probe.version = this.findQueryParameter(url.searchParams, 'VERSION')
          if (!probe.version) probe.version = decoded.version
        } else if (probe.service === 'WFS') {
          const decoded = await wfs.discover(probe.baseUrl, probe.searchParams, caps)
          probe.availableLayers = decoded.availableLayers
          probe.version = this.findQueryParameter(url.searchParams, 'VERSION')
          if (!probe.version) probe.version = decoded.version
        } else if (probe.service === 'WMTS') {
          const decoded = await wmts.discover(probe.baseUrl, probe.searchParams, caps)
          probe.availableLayers = decoded.availableLayers
          probe.version = this.findQueryParameter(url.searchParams, 'VERSION')
          if (!probe.version) probe.version = decoded.version
        // } else if (probe.service === 'WCS') {
        } else if (probe.service === 'TMS') {
          const decoded = await tms.discover(probe.baseUrl, probe.searchParams, caps)
          probe.availableLayers = decoded.availableLayers
          probe.version = decoded.version
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

      this.probe = null
      this.layerOptions = []
      this.selectedLayer = ''
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
      if (this.layerDescription === '') this.layerDescription = `${this.selectedLayer} - ${this.url.hostname}`

      if (this.probe.service === 'WMS') {
        // WMS => detect available layer styles
        const layer = _.find(this.probe.availableLayers, l => l.display === val)
        this.layerStyleOptions = []
        this.layerStyleDisplay2id = {}
        if (layer.styles) {
          for (const s of layer.styles) this.layerStyleDisplay2id[s.display] = s.id
          this.layerStyleOptions = layer.styles.map(s => s.display)
        }

        this.layerStyleRequired = this.layerStyleOptions.length > 1
        this.selectedLayerStyle = this.guessLayerStyle()
      } else if (this.probe.service === 'WFS') {
        // WFS => detect available properties
        this.probingFeatureProps = true
        try {
          const desc = await wfs.DescribeFeatureType(this.probe.baseUrl, this.probe.version, this.layerDisplay2id[val], this.probe.searchParams)
          const decoded = wfs.decodeFeatureType(desc)
          this.featureIdOptions = decoded.properties.map(prop => prop.name)
          // generate properies schema using DescribeFeatureType request
          this.layerSchema = wfs.generatePropertiesSchema(desc, val)
        } catch (err) { console.error(err) }
        this.probingFeatureProps = false

        this.selectedFeatureId = this.guessFeatureId()
      } else if (this.probe.service === 'WMTS') {
        // WMTS => detect layer styles
        const layer = _.find(this.probe.availableLayers, l => l.display === val)
        this.layerStyleOptions = []
        this.layerStyleDisplay2id = {}
        if (layer.styles) {
          for (const s of layer.styles) this.layerStyleDisplay2id[s.display] = s.id
          this.layerStyleOptions = layer.styles.map(s => s.display)
        }

        this.layerStyleRequired = this.layerStyleOptions.length > 1
        this.selectedLayerStyle = this.guessLayerStyle()

        this.selectedTileMatrixSet = layer.crs['3857']
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

      if (!this.selectedLayer) return

      const layerId = this.layerDisplay2id[this.selectedLayer]
      const layer = _.find(this.probe.availableLayers, l => l.id === layerId)

      const createdLayer = Object.assign({}, this.baseLayer, {
        name: this.layerName,
        description: this.layerDescription
      })

      if (this.probe.service === 'WMS') {
        // const layerStyleId = this.layerStyleDisplay2id[this.selectedLayerStyle]
        if (createdLayer.leaflet) {
          Object.assign(createdLayer.leaflet, {
            type: 'tileLayer.wms',
            source: this.probe.baseUrl,
            layers: layerId,
            version: this.probe.version,
            // styles: layerStyleId,
            format: 'image/png',
            transparent: true,
            bgcolor: 'FFFFFFFF'
          }, this.probe.searchParams)

          // be explicit about requested CRS if probe list some
          if (layer.crs) {
            // these are what leaflet supports
            const candidates = [ 'EPSG:3857', 'EPSG:4326', 'EPSG:3395' ]
            for (const c of candidates) {
              if (layer.crs.indexOf(c) !== -1) {
                createdLayer.leaflet.crs = `CRS.${c.replace(':', '')}`
                break
              }
            }
          }
        }
      } else if (this.probe.service === 'WFS') {
        Object.assign(createdLayer, {
          isStyleEditable: true,
          featureId: this.selectedFeatureId,
          wfs: {
            url: this.probe.baseUrl,
            version: this.probe.version,
            searchParams: this.probe.searchParams,
            layer: layerId
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
      } else if (this.probe.service === 'WMTS') {
        const layerStyleId = this.layerStyleDisplay2id[this.selectedLayerStyle]
        if (createdLayer.leaflet) {
          const source = buildUrl(`${this.probe.baseUrl}/${layerId}/${layerStyleId}/${this.selectedTileMatrixSet}/{z}/{y}/{x}.png`, this.probe.searchParams)
          Object.assign(createdLayer.leaflet, {
            type: 'tileLayer',
            source: source
          })
        }
      } else if (this.probe.service === 'TMS') {
        if (createdLayer.leaflet) {
          const source = buildUrl(`${layer.url}/{z}/{x}/{y}.${layer.format}`, this.probe.searchParams)
          Object.assign(createdLayer.leaflet, {
            type: 'tileLayer',
            source: source,
            tms: true
          })
        }
      }

      this.$emit('applied', createdLayer)
    }
  }
}
</script>
