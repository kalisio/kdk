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
    <!-- bottom pane -->
    <q-page-sticky position="bottom" class="k-sticky">
      <div id="bottom-pane" v-show="hasBottomPaneComponents" class="column items-center">
        <KOpener id="bottom-opener" v-if="bottomPane.opener" v-model="isBottomPaneOpened" position="bottom" />
        <div>
          <KPanel
            id="bottom-panel"
            v-show="bottomPane.visible"
            :content="bottomPane.components"
            :mode="bottomPane.mode"
            class="k-pane"
          />
          <q-resize-observer v-if="padding" debounce="200" @resize="onBottomPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <!-- right pane -->
    <q-page-sticky position="right" class="k-sticky">
      <div id="right-pane" v-show="hasRightPaneComponents" class="row items-center">
        <KOpener id="right-opener" v-if="rightPane.opener" v-model="isRightPaneOpened" position="right" />
        <div>
          <KPanel
            id="right-panel"
            v-show="rightPane.visible"
            :content="rightPane.components"
            :mode="rightPane.mode"
            direction="vertical"
            class="k-pane"
          />
          <q-resize-observer v-if="padding" debounce="200" @resize="onRightPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <!-- top pane -->
    <q-page-sticky position="top" class="k-sticky">
      <div id="top-pane" v-show="hasTopPaneComponents" class="column items-center">
        <div>
          <KPanel
            id="top-panel"
            v-show="topPane.visible"
            :content="topPane.components"
            :mode="topPane.mode"
            class="k-pane"
          />
          <q-resize-observer v-if="padding" debounce="200" @resize="onTopPaneResized" />
        </div>
        <KOpener id="top-opener" v-if="topPane.opener" v-model="isTopPaneOpened" position="top" />
      </div>
    </q-page-sticky>
    <!-- fab -->
    <q-page-sticky :position="fab.position" :offset="fab.offset" class="k-sticky">
      <KFab
        id="fab"
        v-if="fab.visible"
        :direction="fabBehaviour.direction"
        :actions-align="fabBehaviour.actionsAlign"
      />
    </q-page-sticky>
    <!-- windows -->
    <q-page-sticky position="top-left" :offset="leftWindow.position" class="k-sticky">
      <KWindow
        id="left-window"
        v-if="leftWindow.visible"
        placement="left"
        :layout-offset="layoutOffset"
        :style="`max-width: ${leftWindowSize[0]}px; max-height: ${leftWindowSize[1]};px;`"
      />
    </q-page-sticky>
    <q-page-sticky position="top-left" :offset="topWindow.position" class="k-sticky">
      <KWindow
        id="top-window"
        v-if="topWindow.visible"
        placement="top"
        :layout-offset="layoutOffset"
        :style="`max-width: ${topWindowSize[0]}px; max-height: ${topWindowSize[1]};px`"
      />
    </q-page-sticky>
    <q-page-sticky position="top-left" :offset="rightWindow.position" class="k-sticky">
      <KWindow
        id="right-window"
        v-if="rightWindow.visible"
        placement="right"
        :layout-offset="layoutOffset"
        :style="`max-width: ${rightWindowSize[0]}px; max-height: ${rightWindowSize[1]};px`"
      />
    </q-page-sticky>
    <q-page-sticky position="top-left" :offset="bottomWindow.position" class="k-sticky">
      <KWindow
        id="bottom-window"
        v-if="bottomWindow.visible"
        placement="bottom"
        :layout-offset="layoutOffset"
        :style="`max-width: ${bottomWindowSize[0]}px; max-height: ${bottomWindowSize[1]};px`"
      />
    </q-page-sticky>
    <!-- left pane -->
    <q-page-sticky position="left" class="k-sticky">
      <div id="left-pane" v-show="hasLeftPaneComponents" class="row items-center">
        <div>
          <KPanel
            id="left-panel"
            v-show="leftPane.visible"
            :content="leftPane.components"
            :mode="leftPane.mode"
            direction="vertical"
            class="k-left-pane"
            @triggered="setLeftPaneVisible(false)"
          />
        </div>
        <KOpener id="left-opener" v-if="leftPane.opener" v-model="isLeftPaneOpened" position="left" />
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch } from 'vue'
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
const leftPane = Layout.getPane('left')
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
    widht: `calc(100vw - ${widthOffset}px)`,
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
const isLeftPaneOpened = computed({
  get: function () {
    return leftPane.visible
  },
  set: function (value) {
    setLeftPaneVisible(value)
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
const hasLeftPaneComponents = computed(() => {
  return !_.isEmpty(leftPane.components)
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
const leftWindowSize = computed(() => {
  return leftWindow.size || leftWindow.sizePolicy.minSize
})
const topWindowSize = computed(() => {
  return topWindow.size || topWindow.sizePolicy.minSize
})
const rightWindowSize = computed(() => {
  return rightWindow.size || rightWindow.sizePolicy.minSize
})
const bottomWindowSize = computed(() => {
  return bottomWindow.size || bottomWindow.sizePolicy.minSize
})
const fabBehaviour = computed(() => {
  switch (fab.position) {
    case 'bottom-right': return { direction: 'up', actionsAlign: 'left' }
    case 'bottom-left': return { direction: 'up', actionsAlign: 'right' }
    case 'top-right': return { direction: 'down', actionsAlign: 'left' }
    case 'top-left': return { direction: 'down', actionsAlign: 'right' }
  }
})

// Watch
watch(() => leftPane.visible, (visible) => {
  if (visible) {
    setTimeout(() => {
      document.addEventListener('click', clickOutsideLeftPanelListener, true)
    }, 500)
  } else {
    document.removeEventListener('click', clickOutsideLeftPanelListener, true)
  }
}, { immediate: true })

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
function setLeftPaneVisible (visible) {
  Layout.setPaneVisible('left', visible)
}
function setRightPaneVisible (visible) {
  Layout.setPaneVisible('right', visible)
}
function setBottomPaneVisible (visible) {
  Layout.setPaneVisible('bottom', visible)
}
function clickOutsideLeftPanelListener (event) {
  const leftPanelElement = document.getElementById('left-panel')
  if (leftPanelElement && leftPanelElement.contains(event.target)) return
  const leftOpenerElement = document.getElementById('left-opener')
  if (leftOpenerElement && leftOpenerElement.contains(event.target)) return
  setLeftPaneVisible(false)
}
</script>

<style lang="scss">
body {
  background-color: #EFEFEF;
}
.k-sticky {
  z-index: $sticky-z-index;
}
.k-pane, .k-left-pane {
  background-color: #FFFFFF;
  border: solid 1px lightgrey;
  border-radius: 3px;
  position: relative;
}
.k-pane:hover, .k-left-pane:hover {
  border: solid 1px $primary;
}
.k-left-pane {
  height: 100vh;
  width: $left-pane-width;
}
</style>
