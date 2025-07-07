<template>
  <q-expansion-item
    :header-class="headerClass"
    :icon="icon"
    :label="name"
    :default-opened="defaultOpened"
    expand-separator
    @update:model-value="onToggled"
  >
    <template v-slot:header>
      <slot name="header">
        <q-item-section>
          {{ name }}
        </q-item-section>
      </slot>
    </template>
    <component
      :is="category.componentInstance"
      :category="category"
      :layers="layers"
      :forecastModels="forecastModels"
      :options="category.options || category"
      >
    </component>
  </q-expansion-item>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { i18n, LocalStorage } from '../../../../core/client'

// Props
const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  layers: {
    type: Array,
    required: true
  },
  forecastModels: {
    type: Array,
    default: () => []
  }
})

// Data
const localStorageKey = 'catalog-categories'

// Computed
const name = computed(() => {
  return i18n.tie(props.category.name)
})
const headerClass = computed(() => {
  const defaultClass = 'text-' + _.get(props.category, 'icon.color', 'primary')
  return _.get(props.category, 'headerClass', defaultClass)
})
const icon = computed(() => {
  _.get(props.category, 'icon.name', _.get(props.category, 'icon'))
})
const defaultOpened = computed(() => {
  const states = LocalStorage.get(localStorageKey)
  if (states && _.has(states, getId())) return states[getId()]
  // if category explicitly specify default opened state, use that
  if (_.has(props.category, 'options.open')) return props.category.options.open
  // otherwise, default open when there's only one category
  // return this.filteredCategories.length === 1
  // robin: to not break existing apps, just return false when options.open is not defined
  return false
})

// Functions
function getId () {
  return _.kebabCase(_.replace(props.category.name, 'Categories.', ''))
}
function onToggled (value) {
  const states = LocalStorage.get(localStorageKey, {})
  states[getId()] = value
  LocalStorage.set(localStorageKey, states)
}
</script>
