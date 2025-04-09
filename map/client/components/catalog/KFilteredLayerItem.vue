<template>
  <KLayerItem v-if="!layer.filters"
    v-bind="$props"
    :layer="layer"
    @toggled="onToggled"
  >
    <template v-slot:status>
      <slot name="status" />
    </template>
  </KLayerItem>
  <q-tree v-else
    :nodes="[layer]"
    node-key="label"
    label-key="label"
    children-key="filters"
    dense
  >
    <template v-slot:default-header="prop">
      <!-- Layer rendering -->
      <KLayerItem v-if="prop.node.name"
        v-bind="$props"
        :layer="layer"
        @toggled="onToggled"
      >
        <template v-slot:status>
          <slot name="status" />
        </template>
      </KLayerItem>
      <!-- Filter rendering -->
      <div v-else class="row items-center q-pl-md q-pr-sm no-wrap">
        <!-- Filter toggle -->
        <q-toggle
          :ref="onToggleRefCreated(prop.node)"
          v-model="prop.node.isActive"
          :color="layer.isVisible ? 'primary' : 'grey-5'"
          :disable="layer.isDisabled || !layer.isVisible"
          size="xs"
          @update:modelValue="onFilterToggled(prop.node)"
        />
        <div :class="{
            'text-primary': layer.isVisible,
            'text-grey-6': layer.isDisabled || !layer.isVisible || !prop.node.isActive
          }"
        >
          {{ $tie(prop.node.label) }}
          <q-tooltip
            v-if="(prop.node.tooltip || prop.node.description) && $q.platform.is.desktop" :delay="1000"
            anchor="center left"
            self="center right"
            :offset="[20, 0]">
            {{ prop.node.tooltip || prop.node.description }}
          </q-tooltip>
        </div>
      </div>
    </template>
  </q-tree>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import KLayerItem from './KLayerItem.vue'

// Props
const props = defineProps({
  layer: {
    type: Object,
    default: () => {}
  }
})

// Emits
const emit = defineEmits(['toggled', 'filter-toggled'])

// Datas
const filters = ref([])

// Functions
function onToggleRefCreated (node) {
  if (node) {
    if (!_.find(filters.value, filter => {
      return node.label === filter.label
    })) filters.value.push(node)
  }
}
function onToggled () {
  emit('toggled', props.layer)
  if (props.layer.isVisible) {
    const areFiltersInactive = _.every(filters.value, { isActive: false })
    if (areFiltersInactive) {
      for (const filter of filters.value) filter.isActive = true
    }
  }
}
function onFilterToggled (filter) {
  emit('filter-toggled', props.layer, filter)
  const areFiltersInactive = _.every(filters.value, { isActive: false })
  if (areFiltersInactive) emit('toggled', props.layer)
}
</script>
