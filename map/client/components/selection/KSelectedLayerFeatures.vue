<template>
  <q-tree
    :nodes="[root]"
    node-key="_id"
    label-key="label"
    children-key="features"
    default-expand-all
    dense
  >
    <template v-slot:default-header="prop">
      <!-- Layer rendering -->
      <q-icon v-if="prop.node.icon" :name="prop.node.icon"/>
      <KLayerItem v-if="prop.node.name"
        v-bind="$props"
        :togglable="false"
        :layer="root"
      />
      <!-- Features rendering -->
      <div v-else class="row fit items-center q-pl-md q-pr-sm no-wrap">
        <div :class="{
            'text-primary': root.isVisible,
            'text-grey-6': root.isDisabled || !root.isVisible
          }"
        >
          <span v-html="prop.node.label || prop.node._id" />
        </div>
        <q-space />
        <!-- Features actions -->
        <KPanel
          :id="`${prop.node.label}-feature-actions`"
          :content="featureActions"
          :context="prop.node"
        />
      </div>
    </template>
  </q-tree>
</template>

<script setup>
import _ from 'lodash'
import { Dialog } from 'quasar'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import bbox from '@turf/bbox'
import { Store, i18n } from '../../../../core/client'
import KLayerItem from '../catalog/KLayerItem.vue'
import { useCurrentActivity } from '../../composables/activity.js'
import { getFeatureId, getFeatureLabel } from '../../utils/utils.js'
import { isLayerDataEditable } from '../../utils/utils.layers.js'

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
const editedFeatures = ref([])

// Computed
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
      id: 'remove-selected-feature',
      label: 'KSelectedLayerFeatures.REMOVE_FEATURE_LABEL',
      icon: 'las la-trash',
      handler: removeSelectedFeature,
      visible: isLayerDataEditable(props.item.layer)
    }]
  }]
})
const root = computed(() => {
  const features = props.item.features.map(feature => Object.assign({
    label: getFeatureLabel(feature, props.item.layer),
    icon: (editedFeatures.value.contains(feature) ? 'las la-edit' : '')
  }, feature))
  // Replace default layer actions with new ones
  const root = Object.assign({
    icon: (editedFeatures.value.length > 0 ? 'las la-edit' : '')
  }, _.omit(props.item.layer, ['icon', 'actions']), { actions: layerActions.value, features })
  return root
})

// Functions
function zoomToSelectedFeatures () {
  CurrentActivity.value.zoomToBBox(bbox({ type: 'FeatureCollection', features: props.item.features }))
}
function zoomToSelectedFeature (feature) {
  CurrentActivity.value.zoomToBBox(bbox(feature))
}
function editSelectedFeatures () {
  // Zoom to then edit
  zoomToSelectedFeatures()
  CurrentActivity.value.startEditLayer(props.item.layer, {
    features: props.item.features.map(feature => getFeatureId(feature, props.item.layer)),
    editMode: 'edit-geometry',
    allowedEditModes: [
      'edit-properties',
      'edit-geometry',
      'drag',
      'rotate'
    ],
    callback: (event) => {
      editedFeatures.value = (event.status === 'edit-start' ? props.item.features : [])
    }
  })
}
function editSelectedFeature (feature) {
  // Zoom to then edit
  zoomToSelectedFeature(feature)
  CurrentActivity.value.startEditLayer(props.item.layer, {
    features: [getFeatureId(feature, props.item.layer)],
    editMode: 'edit-geometry',
    allowedEditModes: [
      'edit-properties',
      'edit-geometry',
      'drag',
      'rotate'
    ],
    callback: (event) => {
      editedFeatures.value = (event.status === 'edit-start' ? [feature] : [])
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
    await CurrentActivity.value.removeFeatures(props.item.features, props.item.layer)
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
