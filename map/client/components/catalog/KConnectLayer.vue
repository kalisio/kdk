<template>
  <div>
    <k-form ref="serviceForm" :schema="getServiceFormSchema()" @field-changed="onServiceFormFieldChanged" />
    <k-form ref="layerForm" :key="layerFormKey" :schema="getLayerFormSchema()" @field-changed="onLayerFormFieldChanged" />
    <k-form ref="propertiesForm" :key="propertiesFormKey" :schema="getPropertiesFormSchema()" />
    <div class="row justify-end">
      <k-action id="connect-action" :label="$t('KConnectLayer.CONNECT_BUTTON')" @triggered="onConnect" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { buildUrl } from '../../../../core/common'

export default {
  name: 'k-connect-layer',
  inject: ['kActivity'],
  data () {
    return {
      layerFormKey: 1,
      propertiesFormKey: 10000
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
        } else if (protocol === 'WMS' || protocol === 'WMTS') {
          _.set(schema, 'properties.style', {
            type: 'string',
            default: this.guessDefaultStyle(),
            field: {
              component: 'form/KSelectField',
              label: 'KConnectLayer.STYLE_ID_FIELD_LABEL',
              options: this.getLayerStyles() 
            }
          })
        }
      }
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
      if (this.layer && this.layer.styles.length > 0) {
        const defaultStyle = this.layer.styles[0]
        return defaultStyle.id
      }
      return ''
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
      const result = this.$refs.propertiesForm.validate()
      if (! result.isValid) return
      // Create the layer accordingly the input fields
      const newLayer = {
        name: result.values.name,
        description: result.values.description,
        icon: 'las la-plug',
        type: 'OverlayLayer',
        isRemovable: true,
        isStorable: true
      }
      if (this.service.protocol === 'WMS') {
        newLayer.leaflet = Object.assign({
          type: 'tileLayer.wms',
          source: this.service.baseUrl,
          layers: this.layer.id,
          version: this.service.version,
          styles: result.values.style,
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
      } else if (this.service.protocol === 'WFS') {
        Object.assign(newLayer, {
          isStyleEditable: true,
          featureId: result.values.featureId,
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
        const layerStyleId = result.values.style
        const tileMatrixSet = this.layer.crs['3857']
        newLayer.leaflet = {
          type: 'tilelayer',
          source: buildUrl(`${this.service.baseUrl}/${this.layer.id}/${layerStyleId}/${tileMatrixSet}/{z}/{y}/{x}.${this.layer.format}`, this.service.searchParams)
        }
      } else if (this.service.protocol === 'TMS') {
        newLayer.leafet = {
          type: 'tileLayer',
          source: buildUrl(`${this.layer.url}/{z}/{x}/{y}.${this.layer.format}`, this.service.searchParams),
          tms: true
        }
      }
      await this.kActivity.addLayer(newLayer)
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
