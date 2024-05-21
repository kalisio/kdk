<template>
  <div>
    <!-- Forms section -->
    <k-form ref="serviceForm" :schema="serviceFormSchema" @field-changed="onServiceFormFieldChanged" />
    <k-form ref="layerForm" :schema="layerFormSchema" @field-changed="onLayerFormFieldChanged" />
    <k-form ref="propertiesForm" :schema="propertiesFormSchema" />
    <!-- Buttons section -->
    <q-card-actions align="right">
      <k-panel
        id="modal-buttons"
        :content="buttons"
        renderer="form-button"
        v-bind:class="{ 'q-gutter-x-md' : $q.screen.gt.xs, 'q-gutter-x-sm': $q.screen.lt.sm }" />
    </q-card-actions>
  </div>
</template>

<script>
import _ from 'lodash'
import { buildUrl } from '../../../../core/common'
import * as wmts from '../../../common/wmts-utils'
import { KAction, KPanel } from '../../../../core/client/components'
import KForm from '../../../../core/client/components/form/KForm.vue'

export default {
  components: {
    KAction,
    KPanel,
    KForm
  },
  emits: [
    'done'
  ],
  inject: ['kActivity'],
  computed: {
    serviceFormSchema () {
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/connect-layer-select-service',
        type: 'object',
        properties: {
          service: {
            type: 'object',
            field: {
              component: 'form/KOwsServiceField',
              label: 'KConnectLayer.SERVICE_FIELD_LABEL'
            }
          }
        },
        required: ['service']
      }
    },
    layerFormSchema () {
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/connect-layer-select-layer#',
        type: 'object',
        properties: {
          layer: {
            type: 'object',
            field: {
              component: 'form/KOwsLayerField',
              label: 'KConnectLayer.LAYER_FIELD_LABEL',
              service: this.service
            }
          }
        },
        required: ['layer']
      }
    },
    propertiesFormSchema () {
      const required = ['name']
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/connect-layer-set-properties#',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 2,
            default: this.layer ? this.layer.display : '',
            field: {
              component: 'form/KTextField',
              label: 'KConnectLayer.NAME_FIELD_LABEL'
            }
          },
          description: {
            type: 'string',
            default: this.layer ? this.layer.description || this.layer.display : '',
            field: {
              component: 'form/KTextField',
              label: 'KConnectLayer.DESCRIPTION_FIELD_LABEL'
            }
          }
        },
        required: ['name']
      }
      if (this.service) {
        const protocol = this.service.protocol
        if (protocol === 'WFS') {
          _.set(schema, 'properties.featureId', {
            type: 'string',
            default: this.guessFeatureId(),
            field: {
              component: 'form/KSelectField',
              label: 'KConnectLayer.FEATURE_ID_FIELD_LABEL',
              options: this.getLayerProperties()
            }
          })
          required.push('featureId')
        } else if (protocol === 'WMS' || protocol === 'WMTS') {
          _.set(schema, 'properties.style', {
            type: 'string',
            default: this.guessDefaultStyle(),
            field: {
              component: 'form/KSelectField',
              label: 'KConnectLayer.STYLE_FIELD_LABEL',
              options: this.getLayerStyles()
            }
          })
        }
      }
      _.set(schema, 'required', required)
      return schema
    },
    buttons () {
      return [{
        id: 'close-action',
        outline: true,
        label: 'CLOSE',
        renderer: 'form-button',
        handler: this.onClose
      }, {
        id: 'connect-layer-action',
        label: this.$t('KConnectLayer.CONNECT_BUTTON'),
        loading: this.connecting,
        renderer: 'form-button',
        handler: this.onConnect
      }]
    }
  },
  data () {
    return {
      service: null,
      layer: null,
      connecting: false
    }
  },
  methods: {
    onServiceFormFieldChanged (field, value) {
      this.service = value
      this.layer = null
    },
    onLayerFormFieldChanged (field, value) {
      this.layer = value
    },
    getLayerStyles () {
      if (this.layer) return _.map(this.layer.styles, style => { return { label: style.display, value: style.id } })
      return []
    },
    getLayerProperties () {
      if (this.layer) return _.map(this.layer.properties, prop => { return { label: prop, value: prop } })
      return []
    },
    guessDefaultStyle () {
      if (!this.layer) return ''
      const styles = _.map(this.layer.styles, (value, key) => key)
      return styles[0]
    },
    guessFeatureId () {
      if (this.layer) {
        for (const prop of this.layer.properties) {
          if (prop.toLowerCase().includes('id', 'fid', 'featureid', '_id', 'objectid')) return prop
        }
      }
      return ''
    },
    onClose () {
      this.$emit('done')
    },
    async onConnect () {
      const layerResult = this.$refs.layerForm.validate()
      const propertiesResult = this.$refs.propertiesForm.validate()
      if (!layerResult.isValid || !propertiesResult.isValid) return
      this.connecting = true
      // Create the layer accordingly the input fields
      const newLayer = {
        name: propertiesResult.values.name,
        description: propertiesResult.values.description,
        type: 'OverlayLayer',
        icon: 'las la-plug',
        scope: 'user',
        tags: ['user']
      }
      if (this.layer.extent) {
        const { west, east, south, north } = this.layer.extent
        newLayer.bbox = [west, south, east, north]
      }
      if (this.service.protocol === 'WMS') {
        const style = propertiesResult.values.style
        const timeDimension = this.layer.timeDimension

        newLayer.cesium = {
          type: 'WebMapService',
          url: this.service.baseUrl,
          layers: this.layer.id,
          parameters: Object.assign({
            version: this.service.version,
            format: 'image/png',
            transparent: true
          }, this.service.searchParams)
        }
        newLayer.leaflet = Object.assign({
          type: 'tileLayer.wms',
          source: this.service.baseUrl,
          layers: this.layer.id,
          version: this.service.version,
          format: 'image/png',
          transparent: true,
          bgcolor: 'FFFFFFFF',
          timeDimension
        }, this.service.searchParams)

        // be explicit about requested CRS if probe list some
        if (this.layer.crs) {
          // these are what leaflet supports
          const candidates = ['EPSG:3857', 'EPSG:4326', 'EPSG:3395']
          for (const c of candidates) {
            if (this.layer.crs.indexOf(c) !== -1) {
              newLayer.leaflet.crs = `CRS.${c.replace(':', '')}`
              break
            }
          }
        }

        if (style) {
          newLayer.leaflet.styles = style
          newLayer.cesium.parameters.styles = style
          // add legend url if available in the picked style
          const legendUrl = _.get(this.layer.styles, [style, 'legend'])
          if (legendUrl) {
            newLayer.legend = {
              type: 'image',
              label: newLayer.name,
              content: {
                src: legendUrl
              }
            }
          }
        }
      } else if (this.service.protocol === 'WFS') {
        Object.assign(newLayer, {
          schema: { content: this.layer.schema },
          featureId: propertiesResult.values.featureId,
          wfs: {
            url: this.service.baseUrl,
            version: this.service.version,
            searchParams: this.service.searchParams,
            outputFormat: this.service.geoJsonOutputFormat,
            layer: this.layer.id
          }
        })
        newLayer.leaflet = {
          type: 'geoJson',
          realtime: true,
          tiled: true
        }
      } else if (this.service.protocol === 'WMTS') {
        const style = propertiesResult.values.style

        // pick an image format
        let pickedFormat = ''
        const supportedFormats = _.map(this.layer.formats, (value, key) => key)
        const candidateFormats = ['image/png', 'image/jpeg']
        for (const c of candidateFormats) {
          if (_.has(this.layer.formats, c)) {
            pickedFormat = c
            break
          }
        }
        // could not find candidate, fallback using first available
        if (!pickedFormat) pickedFormat = supportedFormats[0]

        const url = wmts.buildLeafletUrl(this.service.baseUrl, this.layer, {
          version: this.service.version,
          style,
          crs: '3857',
          format: pickedFormat,
          searchParams: this.service.searchParams,
          useKvpEncoding: this.service.getTileUseKvpEncoding
        })
        newLayer.cesium = {
          type: 'WebMapTileService',
          url: url.replace('{z}', '{TileMatrix}').replace('{x}', '{TileCol}').replace('{y}', '{TileRow}'),
          format: pickedFormat,
          layer: this.layer.id,
          style,
          tileMatrixSetID: this.layer.crs['3857']
        }
        newLayer.leaflet = {
          type: 'tileLayer',
          source: url
        }

        // add legend url if available in the style
        const legendUrl = _.get(this.layer.styles, [style, 'legend'])
        if (legendUrl) {
          newLayer.legend = {
            type: 'image',
            label: newLayer.name,
            content: {
              src: legendUrl
            }
          }
        }
      } else if (this.service.protocol === 'TMS') {
        newLayer.cesium = {
          type: 'TileMapService',
          url: buildUrl(this.layer.url, this.service.searchParams),
          fileExtension: this.layer.extension
        }
        newLayer.leaflet = {
          type: 'tileLayer',
          source: buildUrl(`${this.layer.url}/{z}/{x}/{y}.${this.layer.extension}`, this.service.searchParams),
          tms: true
        }
      }
      // make layers visible by default
      if (newLayer.leaflet) newLayer.leaflet.isVisible = true
      if (newLayer.cesium) newLayer.cesium.isVisible = true
      // Add the layer
      await this.kActivity.addLayer(newLayer)
      this.connecting = false
      this.$emit('done')
    }
  }
}
</script>
