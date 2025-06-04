<template>
  <div v-if="layers.length > 0">
    <k-layers-list :layers="filteredLayers" :options="options">
      <template v-slot:header>
        <div class="q-ma-sm">
          <q-select
            for="bdxeo-sensor-model"
            id="bdxeo-sensor-model"
            :placeholder="$t('KLayersSelector.SELECT_LAYERS')"
            autocomplete="off"
            v-model="model"
            :options="selectOptions"
            filled
            use-input
            use-chips
            map-options
            emit-value
            multiple
            clearable
            @filter="filter"
            @add="toggleLayer"
            @remove="toggleLayer"
            @clear="clear"
          >
            <template v-slot:prepend>
              <q-icon name="las la-map-marker" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" :id="scope.opt.name">
                <q-item-section avatar>
                  <q-icon
                    v-if="!scope.opt.iconUrl"
                    :name="scope.opt.icon || 'las la-map-marker'"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label lines="1">
                    {{ scope.opt.label }}
                  </q-item-label>
                  <q-item-label caption lines="2">
                    {{ scope.opt.description }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </template>
    </k-layers-list>
  </div>
  <div v-else class="row justify-center q-pa-sm">
    <KStamp
      icon="las la-exclamation-circle"
      icon-size="sm"
      :text="$t('KWeatherLayersSelector.NO_MODEL_AVAILABLE')"
      text-size="0.9rem"
      direction="horizontal"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { KStamp } from '../../../../core/client/components'
import KLayersList from './KLayersList.vue'
import { i18n } from '../../../../core.client'

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

// Data
const model = ref([])
const selectOptions = ref(
  props.layers.map((layer) => ({ label: layer.label, value: layer._id }))
)

// Computed
const filteredLayers = computed(() =>
  model.value
    ? props.layers.filter((layer) => model.value.includes(layer._id))
    : []
)

// Functions
function toggleLayer (layerId) {
  const layer = props.layers.find((l) => l._id === layerId.value)
  const toggleAction = _.find(layer.actions, { id: 'toggle' })
  if (toggleAction) toggleAction.handler()
}
function clear () {
  for (const layer of props.layers) {
    if (layer?.isVisible) toggleLayer({ value: layer._id })
  }
  model.value = []
}
function filter (val, update, abort) {
  update(() => {
    const needle = val.toLowerCase()
    selectOptions.value = props.layers
      .filter((layer) => layer.label.toLowerCase().indexOf(needle) > -1)
      .map((layer) => ({ label: layer.label, value: layer._id }))
  })
}
</script>
