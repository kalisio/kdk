<template>
  <q-page :padding="Layout.getPadding()" :style-fn="layoutOffsetListener">
    <!--
      Specific page content: can be provided as slot or/and by configuration
     -->
    <div id="page-content-container" :style="contentStyleFunction">
      <q-resize-observer @resize="onContentResized" />
      <slot>
        <KContent
          id="page"
          v-show="page.visible"
          :content="page.components"
          class="fit"
       />
      </slot>
    </div>
    <!--
      Custom stickies
     -->
    <template v-for="sticky in stickiesComponents" :key="sticky.id">
      <q-page-sticky
        :ref="onStickyCreated"
        :id="sticky.id"
        :pointer-events="sticky.pointerEvents"
        :position="getStickyPosition(sticky)"
        :offset="getStickyOffset(sticky)"
        class="k-sticky"
      >
        <KContent v-bind="sticky" />
      </q-page-sticky>
    </template>
    <!--
      Managed stickies
      Be careful of the order
     -->
    <!-- Bottom pane -->
    <q-page-sticky
      v-show="hasBottomPaneComponents"
      position="bottom"
      class="k-bottom-pane-sticky"
      @click="onClicked('panes.bottom')"
    >
      <div id="bottom-pane" class="column items-center">
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
          <q-resize-observer v-if="Layout.getPadding()" debounce="200" @resize="onBottomPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <!-- Right pane -->
    <q-page-sticky
      v-show="hasRightPaneComponents"
      position="right"
      class="k-right-pane-sticky"
      @click="onClicked('panes.right')"
    >
      <div id="right-pane" class="row items-center">
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
          <q-resize-observer v-if="Layout.getPadding()" debounce="200" @resize="onRightPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <!-- Top pane -->
    <q-page-sticky
      v-show="hasTopPaneComponents"
      position="top"
      class="k-top-pane-sticky"
      @click="onClicked('panes.top')"
    >
      <div id="top-pane" class="column items-center">
        <div>
          <KPanel
            id="top-panel"
            v-show="topPane.visible"
            :content="topPane.components"
            :mode="topPane.mode"
            :style="topPaneStyle"
            class="k-pane"
          />
          <q-resize-observer v-if="Layout.getPadding()" debounce="200" @resize="onTopPaneResized" />
        </div>
        <KOpener id="top-opener" v-if="topPane.opener" v-model="isTopPaneOpened" position="top" />
      </div>
    </q-page-sticky>
    <!-- Fab -->
    <q-page-sticky
      :position="fab.position"
      :offset="fab.offset"
      class="k-fab-sticky"
      @click="onClicked('fab')"
    >
      <KFab
        id="fab"
        v-if="fab.visible"
        :direction="fabBehavior.direction"
        :actions-align="fabBehavior.actionsAlign"
      />
    </q-page-sticky>
    <!-- left Window -->
    <q-page-sticky
      v-if="hasLeftWindowComponents && leftWindow.visible"
      position="top-left"
      :offset="leftWindow.position"
      class="k-left-window-sticky"
      @click="onClicked('windows.left')"
    >
      <KWindow
        id="left-window"
        placement="left"
        :layout-offset="layoutOffset"
        :style="leftWindowStyle"
      />
    </q-page-sticky>
    <!-- top Window -->
    <q-page-sticky
      v-if="hasTopWindowComponents && topWindow.visible"
      position="top-left"
      :offset="topWindow.position"
      class="k-top-window-sticky"
      @click="onClicked('windows.top')"
    >
      <KWindow
        id="top-window"
        placement="top"
        :layout-offset="layoutOffset"
        :style="topWindowStyle"
      />
    </q-page-sticky>
    <!-- right Window -->
    <q-page-sticky
      v-if="hasRightWindowComponents && rightWindow.visible"
      position="top-left"
      :offset="rightWindow.position"
      class="k-right-window-sticky"
      @click="onClicked('windows.right')"
    >
      <KWindow
        id="right-window"
        placement="right"
        :layout-offset="layoutOffset"
        :style="rightWindowStyle"
      />
    </q-page-sticky>
    <!-- bottom Window -->
    <q-page-sticky
      v-if="hasBottomWindowComponents && bottomWindow.visible"
      position="top-left"
      :offset="bottomWindow.position"
      class="k-bottom-window-sticky"
      @click="onClicked('windows.bottom')"
    >
      <KWindow
        id="bottom-window"
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
import { useQuasar } from 'quasar'
import { computeResponsiveWidth, computeResponsiveSize } from '../../utils'
import { useLayout } from '../../composables'
import KContent from '../KContent.vue'
import KPanel from '../KPanel.vue'
import KOpener from './KOpener.vue'
import KWindow from './KWindow.vue'
import KFab from './KFab.vue'

// Data
const $q = useQuasar()
const { Layout } = useLayout()
const page = Layout.getPage()
const stickies = Layout.getStickies()
const fab = Layout.getFab()
const topPane = Layout.getPane('top')
const rightPane = Layout.getPane('right')
const bottomPane = Layout.getPane('bottom')
const leftWindow = Layout.getWindow('left')
const topWindow = Layout.getWindow('top')
const rightWindow = Layout.getWindow('right')
const bottomWindow = Layout.getWindow('bottom')
const layoutOffset = ref(0)

// Computed
const contentStyleFunction = computed(() => {
  const hasPadding = Layout.getPadding()
  const layoutPadding = hasPadding ? $q.screen.xs ? 16 : $q.screen.lt.lg ? 32 : 48 : 0
  const widthOffset = layoutPadding
  const heightOffset = layoutOffset.value + layoutPadding
  return {
    paddingTop: hasPadding ? `${topPane.size[1]}px` : 0,
    paddingBottom: hasPadding ? `${bottomPane.size[1]}px` : 0,
    width: `calc(100vw - ${widthOffset}px)`,
    height: `calc(100vh - ${heightOffset}px)`,
    maxWidth: `calc(100vw - ${widthOffset}px)`,
    maxHeight: `calc(100vh - ${heightOffset}px)`
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
  if (topPane.sizes) return computeResponsiveWidth(topPane.sizes)
  return undefined
})
const topPaneStyle = computed(() => {
  return topPaneSize.value ? { width: topPaneSize.value + 'px' } : {}
})
const rightPaneSize = computed(() => {
  if (rightPane.sizes) return computeResponsiveSize(rightPane.sizes)
  return undefined
})
const rightPaneStyle = computed(() => {
  return rightPaneSize.value ? { width: rightPaneSize.value[0] + 'px', height: rightPaneSize.value[1] + 'px' } : {}
})
const bottomPaneSize = computed(() => {
  if (bottomPane.sizes) return computeResponsiveWidth(bottomPane.sizes)
  return undefined
})
const bottomPaneStyle = computed(() => {
  return bottomPaneSize.value ? { width: bottomPaneSize.value + 'px' } : {}
})
const hasLeftWindowComponents = computed(() => {
  return !_.isEmpty(leftWindow.components)
})
const leftWindowSize = computed(() => {
  return leftWindow.size || leftWindow.sizePolicy.minSize
})
const leftWindowStyle = computed(() => {
  return { maxWidth: leftWindowSize[0] + 'px', maxHeight: leftWindowSize[1] + 'px' }
})
const hasTopWindowComponents = computed(() => {
  return !_.isEmpty(topWindow.components)
})
const topWindowSize = computed(() => {
  return topWindow.size || topWindow.sizePolicy.minSize
})
const topWindowStyle = computed(() => {
  return { maxWidth: topWindowSize[0] + 'px', maxHeight: topWindowSize[1] + 'px' }
})
const hasRightWindowComponents = computed(() => {
  return !_.isEmpty(rightWindow.components)
})
const rightWindowSize = computed(() => {
  return rightWindow.size || rightWindow.sizePolicy.minSize
})
const rightWindowStyle = computed(() => {
  return { maxWidth: rightWindowSize[0] + 'px', maxHeight: rightWindowSize[1] + 'px' }
})
const hasBottomWindowComponents = computed(() => {
  return !_.isEmpty(bottomWindow.components)
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
const stickiesComponents = computed(() => {
  return _.map(stickies.components, sticky => {
    const component = _.mapKeys(sticky, (value, key) => {
      return _.replace(key, 'component.', '')
    })
    return _.merge(sticky, {
      content: [component]
    })
  })
})

// Functions
function layoutOffsetListener (offset) {
  // Catch layout offset and returns default Quasar function. "offset" is a Number
  // (pixels) that refers to the total height of header + footer that occupies on screen.
  // see https://quasar.dev/layout/page#style-fn
  layoutOffset.value = offset
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' }
}
function getStickyPosition (sticky) {
  if (sticky.position === 'center') return 'top'
  return sticky.position
}
function getStickyOffset (sticky) {
  if (sticky.position === 'center') {
    const heightOffset = page.size[1] / 2
    if (sticky.offset) return [sticky.offset[0], sticky.offset[1] + heightOffset]
    return [0, heightOffset]
  }
  return sticky.offset
}
function onStickyCreated (reference) {
  if (reference) {
    const pointerEvents = _.get(reference, '$attrs.pointer-events')
    if (pointerEvents) {
      const div = reference.$el.querySelector('div')
      div.style.pointerEvents = pointerEvents
    }
  }
}
function onContentResized (size) {
  Layout.setElementSize('page', [size.width, size.height])
}
function onTopPaneResized (size) {
  Layout.setElementSize('panes.top', [size.width, size.height])
}
function onRightPaneResized (size) {
  Layout.setElementSize('panes.right', [size.width, size.height])
}
function onBottomPaneResized (size) {
  Layout.setElementSize('panes.bottom', [size.width, size.height])
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
function onClicked (element) {
  Layout.setFocus(element)
}
</script>

<style lang="scss">
body {
  background-color: #EFEFEF;
}
.k-top-pane-sticky {
  z-index: v-bind('topPane.zIndex');
}
.k-right-pane-sticky {
  z-index: v-bind('rightPane.zIndex');
}
.k-bottom-pane-sticky {
  z-index: v-bind('bottomPane.zIndex');
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
.k-left-window-sticky {
  z-index: v-bind('leftWindow.zIndex');
}
.k-top-window-sticky {
  z-index: v-bind('topWindow.zIndex');
}
.k-right-window-sticky {
  z-index: v-bind('rightWindow.zIndex');
}
.k-bottom-window-sticky {
  z-index: v-bind('bottomWindow.zIndex');
}
.k-fab-sticky {
  z-index: v-bind('fab.zIndex');
}
.k-sticky {
  z-index: v-bind('stickies.zIndex');
}
</style>
