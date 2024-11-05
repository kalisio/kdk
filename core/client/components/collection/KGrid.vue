<template>
  <div class="fit column no-wrap">
    <!--
      Header
    -->
    <div id="grid-header">
      <slot name="header">
        <KPanel :content="header" :class="headerClass" />
      </slot>
    </div>
    <!--
      Content
    -->
    <div v-if="items && items.length > 0"
      id="grid-content"
      ref="contentRef"
      class="col scroll"
    >
      <!-- Infinite mode -->
      <div v-if="appendItems" class="column">
        <q-infinite-scroll
          @load="onLoad"
          :initial-index="1"
          :offset="200"
          v-scroll="onScroll"
          class="col"
        >
          <div class="row">
            <template v-for="(item, index) in items" :key="item._id">
              <div :class="rendererClass">
                <component
                  :id="item._id"
                  :ref="onItemRendered"
                  :service="service"
                  :item="item"
                  :contextId="contextId"
                  :is="itemRenderer"
                  v-bind="renderer"
                  @item-selected="onItemSelected"
                />
              </div>
            </template>
          </div>
        </q-infinite-scroll>
      </div>
      <!-- Paginated mode -->
      <div v-else class="row">
        <template v-for="item in items" :key="item._id">
          <div :class="rendererClass">
            <component
              :id="item._id"
              :ref="onItemRendered"
              :service="service"
              :item="item"
              :contextId="contextId"
              :is="itemRenderer"
              v-bind="renderer"
              @item-selected="onItemSelected"
            />
          </div>
        </template>
      </div>
    </div>
    <!-- Empty slot -->
    <div v-else-if="items && items.length === 0"
       id="grid-empty"
    >
      <slot name="empty">
        <div class="row justify-center">
          <KStamp
            icon="las la-exclamation-circle"
            icon-size="1.6rem"
            :text="$t('KGrid.EMPTY_LABEL')"
            direction="horizontal"
            class="q-pa-md"
          />
        </div>
      </slot>
    </div>
    <!-- Initializing slot -->
    <div v-else id="grid-initializing">
      <slot name="initializing">
        <div class="row justify-center">
          <q-spinner
            color="primary"
            size="2rem"
          />
        </div>
      </slot>
    </div>
    <!--
      Controls
     -->
    <div id="grid-controls">
      <div v-if="appendItems">
        <!-- scroll -->
        <div v-if="contentRef" class="row items-center">
          <div class="col-4"></div>
          <div class="col-4 row justify-center">
            <KScrollDown
              v-if="scrollDown"
              :ref="scrollDownRefCreated"
              target="grid-content"
              :loading="loadDoneFunction ? true : false"
          />
          </div>
          <div class="col-4 row justify-end">
            <KScrollToTop
              v-if="scrollToTop"
              :ref="scrollToTopRefCreated"
              target="grid-content"
            />
          </div>
        </div>
      </div>
      <!-- pagination -->
      <div v-else>
        <div v-if="nbPages > 1" class="row justify-center">
          <q-pagination
            v-model="currentPage"
            :max="nbPages"
            :input="true"
            @update:model-value="refreshCollection"
          />
        </div>
      </div>

    </div>
    <!--
      Footer
    -->
    <div id="grid-footer">
      <slot name="footer">
        <KPanel :content="footer" :class="footerClass" />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, toRefs, onBeforeMount, onBeforeUnmount } from 'vue'
import { useCollection } from '../../composables'
import { Events } from '../../events.js'
import { loadComponent } from '../../utils'
import KScrollToTop from './KScrollToTop.vue'
import KScrollDown from './KScrollDown.vue'
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
  scrollDown: {
    type: Boolean,
    default: true
  },
  scrollToTop: {
    type: Boolean,
    default: true
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
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['collection-refreshed', 'selection-changed'])

// Data
const { items, nbTotalItems, nbPages, currentPage, refreshCollection, resetCollection } = useCollection(toRefs(props))
const contentRef = ref(null)
const scrollDownRef = ref(null)
const scrollToTopRef = ref(null)
const loadDoneFunction = ref(null)

// Computed
const itemRenderer = computed(() => {
  return loadComponent(props.renderer.component)
})
const rendererClass = computed(() => {
  return props.renderer.class || 'q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3'
})

// Watch
watch(items, onCollectionRefreshed)

// Functions
function onItemRendered (instance) {
  if (instance) onScroll()
}
function scrollDownRefCreated (instance) {
  scrollDownRef.value = instance
  if (instance) instance.refresh()
}
function scrollToTopRefCreated (instance) {
  scrollToTopRef.value = instance
  if (instance) instance.refresh()
}
function onScroll () {
  if (scrollDownRef.value) scrollDownRef.value.refresh()
  if (scrollToTopRef.value) scrollToTopRef.value.refresh()
}
function onLoad (index, done) {
  // check whether the items are all loaded yet
  if (items.value.length === nbTotalItems.value) {
    done(true)
    return
  }
  // set the current page and tell the collection to be refreshed
  currentPage.value = index
  refreshCollection()
  loadDoneFunction.value = done
}
function onItemSelected (item, section) {
  emit('selection-changed', item, section)
}
function onCollectionRefreshed () {
  emit('collection-refreshed', items.value)
  // call done callback if needed
  if (loadDoneFunction.value) {
    loadDoneFunction.value(items.value.length === nbTotalItems.value)
    loadDoneFunction.value = null
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
