<template>
  <div class="column full-width">
    <!--
      Header
     -->
     <div class="full-width">
      <q-resize-observer @resize="onHeaderResized" />
      <KPanel
        id="header"
        :content="header"
        class="no-wrap"
      />
    </div>
    <!--
      Items
     -->
    <div v-if="items.length > 0">
      <KScrollArea
        ref="scrollArea"
        :max-height="scrollHeight"
        @scrolled="onScrolled"
      >
        <div class="full-width row">
          <template v-for="item in items" :key="item._id">
            <component
              :id="item._id"
              :service="service"
              :item="item"
              :contextId="contextId"
              :is="rendererComponent"
              v-bind="renderer"
              @item-selected="onItemSelected"
            />
          </template>
        </div>
      </KScrollArea>
      <div
        v-if="scrollAction"
        class="row justify-center"
      >
        <KAction
          id="scroll-action"
          icon="las la-angle-double-down"
          color="accent"
          size="1rem"
          :handler="scrollDown"
        />
      </div>
    </div>
    <div v-else>
      <slot name="empty-column">
        <div class="row justify-center">
          <KStamp
            icon="las la-exclamation-circle"
            icon-size="1.6rem"
            :text="$t('KColumn.EMPTY_COLUMN')"
            direction="horizontal"
          />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, reactive, computed, watch, toRefs, onBeforeMount, onBeforeUnmount } from 'vue'
import { Events } from '../../events.js'
import KAction from '../KAction.vue'
import KScrollArea from '../KScrollArea.vue'
import KStamp from '../KStamp.vue'
import { useCollection } from '../../composables'
import { loadComponent } from '../../utils/index.js'

const emit = defineEmits(['selection-changed', 'collection-refreshed'])

// Props
const props = defineProps({
  header: {
    type: Array,
    default: () => null
  },
  renderer: {
    type: Object,
    default: () => {
      return {
        component: 'collection/KCard'
      }
    }
  },
  height: {
    type: Number,
    default: 300
  },
  dense: {
    type: Boolean,
    default: false
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
  }
})

// Data
const scrollArea = ref(null)
const scrollAction = ref(false)
const headerHeight = ref(0)
// Configuration
const scrollOffset = 350
const scrollDuration = 250

// Computed
const rendererComponent = computed(() => loadComponent(props.renderer.component))
const scrollHeight = computed(() => props.height - headerHeight.value)

// Always use append mode for columns
const { items, nbTotalItems, nbPages, currentPage, refreshCollection, resetCollection } =
  useCollection(Object.assign({ appendItems: ref(true) }, toRefs(props)))

// Functions
function onHeaderResized (size) {
  headerHeight.value = size.height
}
function onScrolled (info) {
  if (items.value.length < nbTotalItems.value) {
    if (info.verticalPercentage === 1) {
      if (items.value.length === currentPage.value * props.nbItemsPerPage) currentPage.value++
      refreshCollection()
      scrollAction.value = true
    } else {
      scrollAction.value = info.verticalSize > scrollHeight.value
    }
  } else {
    if (info.verticalPercentage === 1) {
      scrollAction.value = false
    } else {
      scrollAction.value = info.verticalSize > scrollHeight.value
    }
  }
}
function scrollDown () {
  const position = scrollArea.value.getScrollPosition('vertical')
  scrollArea.value.setScrollPosition('vertical', position + scrollOffset, scrollDuration)
}
function onItemSelected (item, section) {
  emit('selection-changed', item, section)
}
function onCollectionRefreshed () {
  emit('collection-refreshed', items.value)
}

// Lifecycle hooks
watch(items, () => {
  // On reset, reset as well scroll area
  if (_.isEmpty(items.value) && scrollArea.value) scrollArea.value.setScrollPosition('vertical', 0)
  // Emit events so that embbeding components can be aware of it
  onCollectionRefreshed()
})

onBeforeMount(() => {
  refreshCollection()
  // Whenever the user abilities are updated, update collection as well
  Events.on('user-abilities-changed', resetCollection)
})

onBeforeUnmount(() => {
  Events.off('user-abilities-changed', resetCollection)
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
