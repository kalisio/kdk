<template>
  <div class="q-pl-xs q-pb-sm q-pr-sm">
    <div v-if="layers.length > 0" class="full-width row">
      <template v-for="layer in layers" :key="layer.name">
        <div class="col-6 q-pa-xs" >
          <q-card
            :id="getId(layer)"
            v-ripple
            class="k-layer-card"
            v-bind:class="{ 'k-layer-card-active': selectedLayer === layer.name }"
            @click="onLayerSelected(layer)"
          >
            <q-img :src="layer.iconUrl" :ratio="16/9">
              <div
                class="absolute all-pointer-events"
                style="width: 100%; background-color: #00000099; padding: 4px"
              >
                <KStamp
                  :class="selectedLayer === layer.name ? 'text-secondary' : 'text-white'"
                  :text="layer.name"
                  :icon="selectedLayer === layer.name ? 'las la-check-circle': 'las la-circle'"
                  text-size="0.8rem"
                  icon-size="1.2rem"
                  direction="horizontal" />
              </div>
              <q-tooltip
                v-if="(layer.tooltip || layer.description) && $q.platform.is.desktop"
                :delay="1200"
                anchor="center left"
                self="center right"
                :offset="[20, 0]"
              >
                {{ layer.tooltip || layer.description }}
              </q-tooltip>
            </q-img>
          </q-card>
        </div>
      </template>
    </div>
    <div v-else-if="!options.hideIfEmpty" class="row justify-center q-pb-sm">
      <KStamp
        icon="las la-exclamation-circle"
        icons-size="sm"
        :text="$t('KLayersList.NO_LAYER_AVAILABLE')"
        direction="horizontal"
      />
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { KStamp } from '../../../../core/client/components'

// Props
const props = defineProps({
  layers: {
    type: Array,
    default: () => []
  },
  options: {
    type: Object,
    default: () => {}
  }
})

// Computed
const selectedLayer = computed({
  get () {
    // active layer is the one visible
    const visibleLayer = _.find(props.layers, { isVisible: true })
    return visibleLayer ? visibleLayer.name : null
  },
  set (layer) {
    // when defining the selected layer, just perform the action
    // get will pickup the visible layer
    const layerToUnselect = _.find(props.layers, { isVisible: true })
    if (layerToUnselect) toggleLayer(layerToUnselect)
    const unselectedLayerName = layerToUnselect ? layerToUnselect.name : undefined
    const layerNameToSelect = layer.name
    if (unselectedLayerName !== layerNameToSelect) {
      const layerToSelect = _.find(props.layers, { name: layerNameToSelect })
      if (layerToSelect) toggleLayer(layerToSelect)
    }
  }
})

// Functions
function getId (layer) {
  return _.kebabCase(layer.name)
}
function toggleLayer (layer) {
  const toggleAction = _.find(layer.actions, { id: 'toggle' })
  if (toggleAction) toggleAction.handler()
}
function onLayerSelected (layer) {
  if (props.options.disableUnselect && selectedLayer.value && selectedLayer.value === layer.name) return
  selectedLayer.value = layer
}
</script>

<style lang="scss" scoped>
.k-layer-card:hover {
  cursor: pointer;
}
.k-layer-card-active {
  border: 1px solid var(--q-primary);
}
</style>
