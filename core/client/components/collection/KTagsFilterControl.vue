<template>
  <div
    v-if="filterByScope"
    class="k-fab-filter"
  >
    <KAction
      id="filter-action"
      :icon="isOpen ? 'close' : 'las la-filter'"
      :tooltip="computedTooltip"
      color="grey-9"
      :handler="() => { isOpen = !isOpen }"
    />
    <transition name="k-fab-filter-expand">
      <div v-if="isOpen" class="k-fab-filter__items">
        <template v-for="scope in scopes" :key="scope">
          <KTagFilter
            :name="scope"
            :model-value="openedScope === scope"
            :options="filterOptionsForScope(scope)"
            :selection="tagsFilterSelection"
            :alignment="computedAlignment"
            :icon="iconForScope(scope)"
            color="primary"
            :flat="false"
            :tooltip="tooltipForScope(scope)"
            @selection-changed="onSelectionChanged"
            @shown="onFilterShown"
            @hidden="onFilterHidden"
          />
        </template>
      </div>
    </transition>
  </div>
  <KTagFilter
    v-else
    :options="options"
    :selection="tagsFilterSelection"
    :alignment="computedAlignment"
    @selection-changed="onSelectionChanged"
  />
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { useScreen, useCollectionFilter } from '../../composables'
import KTagFilter from '../tags/KTagFilter.vue'

// Props
const props = defineProps({
  filterByScope: {
    type: Boolean,
    default: false
  },
  scopes: {
    type: Object,
    default: () => null
  },
  alignment: {
    type: [String, Object],
    default: 'center'
  }
})

// Data
const { Screen } = useScreen()
const {
  tagsFilterOptions,
  tagsFilterSelection,
  setTagsFilterSelection
} = useCollectionFilter()
const isOpen = ref(false)
const openedScope = ref(null)

// Computed
const scopes = computed(() => {
  return _.uniq(_.map(tagsFilterOptions.value, 'scope'))
})
const options = computed(() => {
  return _.difference(tagsFilterOptions.value, tagsFilterSelection.value)
})
const computedTooltip = computed(() => {
  if (!isOpen.value) return 'KTagsFilterControl.FILTER'
})
const computedAlignment = computed(() => {
  if (_.isString(props.alignment)) return props.alignment
  return _.get(props.alignment, Screen.name)
})

// Function
function onSelectionChanged (selection) {
  setTagsFilterSelection(selection)
}
function iconForScope (scope) {
  return props.scopes?.[scope]?.icon ?? 'las la-filter'
}
function colorForScope (scope) {
  return props.scopes?.[scope]?.color ?? 'primary'
}
function tooltipForScope (scope) {
  return props.scopes?.[scope]?.tooltip
}
function filterOptionsForScope (scope) {
  return _.filter(options.value, { scope })
}
function onFilterShown (scope) {
  openedScope.value = scope
}
function onFilterHidden (scope) {
  if (openedScope.value === scope) openedScope.value = null
}
</script>

<style scoped>
.k-fab-filter {
  position: relative;
  display: inline-flex;
}

.k-fab-filter__items {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  gap: 24px;
  z-index: 1;
}

.k-fab-filter-expand-enter-active,
.k-fab-filter-expand-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.k-fab-filter-expand-enter-from,
.k-fab-filter-expand-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
}
</style>