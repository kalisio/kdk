<template>
  <div v-if="items.length > 0" class="row">
    <div class="col-12">
      <q-list 
        highlight 
        :separator="separator"
        :dense="dense"
      >
        <template v-for="item in items" :key="item._id">
          <component
            :id="item._id"
            :service="service"
            :item="item"
            :contextId="contextId"
            :is="rendererComponent"
            v-bind="renderer"
            @item-toggled="onItemToggled"
            @item-selected="onItemSelected" />
        </template>
      </q-list>
    </div>
    <div v-if="nbPages > 1" class="col-12">
      <div class="row justify-center">
        <q-pagination
          v-model="currentPage"
          :max="nbPages"
          :input="true"
          @update:model-value="refreshCollection"
        />
      </div>
    </div>
  </div>
  <div v-else>
    <slot name="empty-section">
      <div class="row col justify-center">
        <KStamp
          icon="las la-exclamation-circle"
          icon-size="1.6rem"
          :text="$t('KList.EMPTY_LIST')"
          direction="horizontal" />
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
        component: 'collection/KItem'
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
    default: function () {
      return {}
    }
  },
  filterQuery: {
    type: Object,
    default: function () {
      return {}
    }
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
  },
  appendItems: {
    type: Boolean,
    default: false
  },
  separator: {
    type: Boolean,
    default: true
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Computed
const rendererComponent = computed(() => loadComponent(props.renderer.component))

// Functions
function onItemToggled (item, toggled) {
  emit('item-toggled', item, toggled)
}
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
