<template>
  <div>
    <q-tree
      :nodes="[root]"
      node-key="_id"
      label-key="label"
      children-key="children"
      v-model:expanded="expandedNodes"
      dense
    >
      <template v-slot:default-header="prop">
        <!-- Layer rendering -->
        <q-icon v-if="prop.node.icon" :name="prop.node.icon"/>
        <KLayerItem v-if="isLayerNode(prop.node)"
          v-bind="$props"
          :togglable="false"
          :layer="root"
        />
        <!-- Features rendering -->
        <div v-else-if="prop.node.label" class="row fit items-center q-pl-md q-pr-sm no-wrap">
          <div :class="{
              'text-primary': root.isVisible,
              'text-grey-6': root.isDisabled || !root.isVisible
            }"
          >
            <span v-html="prop.node.label" />
          </div>
          <q-space  v-if="isFeatureNode(prop.node)"/>
          <!-- Features actions -->
          <KPanel v-if="isFeatureNode(prop.node)"
            :id="`${prop.node.label}-feature-actions`"
            :content="featureActions"
            :context="prop.node"
          />
        </div>
      </template>
      <!-- Feature properties rendering -->
      <template v-slot:default-body="prop">
        <KView v-if="isFeaturePropertiesNode(prop.node)"
          class="q-pa-md full-width"
          :values="prop.node"
          :schema="schema"
          :separators="true"
        />
      </template>
    </q-tree>
    <KModal
      id="style-editor-modal"
      :title="styleEditorTitle"
      :buttons="[]"
      v-model="isFeatureStyleEdited"
    >
      <KStyleEditor :edit-name="false" :allowed-styles="[editedFeatureType]" :style="editedFeatureStyle" @cancel="onCancelFeatureStyle" @apply="onApplyFeatureStyle" />
    </KModal>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { Dialog } from 'quasar'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import bbox from '@turf/bbox'
import { Store, i18n } from '../../../../core/client'
import { KView } from '../../../../core/client/components'
import KLayerItem from '../catalog/KLayerItem.vue'
import KStyleEditor from '../styles/KStyleEditor.vue'
import { useCurrentActivity } from '../../composables/activity.js'
import { getFeatureId, getFeatureLabel } from '../../utils/utils.js'
import { isLayerDataEditable } from '../../utils/utils.layers.js'
import { getFeatureStyleType } from '../../utils/utils.features.js'
import { generatePropertiesSchema } from '../../utils/utils.schema.js'

// Props
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  }
})

// Data
const route = useRoute()
const router = useRouter()
const { CurrentActivity } = useCurrentActivity()
const expandedNodes = ref([props.item.layer._id])
const editedFeatures = ref([])
const editedFeature = ref(null)
const editedFeatureType = ref(null)
const editedFeatureStyle = ref(null)

// Computed
const isFeatureStyleEdited = computed(() => {
  return !_.isNil(editedFeatureStyle.value)
})
const styleEditorTitle = computed(() => {
  return (editedFeature.value ? getFeatureLabel(editedFeature.value, props.item.layer) : '')
})
const layerActions = computed(() => {
  return [{
    id: 'layer-actions',
    component: 'menu/KMenu',
    dropdownIcon: 'las la-ellipsis-v',
    actionRenderer: 'item',
    propagate: false,
    dense: true,
    content: [{
      id: 'zoom-to-selected-features',
      label: 'KSelectedLayerFeatures.ZOOM_TO_FEATURES_LABEL',
      icon: 'las la-search-location',
      handler: zoomToSelectedFeatures
    }, {
      id: 'edit-selected-features',
      label: 'KSelectedLayerFeatures.EDIT_FEATURES_LABEL',
      icon: 'las la-edit',
      handler: editSelectedFeatures,
      visible: isLayerDataEditable(props.item.layer)
    }, {
      id: 'reset-style-selected-features',
      label: 'KSelectedLayerFeatures.RESET_FEATURES_STYLE_LABEL',
      icon: 'las la-ban',
      handler: resetSelectedFeaturesStyle,
      visible: isLayerDataEditable(props.item.layer)
    }, {
      id: 'remove-selected-features',
      label: 'KSelectedLayerFeatures.REMOVE_FEATURES_LABEL',
      icon: 'las la-trash',
      handler: removeSelectedFeatures,
      visible: isLayerDataEditable(props.item.layer)
    }]
  }]
})
const featureActions = computed(() => {
  return [{
    id: 'feature-actions',
    component: 'menu/KMenu',
    dropdownIcon: 'las la-ellipsis-v',
    actionRenderer: 'item',
    propagate: false,
    dense: true,
    content: [{
      id: 'zoom-to-selected-feature',
      label: 'KSelectedLayerFeatures.ZOOM_TO_FEATURE_LABEL',
      icon: 'las la-search-location',
      handler: zoomToSelectedFeature
    }, {
      id: 'edit-selected-feature',
      label: 'KSelectedLayerFeatures.EDIT_FEATURE_LABEL',
      icon: 'las la-edit',
      handler: editSelectedFeature,
      visible: isLayerDataEditable(props.item.layer)
    }, {
      id: 'edit-selected-feature-properties',
      label: 'KSelectedLayerFeatures.EDIT_FEATURE_PROPERTIES_LABEL',
      icon: 'las la-address-card',
      handler: editSelectedFeatureProperties,
      visible: isLayerDataEditable(props.item.layer) && _.get(props.item.layer, 'schema.content')
    }, {
      id: 'edit-style-selected-feature',
      label: 'KSelectedLayerFeatures.EDIT_FEATURE_STYLE_LABEL',
      icon: 'las la-paint-brush',
      handler: editSelectedFeatureStyle,
      visible: isLayerDataEditable(props.item.layer)
    }, {
      id: 'reset-style-selected-feature',
      label: 'KSelectedLayerFeatures.RESET_FEATURE_STYLE_LABEL',
      icon: 'las la-ban',
      handler: resetSelectedFeatureStyle,
      visible: isLayerDataEditable(props.item.layer)
    }, {
      id: 'remove-selected-feature',
      label: 'KSelectedLayerFeatures.REMOVE_FEATURE_LABEL',
      icon: 'las la-trash',
      handler: removeSelectedFeature,
      visible: isLayerDataEditable(props.item.layer)
    }]
  }]
})
const schema = computed(() => {
  let schema
  // Is there any schema ?
  if (_.has(props.item.layer, 'schema.content')) {
    // As we update the schema does not alter the original one
    schema = _.cloneDeep(_.get(props.item.layer, 'schema.content'))
  } else {
    schema = generatePropertiesSchema(_.get(props.item, 'features[0]', {}), props.item.layer.name)
  }
  // Ensure schema is not empty
  if (_.isNil(schema) || _.isEmpty(_.get(schema, 'properties', {}))) {
    return
  }
  return schema
})
const root = computed(() => {
  const children = props.item.features.map(feature => Object.assign({
    icon: getIcon(feature),
    label: getLabel(feature),
    children: [Object.assign({
      icon: getIcon(feature.properties),
      label: getLabel(feature.properties)
    }, feature.properties)] // Properties only for node displaying it
  }, feature)) // Target feature is required as context for actions
  // For each feature add a node containing
  // Replace default layer actions with new ones
  return Object.assign({
    icon: getIcon(props.item.layer),
    label: getLabel(props.item.layer)
  }, _.omit(props.item.layer, ['icon', 'actions']), { actions: layerActions.value, children })
})

// Functions
function isLayerNode (node) {
  return node.name
}
function isFeatureNode (node) {
  return node.properties
}
function isFeaturePropertiesNode (node) {
  return !node.properties && !isLayerNode(node)
}
function getIcon (node) {
  if (isLayerNode(node)) return (editedFeatures.value.length > 0 ? 'las la-edit' : '')
  if (isFeatureNode(node)) return (editedFeatures.value.contains(getFeatureId(node, props.item.layer)) ? 'las la-edit' : '')
  if (isFeaturePropertiesNode(node)) return 'las la-address-card'
  return ''
}
function getLabel (node) {
  if (isLayerNode(node)) return node.label || node.name
  if (isFeatureNode(node)) return getFeatureLabel(node, props.item.layer) || getFeatureId(node, props.item.layer)
  if (isFeaturePropertiesNode(node)) return i18n.t('KSelectedLayerFeatures.FEATURE_PROPERTIES_LABEL')
  return ''
}
function zoomToSelectedFeatures () {
  CurrentActivity.value.zoomToBBox(bbox({ type: 'FeatureCollection', features: props.item.features }))
}
function zoomToSelectedFeature (feature) {
  CurrentActivity.value.zoomToBBox(bbox(feature))
}
function editSelectedFeatures () {
  // Zoom to then edit
  zoomToSelectedFeatures()
  editedFeatures.value = props.item.features.map(feature => getFeatureId(feature, props.item.layer))
  CurrentActivity.value.startEditLayer(props.item.layer, {
    features: editedFeatures.value,
    editMode: 'edit-geometry',
    allowedEditModes: [
      'edit-properties',
      'edit-geometry',
      'drag',
      'rotate'
    ],
    callback: (event) => {
      if (event.status === 'accept') editedFeatures.value = []
    }
  })
}
function editSelectedFeature (feature) {
  // Zoom to then edit
  zoomToSelectedFeature(feature)
  editedFeatures.value = [getFeatureId(feature, props.item.layer)]
  CurrentActivity.value.startEditLayer(props.item.layer, {
    features: editedFeatures.value,
    editMode: 'edit-geometry',
    allowedEditModes: [
      'edit-properties',
      'edit-geometry',
      'drag',
      'rotate'
    ],
    callback: (event) => {
      if (event.status === 'accept') editedFeatures.value = []
    }
  })
}
function editSelectedFeatureProperties (feature) {
  // Zoom to then edit
  zoomToSelectedFeature(feature)
  router.push({
    name: 'edit-map-layer-feature',
    query: route.query,
    params: Object.assign(route.params, {
      layerId: props.item.layer._id,
      layerName: props.item.layer.name,
      featureId: feature._id,
      contextId: Store.get('context')
    })
  })
}
function editSelectedFeatureStyle (feature) {
  editedFeature.value = feature
  editedFeatureType.value = getFeatureStyleType(feature)
  editedFeatureStyle.value = { [editedFeatureType.value]: _.get(feature, 'style', {}) }
}
function onCancelFeatureStyle () {
  editedFeature.value = null
  editedFeatureType.value = null
  editedFeatureStyle.value = null
}
async function onApplyFeatureStyle (style) {
  await CurrentActivity.value.editFeaturesStyle(Object.assign(editedFeature.value, { style: style[editedFeatureType.value] }), props.item.layer)
  onCancelFeatureStyle()
}
async function resetSelectedFeaturesStyle () {
  await CurrentActivity.value.editFeaturesStyle({ type: 'FeatureCollection', features: props.item.features.map(feature => Object.assign(feature, { style: {} })) }, props.item.layer)
}
async function resetSelectedFeatureStyle (feature) {
  await CurrentActivity.value.editFeaturesStyle(Object.assign(feature, { style: {} }), props.item.layer)
}
function removeSelectedFeatures () {
  Dialog.create({
    title: i18n.t('KSelectedLayerFeatures.REMOVE_FEATURES_DIALOG_TITLE'),
    message: i18n.t('KSelectedLayerFeatures.REMOVE_FEATURES_DIALOG_MESSAGE'),
    html: true,
    ok: {
      label: i18n.t('OK'),
      flat: true
    },
    cancel: {
      label: i18n.t('CANCEL'),
      flat: true
    }
  }).onOk(async () => {
    await CurrentActivity.value.removeFeatures({ type: 'FeatureCollection', features: props.item.features }, props.item.layer)
  })
}
function removeSelectedFeature (feature) {
  Dialog.create({
    title: i18n.t('KSelectedLayerFeatures.REMOVE_FEATURE_DIALOG_TITLE'),
    message: i18n.t('KSelectedLayerFeatures.REMOVE_FEATURE_DIALOG_MESSAGE'),
    html: true,
    ok: {
      label: i18n.t('OK'),
      flat: true
    },
    cancel: {
      label: i18n.t('CANCEL'),
      flat: true
    }
  }).onOk(async () => {
    await CurrentActivity.value.removeFeatures(feature, props.item.layer)
  })
}
</script>
