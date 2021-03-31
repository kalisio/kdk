<template>
  <div>
    <!-- Forms section -->
    <k-form ref="serviceForm" :schema="getServiceFormSchema()" @field-changed="onServiceFormFieldChanged" />
    <k-form ref="layerForm" :key="layerFormKey" :schema="getLayerFormSchema()" @field-changed="onLayerFormFieldChanged" />
    <k-form ref="propertiesForm" :key="propertiesFormKey" :schema="getPropertiesFormSchema()" />
    <!-- Buttons section -->
    <div class="row justify-end">
      <k-action 
        id="connect-layer-action" 
        :label="$t('KConnectLayer.CONNECT_BUTTON')" 
        renderer="form-button"
        :loading="connecting"
        @triggered="onConnect" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { buildUrl } from '../../../../core/common'
import * as wmts from '../../../common/wmts-utils'

export default {
  name: 'k-connect-layer',
  inject: ['kActivity'],
  data () {
    return {
      layerFormKey: 1,
      propertiesFormKey: 10000,
      connecting: false
    }
  },
  methods: {
    getServiceFormSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
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
    getLayerFormSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
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
    getPropertiesFormSchema () {
      let required = ['name']
      let schema = {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/connect-layer-set-properties#',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 3,
            default: this.layer ? this.layer.display : '',            
            field: { 
              component: 'form/KTextField',
              label: 'KConnectLayer.NAME_FIELD_LABEL'
            }
          },
          description: {
            type: 'string',
            default: this.layer ? this.layer.display : '',
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
    onServiceFormFieldChanged (field, value) {
      this.service = value
      this.layer = null
      // Force the other forms to be re-rendered
      this.layerFormKey+=1
      this.propertiesFormKey+=1
    },
    onLayerFormFieldChanged (field, value) {
      this.layer = value
      this.propertiesFormKey+=1
    },
    getLayerStyles () {
      if (this.layer) return _.map(this.layer.styles, style => { return { label: style.display, value: style.id }})
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
        isStorable: true,
        isEditable: true,
        isRemovable: true,   
      }
      if (this.service.protocol === 'WMS') {
        const style = propertiesResult.values.style

        newLayer.leaflet = Object.assign({
          type: 'tileLayer.wms',
          source: this.service.baseUrl,
          layers: this.layer.id,
          version: this.service.version,
          format: 'image/png',
          transparent: true,
          bgcolor: 'FFFFFFFF'
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

          // add legend url if available in the picked style
          const legendUrl = _.get(this.layer.styles, [style, 'legend'])
          if (legendUrl) newLayer.legendUrl = legendUrl
        }
      } else if (this.service.protocol === 'WFS') {
        Object.assign(newLayer, {
          isSelectable: true,   
          isStyleEditable: false,
          schema: { content: this.layer.schema },
          featureId: propertiesResult.values.featureId,
          wfs: {
            url: this.service.baseUrl,
            version: this.service.version,
            searchParams: this.service.searchParams,
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

        newLayer.leaflet = {
          type: 'tileLayer',
          source: wmts.buildLeafletUrl(this.service.baseUrl, this.layer, {
            style: style,
            crs: '3857',
            format: pickedFormat,
            searchParams: this.service.searchParams
          })
        }

        // add legend url if available in the style
        const legendUrl = _.get(this.layer.styles, [style, 'legend'])
        if (legendUrl) newLayer.legendUrl = legendUrl
      } else if (this.service.protocol === 'TMS') {
        newLayer.leaflet = {
          type: 'tileLayer',
          source: buildUrl(`${this.layer.url}/{z}/{x}/{y}.${this.layer.extension}`, this.service.searchParams),
          tms: true
        }
      }
      // make leaflet layers visible by default
      if (newLayer.leaflet) newLayer.leaflet.isVisible = true
      // Add the layer
      await this.kActivity.addLayer(newLayer)
      this.connecting = false
      this.$emit('done')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
    this.$options.components['k-form'] = this.$load('form/KForm')
    // Required data
    this.service = null
    this.layer = null
  }
}
</script>
