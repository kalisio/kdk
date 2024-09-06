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
        ref="scrollAreaRef"
        :max-height="scrollHeight"
        @scrolled="onScrolled"
      >
        <div
          class="full-width column"
          :class="{
            'q-gutter-y-xs': gutter && dense,
            'q-gutter-y-sm': gutter && !dense
          }"
          :style="{ maxWidth: `${width}px` }"
        >
          <template v-for="item in items" :key="item._id">
            <component
              :id="item._id"
              :service="service"
              :item="item"
              :contextId="contextId"
              :is="rendererComponent"
              v-bind="renderer"
              @item-selected="onItemSelected"
              :class="{
                'q-pr-xs': hasScrollArea && dense,
                'q-pr-sm': hasScrollArea && !dense
              }"
            />
          </template>
        </div>
      </KScrollArea>
      <div
        v-if="hasScrollAction"
        class="row justify-center"
      >
        <KAction
          id="scroll-action"
          icon="las la-angle-double-down"
          color="accent"
          size="0.8rem"
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
            class="q-pt-lg"
          />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch, toRefs, onBeforeMount, onBeforeUnmount } from 'vue'
import { Events } from '../../events.js'
import KAction from '../action/KAction.vue'
import KScrollArea from '../KScrollArea.vue'
import KStamp from '../KStamp.vue'
import { useCollection } from '../../composables'
import { loadComponent } from '../../utils/index.js'

const emit = defineEmits(['selection-changed', 'collection-refreshed'])

// Props
const props = defineProps({
  name: {
    type: String,
    default: undefined
  },
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
  width: {
    type: Number,
    default: 200
  },
  height: {
    type: Number,
    default: 300
  },
  gutter: {
    type: Boolean,
    default: true
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

// Data
const scrollAreaRef = ref(null)
const hasScrollArea = ref(false)
const hasScrollAction = ref(false)
const headerHeight = ref(0)
// Configuration
const scrollOffset = 350
const scrollDuration = 250

// Computed
const rendererComponent = computed(() => loadComponent(props.renderer.component))
const scrollHeight = computed(() => props.height - headerHeight.value - (hasScrollAction.value ? 24 : 0))

// Always use append mode for columns
const { items, nbTotalItems, nbPages, currentPage, refreshCollection, resetCollection } =
  useCollection(Object.assign({ appendItems: ref(true) }, toRefs(props)))

// Functions
function onHeaderResized (size) {
  headerHeight.value = size.height
}
function onScrolled (info) {
  hasScrollArea.value = info.verticalSize > scrollHeight.value
  if (items.value.length < nbTotalItems.value) {
    if (info.verticalPercentage === 1) {
      if (items.value.length === currentPage.value * props.nbItemsPerPage) currentPage.value++
      refreshCollection()
      hasScrollAction.value = true
    } else {
      hasScrollAction.value = hasScrollArea.value
    }
  } else {
    if (info.verticalPercentage === 1) {
      hasScrollAction.value = false
    } else {
      hasScrollAction.value = hasScrollArea.value
    }
  }
}
function scrollDown () {
  const position = scrollAreaRef.value.getScrollPosition('vertical')
  scrollAreaRef.value.setScrollPosition('vertical', position + scrollOffset, scrollDuration)
}
function onItemSelected (item, section) {
  emit('selection-changed', item, section)
}
function onCollectionRefreshed () {
  emit('collection-refreshed', items.value)
}

// Watch
watch(items, () => {
  // On reset, reset as well scroll area
  if (_.isEmpty(items.value) && scrollAreaRef.value) scrollAreaRef.value.setScrollPosition('vertical', 0)
  // Emit events so that embbeding components can be aware of it
  onCollectionRefreshed()
})

// Hooks
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
  name: props.name,
  items,
  nbTotalItems,
  nbPages,
  currentPage,
  refreshCollection,
  resetCollection
})
</script>
