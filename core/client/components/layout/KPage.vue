<template>
  <q-page :padding="padding" :style-fn="layoutOffsetListener">
    <!--
      Specific page content: can be provided as slot or/and by configuration
     -->
    <div id="page-content-container" :style="contentStyleFunction">
      <div class="fit">
        <q-resize-observer @resize="onContentResized" />
        <slot name="page-content" />
        <KContent
          id="page"
          v-show="page.visible"
          :content="page.components"
        />
      </div>
    </div>
    <!--
      Managed stickies
      Be careful of the order
     -->
    <!-- Bottom pane -->
    <q-page-sticky position="bottom" class="k-pane-z-index">
      <div id="bottom-pane" v-show="hasBottomPaneComponents" class="column items-center">
        <KOpener id="bottom-opener" v-if="bottomPane.opener" v-model="isBottomPaneOpened" position="bottom" />
        <div>
          <KPanel
            id="bottom-panel"
            v-show="bottomPane.visible"
            :content="bottomPane.components"
            :mode="bottomPane.mode"
            :style="bottomPaneStyle"
            class="k-pane"
          />
          <q-resize-observer v-if="padding" debounce="200" @resize="onBottomPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <!-- Right pane -->
    <q-page-sticky position="right" class="k-pane-z-index">
      <div id="right-pane" v-show="hasRightPaneComponents" class="row items-center">
        <KOpener id="right-opener" v-if="rightPane.opener" v-model="isRightPaneOpened" position="right" />
        <div>
          <KPanel
            id="right-panel"
            v-show="rightPane.visible"
            :content="rightPane.components"
            :mode="rightPane.mode"
            direction="vertical"
            :style="rightPaneStyle"
            class="k-pane"
          />
          <q-resize-observer v-if="padding" debounce="200" @resize="onRightPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <!-- Top pane -->
    <q-page-sticky position="top" class="k-pane-z-index">
      <div id="top-pane" v-show="hasTopPaneComponents" class="column items-center">
        <div>
          <KPanel
            id="top-panel"
            v-show="topPane.visible"
            :content="topPane.components"
            :mode="topPane.mode"
            :style="topPaneStyle"
            class="k-pane"
          />
          <q-resize-observer v-if="padding" debounce="200" @resize="onTopPaneResized" />
        </div>
        <KOpener id="top-opener" v-if="topPane.opener" v-model="isTopPaneOpened" position="top" />
      </div>
    </q-page-sticky>
    <!-- Fab -->
    <q-page-sticky :position="fab.position" :offset="fab.offset" class="k-fab-z-index">
      <KFab
        id="fab"
        v-if="fab.visible"
        :direction="fabBehavior.direction"
        :actions-align="fabBehavior.actionsAlign"
      />
    </q-page-sticky>
    <!-- Windows -->
    <q-page-sticky position="top-left" :offset="leftWindow.position" class="k-window-z-index">
      <KWindow
        id="left-window"
        v-if="leftWindow.visible"
        placement="left"
        :layout-offset="layoutOffset"
        :style="leftWindowStyle"
      />
    </q-page-sticky>
    <q-page-sticky position="top-left" :offset="topWindow.position" class="k-window-z-index">
      <KWindow
        id="top-window"
        v-if="topWindow.visible"
        placement="top"
        :layout-offset="layoutOffset"
        :style="topWindowStyle"
      />
    </q-page-sticky>
    <q-page-sticky position="top-left" :offset="rightWindow.position" class="k-window-z-index">
      <KWindow
        id="right-window"
        v-if="rightWindow.visible"
        placement="right"
        :layout-offset="layoutOffset"
        :style="rightWindowStyle"
      />
    </q-page-sticky>
    <q-page-sticky position="top-left" :offset="bottomWindow.position" class="k-window-z-index">
      <KWindow
        id="bottom-window"
        v-if="bottomWindow.visible"
        placement="bottom"
        :layout-offset="layoutOffset"
        :style="bottomWindowStyle"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { computeResponsiveWidth, computeResponsiveSize } from '../../utils'
import { Layout } from '../../layout.js'
import KContent from '../KContent.vue'
import KPanel from '../KPanel.vue'
import KOpener from './KOpener.vue'
import KWindow from './KWindow.vue'
import KFab from './KFab.vue'

// Props
const props = defineProps({
  padding: {
    type: Boolean,
    default: true
  }
})

// Emit
const emit = defineEmits(['content-resized'])

// Data
const page = Layout.getPage()
const fab = Layout.getFab()
const topPane = Layout.getPane('top')
const rightPane = Layout.getPane('right')
const bottomPane = Layout.getPane('bottom')
const leftWindow = Layout.getWindow('left')
const topWindow = Layout.getWindow('top')
const rightWindow = Layout.getWindow('right')
const bottomWindow = Layout.getWindow('bottom')
const layoutOffset = ref(0)
const topPadding = ref(0)
const bottomPadding = ref(0)
const rightPadding = ref(0)

// Computed
const contentStyleFunction = computed(() => {
  const layoutPadding = props.padding ? 24 * 2 : 0
  const widthOffset = layoutPadding
  const heightOffset = layoutOffset.value + layoutPadding
  return {
    paddingTop: `${topPadding.value}px`,
    paddingBottom: `${bottomPadding.value}px`,
    width: `calc(100vw - ${widthOffset}px)`,
    height: `calc(100vh - ${heightOffset}px)`
  }
})
const isTopPaneOpened = computed({
  get: function () {
    return topPane.visible
  },
  set: function (value) {
    setTopPaneVisible(value)
  }
})
const isRightPaneOpened = computed({
  get: function () {
    return rightPane.visible
  },
  set: function (value) {
    setRightPaneVisible(value)
  }
})
const isBottomPaneOpened = computed({
  get: function () {
    return bottomPane.visible
  },
  set: function (value) {
    setBottomPaneVisible(value)
  }
})
const hasTopPaneComponents = computed(() => {
  return !_.isEmpty(topPane.components)
})
const hasRightPaneComponents = computed(() => {
  return !_.isEmpty(rightPane.components)
})
const hasBottomPaneComponents = computed(() => {
  return !_.isEmpty(bottomPane.components)
})
const topPaneSize = computed(() => {
  if (topPane.state === 'responsive') return computeResponsiveWidth(topPane.sizePolicy.responsive)
  return topPane.sizePolicy.fixed
})
const topPaneStyle = computed(() => {
  return topPaneSize.value ? { width: topPaneSize.value + 'px' } : {}
})
const rightPaneSize = computed(() => {
  if (rightPane.state === 'responsive') return computeResponsiveSize(rightPane.sizePolicy.responsive)
  return rightPane.sizePolicy.fixed
})
const rightPaneStyle = computed(() => {
  return rightPaneSize.value ? { minWidth: rightPaneSize.value[0] + 'px', minHeight: rightPaneSize.value[1] + 'px' } : {}
})
const bottomPaneSize = computed(() => {
  if (bottomPane.state === 'responsive') return computeResponsiveWidth(bottomPane.sizePolicy.responsive)
  return bottomPane.sizePolicy.fixed
})
const bottomPaneStyle = computed(() => {
  return bottomPaneSize.value ? { width: bottomPaneSize.value + 'px' } : {}
})
const leftWindowSize = computed(() => {
  return leftWindow.size || leftWindow.sizePolicy.minSize
})
const leftWindowStyle = computed(() => {
  return { maxWidth: leftWindowSize[0] + 'px', maxHeight: leftWindowSize[1] + 'px' }
})
const topWindowSize = computed(() => {
  return topWindow.size || topWindow.sizePolicy.minSize
})
const topWindowStyle = computed(() => {
  return { maxWidth: topWindowSize[0] + 'px', maxHeight: topWindowSize[1] + 'px' }
})
const rightWindowSize = computed(() => {
  return rightWindow.size || rightWindow.sizePolicy.minSize
})
const rightWindowStyle = computed(() => {
  return { maxWidth: rightWindowSize[0] + 'px', maxHeight: rightWindowSize[1] + 'px' }
})
const bottomWindowSize = computed(() => {
  return bottomWindow.size || bottomWindow.sizePolicy.minSize
})
const bottomWindowStyle = computed(() => {
  return { maxWidth: bottomWindowSize[0] + 'px', maxHeight: bottomWindowSize[1] + 'px' }
})
const fabBehavior = computed(() => {
  switch (fab.position) {
    case 'bottom-right': return { direction: 'up', actionsAlign: 'left' }
    case 'bottom-left': return { direction: 'up', actionsAlign: 'right' }
    case 'top-right': return { direction: 'down', actionsAlign: 'left' }
    case 'top-left': return { direction: 'down', actionsAlign: 'right' }
  }
})

// Functions
function layoutOffsetListener (offset) {
  // Catch layout offset and returns default Quasar function. "offset" is a Number
  // (pixels) that refers to the total height of header + footer that occupies on screen.
  // see https://quasar.dev/layout/page#style-fn
  layoutOffset.value = offset
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' }
}
function onContentResized (size) {
  emit('content-resized', size)
}
function onTopPaneResized (size) {
  topPadding.value = size.height
}
function onRightPaneResized (size) {
  rightPadding.value = size.width
}
function onBottomPaneResized (size) {
  bottomPadding.value = size.height
}
function setTopPaneVisible (visible) {
  Layout.setPaneVisible('top', visible)
}
function setRightPaneVisible (visible) {
  Layout.setPaneVisible('right', visible)
}
function setBottomPaneVisible (visible) {
  Layout.setPaneVisible('bottom', visible)
}
</script>

<style lang="scss">
body {
  background-color: #EFEFEF;
}
.k-pane-sticky {
  z-index: $pane-sticky-z-index;
}
.k-pane {
  background-color: #FFFFFF;
  border: solid 1px lightgrey;
  border-radius: 3px;
  position: relative;
}
.k-pane:hover {
  border: solid 1px $primary;
}
.k-window-z-index {
  z-index: $window-sticky-z-index;
}
.k-fab-z-index {
  z-index: $fab-sticky-z-index;
}
</style>
