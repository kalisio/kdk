<template>
  <div class="column no-wrap">
    <!--
      Header
    -->
    <div class="q-pr-xs q-pb-xs">
      <slot name="header">
        <KPanel
          :content="header"
          :class="headerClass"
         />
      </slot>
    </div>
    <!--
      Content
    -->
    <div v-if="items.length > 0" class="col">
      <!-- Infinite mode -->
      <div v-if="appendItems" class="fit scroll">
        <q-infinite-scroll
          @load="onLoad"
          :initial-index="1"
          :offset="200"
          class="fit"
        >
          <div class="row">
            <template v-for="(item, index) in items" :key="item._id">
              <div :class="rendererClass">
                <component
                  :id="item._id"
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
          <template v-slot:loading>
            <div class="text-center q-my-md">
              <q-spinner-dots
                color="primary"
                size="40px"
              />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
      <!-- Paginated mode -->
      <div v-else class="fit row">
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
            :text="$t('KGrid.EMPTY_LABEL')"
            direction="horizontal"
            class="q-pa-md"
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
    doneFunction(items.value.length === nbTotalItems.value)
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
