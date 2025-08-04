<template>
  <div class="q-pa-xs">
    <!--
      Input area
     -->
    <q-input
      :label="pattern ? undefined: $tie(label)"
      v-model="pattern"
      clearable
      borderless
      dense
      debounce="500"
      @update:model-value="onSearch"
    >
      <template v-slot:before>
        <div class="row">
          <q-icon class="q-pl-xs" dense name="search" />
          <template v-for="item in items" :key="item.name">
            <q-chip
              square
              dense
              removable
              color="primary"
              text-color="white"
              size="md"
              @remove="onItemRemoved(item._id)"
            >
              <q-icon v-if="getItemIcon(item)" class="q-pr-sm" :name="getItemIcon(item)" />
              {{ getItemLabel(item) }}
            </q-chip>
          </template>
        </div>
      </template>
    </q-input>
    <!--
      Options menu
     -->
    <q-menu
      v-if="options.length > 0"
      no-focus
      no-refocus
      v-model="hasOptions"
    >
      <q-list style="min-width: 100px">
        <template v-for="option in options" :key="option.name">
          <q-item
            clickable
            @click="onItemSelected(option)"
            v-close-popup>
            <q-item-section v-if="getItemIcon(option)" avatar>
              <q-icon :name="getItemIcon(option)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ getItemLabel(option) }}</q-item-label>
              <q-item-label caption>{{ getItemDescription(option) }}</q-item-label>
            </q-item-section>
        </q-item>
        </template>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { useCurrentActivity } from '../../composables/index.js'
import { Search } from '../../search.js'
import { Store } from '../../store.js'

// Props
const props = defineProps({
  label: {
    type: String,
    default: 'KSearchFilter.SEARCH_LABEL'
  },
  fields: {
    type: [String, Array],
    default: 'name'
  },
  services: {
    type: Array,
    default: () => []
  }
})

// Data
const { CurrentActivityContext } = useCurrentActivity()
const { state } = CurrentActivityContext
const options = ref([]

)
// Computed
const items = computed(() => {
  return state.searchFilter.items
})
const hasOptions = computed({
  get: function () {
    return this.options.length > 0
  },
  set: function (value) {
    if (!value) this.options = []
  }
})

// Functions
function getItemLabel (item) {
  return _.get(item, item.field)
}
function getItemDescription (item) {
  return _.get(item, this.description)
}
function getItemIcon (item) {
  return _.get(item, 'icon.name', _.get(item, 'icon'))
}
function onItemSelected (item) {
  this.items.push(item)
  this.pattern = ''
  Store.patch('filter', { items: this.items, pattern: this.pattern })
}
function onItemRemoved (itemId) {
  _.set(state.searchFilter, 'items', _.without(items.value, itemId))
}
async function onSearch (pattern) {
  // take about a null pattern received when clearing the input
  if (_.isNull(pattern)) pattern = ''
  // update the pattern
  this.pattern = pattern
  Store.patch('filter', { pattern: this.pattern })
  // run the search if the pattern is not empty
  if (!_.isEmpty(pattern)) {
    const results = await Search.query(props.services, pattern)
    if (results.length > 0) {
      options.value = _.differenceWith(results, this.items, (item1, item2) => {
        return item1._id === item2._id
      })
    }
  }
}
</script>
