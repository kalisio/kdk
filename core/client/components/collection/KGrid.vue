<template>
  <div v-if="items.length > 0" class="q-pa-sm row">
    <template v-for="item in items" :key="item._id">
      <div :class="itemClass">
        <component
          :id="item._id"
          :service="service"
          :item="item"
          :contextId="contextId"
          :is="rendererComponent"
          v-bind="renderer"
          @item-selected="onItemSelected" />
      </div>
    </template>
    <div v-if="nbPages > 1" class="col-12">
      <q-pagination
        class="justify-center q-ma-md"
        v-model="currentPage"
        :max="nbPages"
        :input="true"
        @update:model-value="refreshCollection"
      />
    </div>
  </div>
  <div v-else>
    <slot name="empty-section">
      <div class="row justify-center">
        <KStamp icon="las la-exclamation-circle" icon-size="1.6rem" :text="$t('KGrid.EMPTY_GRID')" direction="horizontal" />
      </div>
    </slot>
  </div>
</template>

<script setup>
import { computed, watch, toRefs, onBeforeMount, onBeforeUnmount } from 'vue'
import KStamp from '../KStamp.vue'
import { Events } from '../../events.js'
import { useCollection } from '../../composables'
import { loadComponent } from '../../utils'

const emit = defineEmits(['selection-changed', 'collection-refreshed'])

// Props
const props = defineProps({
  renderer: {
    type: Object,
    default: () => {
      return {
        component: 'collection/KCard'
      }
    }
  },
  contextId: {
    type: String,
    default: undefined
  },
  service: {
    type: String,
    required: true
  },
  baseQuery: {
    type: Object,
    default: () => {}
  },
  filterQuery: {
    type: Object,
    default: () => {}
  },
  listStrategy: {
    type: String,
    default: 'smart'
  },
  nbItemsPerPage: {
    type: Number,
    default: 12
  },
  processor: {
    type: Function,
    default: undefined
  }
})

// Computed
const rendererComponent = computed(() => loadComponent(props.renderer.component))
const itemClass = computed(() => props.renderer.class || 'q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2')

// Functions
function onItemSelected (item, section) {
  emit('selection-changed', item, section)
}
function onCollectionRefreshed () {
  emit('collection-refreshed', items.value)
}

const { items, nbTotalItems, nbPages, currentPage, refreshCollection, resetCollection } = useCollection(toRefs(props))

// Lifecycle hooks

// Emit events so that embbeding components can be aware of it
watch(items, onCollectionRefreshed)

onBeforeMount(() => {
  refreshCollection()
  // Whenever the user abilities are updated, update collection as well
  Events.on('user-abilities-changed', refreshCollection)
})

onBeforeUnmount(() => {
  Events.off('user-abilities-changed', refreshCollection)
})

// Expose
defineExpose({
  items,
  nbTotalItems,
  nbPages,
  currentPage,
  refreshCollection,
  resetCollection
})
</script>
