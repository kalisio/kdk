<template>
  <div v-if="items.length > 0" class="scroll">
    <q-timeline color="primary">
      <q-infinite-scroll 
        @load="onLoad" 
        :initial-index="1"
        :offset="100" 
      >
        <template v-for="(item, index) in items" :key="index">
          <q-timeline-entry 
            :title="`${index + 1} - ${item.title}`"
            :subtitle="item.createdAt"
          >
            <div v-html="Document.sanitizeHtml(item.body)" />
          </q-timeline-entry>
        </template>
        <template v-slot:loading>
          <div class="text-center q-my-md">
            <q-spinner-dots 
              color="primary" 
              size="40px" 
            />
          </div>
        </template>
      </q-infinite-scroll>
    </q-timeline>
  </div>
  <!--
    Empty slot
  -->    
  <div v-else>
    <slot name="empty">
      <div class="row justify-center">
        <KStamp 
          icon="las la-exclamation-circle" 
          icon-size="1.6rem" 
          :text="$t('KTimeLine.NO_ENTRY')" 
          direction="horizontal" 
        />
      </div>
    </slot>
  </div>
</template>

<script setup>
import { ref, computed, watch, toRefs, onBeforeMount, onBeforeUnmount } from 'vue'
import { useCollection } from '../../composables'
import { Events } from '../../events.js'
import { Document } from '../../document.js'
import { loadComponent } from '../../utils'
import KStamp from '../KStamp.vue'

// Props
const props = defineProps({
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
  renderer: {
    type: Object,
    default: () => {
      return {
        component: 'collection/KCard'
      }
    }
  },
  processor: {
    type: Function,
    default: undefined
  },
  nbItemsPerPage: {
    type: Number,
    default: 10
  },
  listStrategy: {
    type: String,
    default: 'smart'
  },
  schema: {
    type: Object,
    default: () => { 
      return {
        timeField: 'createdAt',
        colorField: 'type',
        titleField: 'title',
        bodyField: 'body',
        tagsField: 'tags'
      }
    }
  }
})

// Emits
const emit = defineEmits(['collection-refreshed', 'selection-changed'])

// Data
const { items, nbTotalItems, nbPages, currentPage, refreshCollection, resetCollection } = useCollection(_.merge(toRefs(props), { appendItems: ref(true) }))
let doneFunction = null

// Computed
const itemRenderer = computed(() => {
  return loadComponent(props.renderer.component)
})

// Watch
watch(items, onCollectionRefreshed)

// Functions
function onLoad (index, done) {
  currentPage.value = index
  refreshCollection()
  doneFunction = done
}
function onCollectionRefreshed () {
  emit('collection-refreshed', items.value)
  if (doneFunction) {
    doneFunction(items.value.length === nbTotalItems.value ? true : false)
    doneFunction = null
  }
}

// Hooks
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
