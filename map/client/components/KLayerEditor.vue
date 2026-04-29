<template>
  <div class="column">
    <!-- Basic properties -->
    <q-expansion-item id="layer-base-group" default-opened icon="las la-list" :label="$t('KLayerEditor.BASE')" group="group">
      <KForm
        ref="formRef"
        :values="values.base"
        :schema="formSchema"
        @field-changed="onLayerFormFieldChanged"
        class="q-ma-md"
      />
    </q-expansion-item>
    <!-- Display properties -->
    <q-expansion-item id="layer-display-group" icon="las la-low-vision" :label="$t('KLayerEditor.DISPLAY')" group="group">
      <q-list dense class="q-ma-md">
        <q-item class="row">
          <q-item-section class="col-auto"><q-toggle id="layer-display-visibility" v-model="values.display.isVisible" /></q-item-section>
          <q-item-section>{{ $t('KLayerEditor.DEFAULT_VISIBILITY') }}</q-item-section>
        </q-item>
        <q-item class="row" v-if="is2D">
          <q-item-section class="col-auto"><q-toggle id="layer-display-toggle-zoom" v-model="values.display.zoom.leaflet.enabled" /></q-item-section>
          <q-item-section>{{ $t('KLayerEditor.ZOOM') }}</q-item-section>
          <q-item-section>
            <q-range id="layer-display-zoom"
              v-model="values.display.zoom.leaflet.value"
              :min="values.display.zoom.leaflet.min"
              :max="values.display.zoom.leaflet.max"
              :step="values.display.zoom.leaflet.step"
              :left-label-value="values.display.zoom.leaflet.value.min"
              :right-label-value="values.display.zoom.leaflet.value.max"
              :disable="!values.display.zoom.leaflet.enabled"
              label-always />
          </q-item-section>
        </q-item>
        <q-item class="row" v-else>
          <q-item-section class="col-auto"><q-toggle id="layer-display-toggle-zoom" v-model="values.display.zoom.cesium.enabled" /></q-item-section>
          <q-item-section>{{ $t('KLayerEditor.ZOOM') }}</q-item-section>
          <q-item-section>
            <q-range id="layer-display-zoom"
              v-model="values.display.zoom.cesium.value"
              :min="values.display.zoom.cesium.min"
              :max="values.display.zoom.cesium.max"
              :step="values.display.zoom.cesium.step"
              :left-label-value="values.display.zoom.cesium.value.min"
              :right-label-value="values.display.zoom.cesium.value.max"
              :disable="!values.display.zoom.cesium.enabled"
              label-always />
          </q-item-section>
        </q-item>
        <q-item class="row" v-if="is2D">
          <q-item-section class="col-auto"><q-toggle id="layer-display-toggle-clustering" v-model="values.display.clustering.leaflet.enabled" /></q-item-section>
          <q-item-section>{{ $t('KLayerEditor.POINT_CLUSTERING') }}</q-item-section>
          <q-item-section>
            <q-slider id="layer-display-cluster"
              v-model="values.display.clustering.leaflet.value"
              :min="values.display.clustering.leaflet.min"
              :max="values.display.clustering.leaflet.max"
              :step="values.display.clustering.leaflet.step"
              :label-value="values.display.clustering.leaflet.value"
              :disable="!values.display.clustering.leaflet.enabled"
              label-always />
          </q-item-section>
        </q-item>
        <q-item class="row" v-else>
          <q-item-section class="col-auto"><q-toggle id="layer-display-toggle-clustering" v-model="values.display.clustering.cesium.enabled" /></q-item-section>
          <q-item-section>{{ $t('KLayerEditor.CLUSTERING_PIXEL_RANGE') }}</q-item-section>
          <q-item-section>
            <q-slider id="layer-display-cluster"
              v-model="values.display.clustering.cesium.value"
              :min="values.display.clustering.cesium.min"
              :max="values.display.clustering.cesium.max"
              :step="values.display.clustering.cesium.step"
              :label-value="values.display.clustering.cesium.value + 'px'"
              :disable="!values.display.clustering.cesium.enabled"
              label-always />
          </q-item-section>
        </q-item>
        <q-item class="row" v-if="isVectorLayer">
          <q-item-section class="col-auto"><q-toggle id="layer-display-toggle-selectable" v-model="values.display.isSelectable" /></q-item-section>
          <q-item-section>{{ $t('KLayerEditor.SELECTABLE') }}</q-item-section>
        </q-item>
        <q-item v-if="!layerHasFeatureSchema" class="row">
          <q-item-section class="col-auto"><q-toggle id="layer-display-toggle-opacity" v-model="values.display.opacity.enabled" /></q-item-section>
          <q-item-section>{{ $t('KLayerEditor.OPACITY') }}</q-item-section>
          <q-item-section>
            <q-slider id="layer-display-opacity"
              v-model="values.display.opacity.value"
              :min="values.display.opacity.min"
              :max="values.display.opacity.max"
              :step="values.display.opacity.step"
              :label-value="values.display.opacity.value"
              :disable="!values.display.opacity.enabled"
              label-always />
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <!-- Popup properties -->
    <q-expansion-item v-if="layerHasFeatureSchema" id="layer-popup-group" icon="las la-comment-alt" :label="$t('KLayerEditor.POPUP')" group="group">
      <q-list dense class="q-ma-md">
        <q-item class="row">
          <q-item-section class="col-auto"><q-toggle id="layer-popup-toggle" v-model="values.popup.enabled" /></q-item-section>
          <q-item-section>
            <q-select for="layer-popup-field" id="layer-popup-field"
              v-model="values.popup.properties"
              :options="properties"
              :disable="!values.popup.enabled"
              :label="$t('KLayerEditor.ADD_POPUP')"
              use-chips multiple>
              <!-- Options display -->
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" :id="getPopupId(scope.opt)">
                  <q-item-section> <q-item-label>{{ scope.opt.label }}</q-item-label> </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <!-- Tooltip properties -->
    <q-expansion-item v-if="layerHasFeatureSchema" id="layer-tooltip-group" icon="las la-info-circle" :label="$t('KLayerEditor.TOOLTIP')" group="group">
      <q-list dense class="q-ma-md">
        <q-item class="row">
          <q-item-section class="col-auto"><q-toggle id="layer-tooltip-toggle" v-model="values.tooltip.enabled" /></q-item-section>
          <q-item-section>
            <q-select for="layer-tooltip-field" id="layer-tooltip-field"
              v-model="values.tooltip.property"
              :options="properties"
              :disable="!values.tooltip.enabled"
              :label="$t('KLayerEditor.ADD_TOOLTIP')">
              <!-- Options display -->
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" :id="getPopupId(scope.opt)">
                  <q-item-section> <q-item-label>{{ scope.opt.label }}</q-item-label> </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <!-- Infobox properties -->
    <q-expansion-item v-if="layerHasFeatureSchema" id="layer-infobox-group" icon="las la-th-list" :label="$t('KLayerEditor.INFOBOX')" group="group">
      <q-list dense class="q-ma-md">
        <q-item class="row">
          <q-item-section class="col-auto"><q-toggle id="layer-infobox-toggle" v-model="values.infobox.enabled" /></q-item-section>
          <q-item-section>
            <q-select
              v-model="values.infobox.properties"
              :options="properties"
              :disable="!values.infobox.enabled"
              :label="$t('KLayerEditor.ADD_INFOBOX')"
              id="layer-infobox-field"
              use-chips multiple>
              <!-- Options display -->
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" :id="getPopupId(scope.opt)">
                  <q-item-section> <q-item-label>{{ scope.opt.label }}</q-item-label> </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import { api } from '../../../core/client/api.js'
import { useCurrentActivity } from '../composables/activity.js'
import { DefaultStyle } from '../utils/utils.style.js'
import { isInMemoryLayer } from '../utils/utils.layers.js'
import { dotify } from '../../../core/client/utils/index.js'
import layerFormSchema from '../../common/schemas/catalog.update.json'

// Props
const props = defineProps({
  layerName: {
    type: String,
    required: true
  }
})

// Data
const { CurrentActivity } = useCurrentActivity()
const formRef = ref(null)
const layer = CurrentActivity.value.getLayerByName(props.layerName)
let layerSchema = _.get(layer, 'schema', {})
const activityOptions = CurrentActivity.value.activityOptions.engine
const is2D = CurrentActivity.value.is2D()
const leafletZoomBounds = {
  min: getIfNumber(_.get(activityOptions, 'viewer.minZoom'), 1),
  max: getIfNumber(_.get(activityOptions, 'viewer.maxZoom'), 18)
}
const cesiumZoomBounds = {
  min: 0,
  max: 24000000
}
const values = ref(getValues())
const properties = ref(getProperties())

// Computed
const layerHasFeatureSchema = !_.isEmpty(layerSchema)
const isVectorLayer = layerHasFeatureSchema || (_.get(layer, 'leaflet.type') === 'geoJson')
const formSchema = _.cloneDeep(layerFormSchema)
// Allow schema edition in this case
if (isVectorLayer) {
  formSchema.properties.schema = {
    type: ['object', 'null'],
    nullable: true,
    field: {
      component: 'form/KFileField',
      label: 'schemas.CATALOG_SCHEMA_FIELD_LABEL',
      mimeTypes: 'application/json'
    }
  }
}

// Functions
function onLayerFormFieldChanged (field, value) {
  // We need to update available properties
  if (field === 'schema') {
    layerSchema = value || {}
    properties.value = getProperties()
    // Remove any previous property that does not exist anymore in schema
    if (values.value.popup.properties) {
      values.value.popup.properties = values.value.popup.properties.filter(property => _.has(layerSchema, `content.properties.${property}`))
      if (_.isEmpty(values.value.popup.properties)) values.value.popup.enabled = false
    }
    if (!_.has(layerSchema, `content.properties.${values.value.tooltip.property}`)) {
      values.value.tooltip.property = ''
      values.value.tooltip.enabled = false
    }
    if (values.value.infobox.properties) {
      values.value.infobox.properties = values.value.popup.properties.filter(property => _.has(layerSchema, `content.properties.${property}`))
      if (_.isEmpty(values.value.infobox.properties)) values.value.infobox.enabled = false
    }
  }
}
function getPopupId (option) {
  return _.kebabCase(option.label)
}
function getProperties () {
  // Avoid modifying the layer schema as we might update it internally
  const fields = _.cloneDeep(_.get(layerSchema, 'content.properties', {}))
  const properties = []
  _.forOwn(fields, (value, key) => {
    // Use label or ID
    properties.push({
      label: _.get(value, 'field.label', key),
      value: key
    })
  })
  return properties
}
function cesiumToLeafletZoom (value) {
  const ratio = (value - cesiumZoomBounds.min) / (cesiumZoomBounds.max - cesiumZoomBounds.min)
  return Math.round(leafletZoomBounds.max - (leafletZoomBounds.max - leafletZoomBounds.min) * ratio)
}
function leafletToCesiumZoom (value) {
  const ratio = (value - leafletZoomBounds.min) / (leafletZoomBounds.max - leafletZoomBounds.min)
  return Math.round(cesiumZoomBounds.max - (cesiumZoomBounds.max - cesiumZoomBounds.min) * ratio)
}
function getIfNumber (value, defaultValue) {
  return _.isNil(value) || !_.isNumber(value) ? defaultValue : value
}
function getValues () {
  const opacity = _.get(layer, 'leaflet.opacity', 1)
  const values = {
    base: {
      name: _.get(layer, 'name', ''),
      description: _.get(layer, 'description', ''),
      featureId: _.get(layer, 'featureId', ''),
      featureLabel: _.get(layer, 'featureLabel', ''),
      schema: _.pick(layerSchema, ['name', 'content'])
    },
    display: {
      isVisible: _.get(layer, 'leaflet.isVisible', _.get(DefaultStyle, 'isVisible')),
      zoom: {
        leaflet: {
          enabled: _.get(layer, 'leaflet.minZoom', _.get(layer, 'leaflet.maxZoom'), false) !== false,
          min: leafletZoomBounds.min,
          max: leafletZoomBounds.max,
          step: 1,
          value: {
            min: getIfNumber(_.get(layer, 'leaflet.minZoom'), leafletZoomBounds.min),
            max: getIfNumber(_.get(layer, 'leaflet.maxZoom'), leafletZoomBounds.max)
          }
        },
        cesium: {
          enabled: _.get(layer, 'cesium.minZoom', _.get(layer, 'cesium.maxZoom'), false) !== false,
          min: leafletZoomBounds.min,
          max: leafletZoomBounds.max,
          step: 1,
          value: {
            // Min and max are inverted to match leaflet zoom levels
            // min zoom in leaflet is max distance in cesium
            min: cesiumToLeafletZoom(getIfNumber(_.get(layer, 'cesium.maxZoom'), cesiumZoomBounds.max)),
            max: cesiumToLeafletZoom(getIfNumber(_.get(layer, 'cesium.minZoom'), cesiumZoomBounds.min))
          }
        }
      },
      clustering: {
        leaflet: {
          enabled: _.get(layer, 'leaflet.cluster', _.get(activityOptions, 'cluster', false)) !== false,
          min: leafletZoomBounds.min,
          max: leafletZoomBounds.max,
          value: _.get(layer, 'leaflet.cluster.disableClusteringAtZoom', _.get(activityOptions, 'cluster.disableClusteringAtZoom', _.get(DefaultStyle, 'leaflet.cluster.disableClusteringAtZoom')))
        },
        cesium: {
          enabled: _.get(layer, 'cesium.cluster', false) !== false,
          min: 5,
          max: 200,
          value: _.get(layer, 'cesium.cluster.pixelRange', _.get(DefaultStyle, 'cesium.cluster.pixelRange'))
        }
      },
      isSelectable: _.get(layer, 'isSelectable', _.get(DefaultStyle, 'isSelectable')),
      opacity: {
        enabled: opacity !== false,
        min: 0,
        max: 1,
        step: 0.1,
        value: (opacity === false ? 1 : opacity) // QSlider dislike boolean values
      }
    },
    popup: {
      enabled: _.get(layer, 'leaflet.popup', _.get(activityOptions, 'popup', false)) !== false,
      properties: []
    },
    tooltip: {
      enabled: _.get(layer, 'leaflet.tooltip', _.get(activityOptions, 'tooltip', false)) !== false,
      property: null
    },
    infobox: {
      enabled: _.get(layer, 'leaflet.infobox', _.get(activityOptions, 'infobox', true)) !== false,
      properties: []
    }
  }

  if (!values.display.zoom.leaflet.value.min) values.display.zoom.leaflet.value.min = leafletZoomBounds.min
  if (!values.display.zoom.leaflet.value.max) values.display.zoom.leaflet.value.max = leafletZoomBounds.max

  const properties = getProperties()

  // Get popup select properties
  values.popup.properties = _.get(layer, 'leaflet.popup.pick', _.get(activityOptions, 'popup.pick', properties.map(property => property.value)))
  if (!_.isEmpty(values.popup.properties)) {
    values.popup.properties = values.popup.properties.map(property => _.find(properties, { value: property }))
  } else {
    values.popup.enabled = false
  }

  // Get tooltip select property
  values.tooltip.property = _.get(layer, 'leaflet.tooltip.property', _.get(activityOptions, 'tooltip.property', null))
  if (!_.isEmpty(values.tooltip.property)) {
    values.tooltip.property = _.find(properties, { value: values.tooltip.property })
  } else {
    values.tooltip.enabled = false
  }

  // Get infobox select properties
  values.infobox.properties = _.get(layer, 'leaflet.infobox.pick', _.get(activityOptions, 'infobox.pick', properties.map(property => property.value)))
  if (!_.isEmpty(values.infobox.properties)) {
    values.infobox.properties = values.infobox.properties.map(property => _.find(properties, { value: property }))
  } else {
    values.infobox.enabled = false
  }

  return values
}
function apply () {
  const { isValid, values: updatedLayer } = formRef.value.validate()
  if (!isValid) return false

  const display = values.value.display
  const popup = values.value.popup.enabled
    ? { pick: values.value.popup.properties.map(property => property.value) }
    : false
  const tooltip = values.value.tooltip.enabled && values.value.tooltip.property
    ? { property: values.value.tooltip.property.value }
    : false
  const infobox = values.value.infobox.enabled
    ? { pick: values.value.infobox.properties.map(property => property.value) }
    : false

  const layer = CurrentActivity.value.getLayerByName(props.layerName)
  const is2DLayer = _.has(layer, 'leaflet')
  const is3DLayer = _.has(layer, 'cesium')
  const leaflet = {
    isVisible: display.isVisible,
    cluster: display.clustering.leaflet.enabled
      ? { disableClusteringAtZoom: display.clustering.leaflet.value }
      : false,
    minZoom: display.zoom.leaflet.enabled
      ? display.zoom.leaflet.value.min
      : false,
    maxZoom: display.zoom.leaflet.enabled
      ? display.zoom.leaflet.value.max
      : false,
    opacity: display.opacity.enabled
      ? display.opacity.value
      : false,
    popup,
    tooltip,
    infobox
  }
  const cesium = {
    isVisible: display.isVisible,
    cluster: display.clustering.cesium.enabled
      ? { pixelRange: display.clustering.cesium.value }
      : false,
    minZoom: display.zoom.cesium.enabled
      ? leafletToCesiumZoom(display.zoom.cesium.value.max)
      : false,
    maxZoom: display.zoom.cesium.enabled
      ? leafletToCesiumZoom(display.zoom.cesium.value.min)
      : false,
    popup,
    tooltip,
    infobox
  }
  // Merge all updated values
  // Ensure we don't create leaflet/cesium objects if the layer is not 2D/3D
  _.merge(
    updatedLayer,
    { isSelectable: display.isSelectable },
    is2DLayer ? { leaflet } : {},
    is3DLayer ? { cesium } : {}
  )

  if (isInMemoryLayer(layer)) {
    const previousName = _.get(layer, 'name', '')
    _.merge(layer, updatedLayer)
    if (previousName !== layer.name) {
      CurrentActivity.value.renameLayer(previousName, layer.name)
    }
    CurrentActivity.value.resetLayer(layer)
  } else {
    // Dotify the layer to avoid patching the whole object
    // Schema is an exception as internal hooks will convert JSON to string
    const dotifiedLayer = dotify(_.omit(updatedLayer, ['schema']))
    const keys = ['leaflet.cluster', 'leaflet.popup', 'leaflet.tooltip', 'leaflet.infobox', 'cesium.cluster', 'cesium.popup', 'cesium.tooltip', 'cesium.infobox']
    // Remove keys of objects that don't need to be dotified
    _.forIn(dotifiedLayer, (value, key) => {
      _.forEach(keys, k => {
        if (key.startsWith(k)) {
          delete dotifiedLayer[key]
        }
      })
    })
    // Add the objects that don't need to be dotified
    // Ensure not to add 2D properties to a 3D layer and vice versa
    _.forEach(keys, (key, index) => {
      if ((is2DLayer && index < 4) || (is3DLayer && index >= 4)) {
        dotifiedLayer[key] = _.get(updatedLayer, key, false)
      }
    })
    // Manage schema special case
    if (updatedLayer.schema) {
      dotifiedLayer.schema = {
        name: updatedLayer.schema.name,
        content: updatedLayer.schema.content
      }
    } else {
      dotifiedLayer.schema = null
    }

    api.getService('catalog').patch(layer._id, dotifiedLayer)
  }

  return true
}

// Expose
defineExpose({
  apply
})
</script>
