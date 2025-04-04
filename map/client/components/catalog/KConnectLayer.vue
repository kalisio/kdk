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

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { buildUrl } from '../../../../core/common'
import * as wmts from '../../../common/wmts-utils'
import { i18n } from '../../../../core/client'
import { KPanel } from '../../../../core/client/components'
import KForm from '../../../../core/client/components/form/KForm.vue'
import { useCurrentActivity } from '../../composables'

// Emits
const emit = defineEmits(['done'])

// Data
const { CurrentActivity } = useCurrentActivity()
const serviceForm = ref(null)
const layerForm = ref(null)
const propertiesForm = ref(null)
const service = ref(null)
const layer = ref(null)
const connecting = ref(false)

// Computed
const serviceFormSchema = computed(() => {
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
})
const layerFormSchema = computed(() => {
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
          service: service.value
        }
      }
    },
    required: ['layer']
  }
})
const propertiesFormSchema = computed(() => {
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
        default: layer.value ? layer.value.display : '',
        field: {
          component: 'form/KTextField',
          label: 'KConnectLayer.NAME_FIELD_LABEL'
        }
      },
      description: {
        type: ['string', 'null'],
        default: layer.value ? layer.value.description || layer.value.display : '',
        field: {
          component: 'form/KTextField',
          label: 'KConnectLayer.DESCRIPTION_FIELD_LABEL'
        }
      }
    },
    required: ['name']
  }
  if (service.value) {
    const protocol = service.value.protocol
    if (protocol === 'WFS') {
      _.set(schema, 'properties.featureId', {
        type: 'string',
        default: guessFeatureId(),
        field: {
          component: 'form/KSelectField',
          label: 'KConnectLayer.FEATURE_ID_FIELD_LABEL',
          options: getLayerProperties()
        }
      })
      required.push('featureId')
    } else if (protocol === 'WMS' || protocol === 'WMTS') {
      _.set(schema, 'properties.style', {
        type: 'string',
        default: guessDefaultStyle(),
        field: {
          component: 'form/KSelectField',
          label: 'KConnectLayer.STYLE_FIELD_LABEL',
          options: getLayerStyles()
        }
      })
    }
  }
  _.set(schema, 'required', required)
  return schema
})
const buttons = computed(() => {
  return [{
    id: 'close-action',
    outline: true,
    label: 'CLOSE',
    renderer: 'form-button',
    handler: onClose
  }, {
    id: 'connect-layer-action',
    label: i18n.t('KConnectLayer.CONNECT_BUTTON'),
    loading: connecting.value,
    renderer: 'form-button',
    handler: onConnect
  }]
})

// Functions
function onServiceFormFieldChanged (field, value) {
  service.value = value
  layer.value = null
}
function onLayerFormFieldChanged (field, value) {
  layer.value = value
}
function getLayerStyles () {
  if (layer.value) return _.map(layer.value.styles, style => { return { label: style.display, value: style.id } })
  return []
}
function getLayerProperties () {
  if (layer.value) return _.map(layer.value.properties, prop => { return { label: prop, value: prop } })
  return []
}
function guessDefaultStyle () {
  if (!layer.value) return ''
  const styles = _.map(layer.value.styles, (value, key) => key)
  return styles[0]
}
function guessFeatureId () {
  if (layer.value) {
    for (const prop of layer.value.properties) {
      if (prop.toLowerCase().includes('id', 'fid', 'featureid', '_id', 'objectid')) return prop
    }
  }
  return ''
}
function onClose () {
  emit('done')
}
async function onConnect () {
  const layerResult = layerForm.value.validate()
  const propertiesResult = propertiesForm.value.validate()
  if (!layerResult.isValid || !propertiesResult.isValid) return
  connecting.value = true
  // Create the layer accordingly the input fields
  const newLayer = {
    name: propertiesResult.values.name,
    description: propertiesResult.values.description,
    type: 'OverlayLayer',
    icon: 'las la-plug',
    scope: 'user',
    tags: ['user']
  }
  if (layer.value.extent) {
    const { west, east, south, north } = layer.value.extent
    newLayer.bbox = [west, south, east, north]
  }
  if (service.value.protocol === 'WMS') {
    const style = propertiesResult.values.style
    const timeDimension = layer.value.timeDimension

    newLayer.cesium = {
      type: 'WebMapService',
      url: service.value.baseUrl,
      layers: layer.value.id,
      parameters: Object.assign({
        version: service.value.version,
        format: 'image/png',
        transparent: true
      }, service.value.searchParams)
    }
    newLayer.leaflet = Object.assign({
      type: 'tileLayer.wms',
      source: service.value.baseUrl,
      layers: layer.value.id,
      version: service.value.version,
      format: 'image/png',
      transparent: true,
      bgcolor: 'FFFFFFFF',
      timeDimension
    }, service.value.searchParams)

    // be explicit about requested CRS if probe list some
    if (layer.value.crs) {
      // these are what leaflet supports
      const candidates = ['EPSG:3857', 'EPSG:4326', 'EPSG:3395']
      for (const c of candidates) {
        if (layer.value.crs.indexOf(c) !== -1) {
          newLayer.leaflet.crs = `CRS.${c.replace(':', '')}`
          break
        }
      }
    }

    if (style) {
      newLayer.leaflet.styles = style
      newLayer.cesium.parameters.styles = style
      // add legend url if available in the picked style
      const legendUrl = _.get(layer.value.styles, [style, 'legend'])
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
  } else if (service.value.protocol === 'WFS') {
    Object.assign(newLayer, {
      schema: { content: layer.value.schema },
      featureId: propertiesResult.values.featureId,
      wfs: {
        url: service.value.baseUrl,
        version: service.value.version,
        searchParams: service.value.searchParams,
        outputFormat: service.value.geoJsonOutputFormat,
        layer: layer.value.id
      }
    })
    newLayer.leaflet = {
      type: 'geoJson',
      realtime: true,
      tiled: true
    }
  } else if (service.value.protocol === 'WMTS') {
    const style = propertiesResult.values.style

    // pick an image format
    let pickedFormat = ''
    const supportedFormats = _.map(layer.value.formats, (value, key) => key)
    const candidateFormats = ['image/png', 'image/jpeg']
    for (const c of candidateFormats) {
      if (_.has(layer.value.formats, c)) {
        pickedFormat = c
        break
      }
    }
    // could not find candidate, fallback using first available
    if (!pickedFormat) pickedFormat = supportedFormats[0]

    const url = wmts.buildLeafletUrl(service.value.baseUrl, layer.value, {
      version: service.value.version,
      style,
      crs: '3857',
      format: pickedFormat,
      searchParams: service.value.searchParams,
      useKvpEncoding: service.value.getTileUseKvpEncoding
    })
    newLayer.cesium = {
      type: 'WebMapTileService',
      url: url.replace('{z}', '{TileMatrix}').replace('{x}', '{TileCol}').replace('{y}', '{TileRow}'),
      format: pickedFormat,
      layer: layer.value.id,
      style,
      tileMatrixSetID: layer.value.crs['3857']
    }
    newLayer.leaflet = {
      type: 'tileLayer',
      source: url
    }

    // add legend url if available in the style
    const legendUrl = _.get(layer.value.styles, [style, 'legend'])
    if (legendUrl) {
      newLayer.legend = {
        type: 'image',
        label: newLayer.name,
        content: {
          src: legendUrl
        }
      }
    }
  } else if (service.value.protocol === 'TMS') {
    newLayer.cesium = {
      type: 'TileMapService',
      url: buildUrl(layer.value.url, service.value.searchParams),
      fileExtension: layer.value.extension
    }
    newLayer.leaflet = {
      type: 'tileLayer',
      source: buildUrl(`${layer.value.url}/{z}/{x}/{y}.${layer.value.extension}`, service.value.searchParams),
      tms: true
    }
  }
  // make layers visible by default
  if (newLayer.leaflet) newLayer.leaflet.isVisible = true
  if (newLayer.cesium) newLayer.cesium.isVisible = true
  // Add the layer
  await CurrentActivity.value.addLayer(newLayer)
  connecting.value = false
  emit('done')
}
</script>
