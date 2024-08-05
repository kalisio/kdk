<template>
  <div class="fit column">
    <!-- 
      Header 
    -->
    <div class="q-pr-xs q-pb-xs">
      <slot name="header">
        <KPanel 
          :content="header"
          :class="headerClass"
         />
        <q-separator inset v-if="header"/>
      </slot>
    </div>
    <!--
      Content
    -->
    <div v-if="items.length > 0" class="scroll q-pr-md">
      <!-- Infinite mode -->
      <q-infinite-scroll 
        v-if="appendItems"
        @load="onLoad"
        :initial-index="1"
        :offset="200"
        class="col"
      >
        <template v-for="(item, index) in items" :key="item._id">
          <div :class="rendererClass">
            <component
              :id="item._id"
              :service="service"
              :item="item"
              :contextId="contextId"
              :is="itemRenderer"
              v-bind="renderer"
              @item-selected="onItemSelected" />
          </div>
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
      <!-- Paginated mode -->    
      <div v-else class="fit">
        <template v-for="item in items" :key="item._id">
          <div :class="rendererClass">
            <component
              :id="item._id"
              :service="service"
              :item="item"
              :contextId="contextId"
              :is="itemRenderer"
              v-bind="renderer"
              @item-selected="onItemSelected" />
          </div>
        </template>
        <div v-if="nbPages > 1" class="col-12">
          <q-pagination
            class="row justify-center q-ma-md"
            v-model="currentPage"
            :max="nbPages"
            :input="true"
            @update:model-value="refreshCollection"
          />
        </div>
      </div>
    </div>
    <!-- Empty slot -->    
    <div v-else>
      <slot name="empty">
        <div class="row justify-center">
          <KStamp 
            icon="las la-exclamation-circle" 
            icon-size="1.6rem" 
            :text="$t('KCollection.NO_ITEMS')" 
            direction="horizontal" 
          />
        </div>
      </slot>
    </div>
    <!-- 
      Footer
    -->
    <div>
      <slot name="footer">
        <q-separator inset v-if="footer"/>
        <KPanel 
          :content="footer" 
          :class="footerClass"
        />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, toRefs, onBeforeMount, onBeforeUnmount } from 'vue'
import { useCollection } from '../../composables'
import { Events } from '../../events.js'
import { loadComponent } from '../../utils'
import KStamp from '../KStamp.vue'
import KPanel from '../KPanel.vue'

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
  appendItems: {
    type: Boolean,
    default: false
  },
  nbItemsPerPage: {
    type: Number,
    default: 12
  },
  listStrategy: {
    type: String,
    default: 'smart'
  },
  header: {
    type: [Array, Object],
    default: () => null
  },
  headerClass: {
    type: String,
    default: undefined
  },
  footer: {
    type: [Array, Object],
    default: () => null
  },
  footerClass: {
    type: String,
    default: undefined
  }
})

// Emits
const emit = defineEmits(['collection-refreshed', 'selection-changed'])

// Data
const { items, nbTotalItems, nbPages, currentPage, refreshCollection, resetCollection } = useCollection(toRefs(props))
let doneFunction = null

const itemRenderer = computed(() => {
  return loadComponent(props.renderer.component)
})
const rendererClass = computed(() => {
  return props.renderer.class || 'q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3'
})

// Watch
watch(items, onCollectionRefreshed)

// Functions
function onLoad (index, done) {
  currentPage.value = index
  refreshCollection()
  doneFunction = done
}
function onItemSelected (item, section) {
  emit('selection-changed', item, section)
}
function onCollectionRefreshed () {
  emit('collection-refreshed', items.value)
  // call done callback if needed  
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
