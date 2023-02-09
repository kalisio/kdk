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
    <!-- bottom -->
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
    <!-- right -->
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
    <!-- top -->
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
    <q-page-sticky position="bottom-right" :offset="fabOffset" class="k-sticky">
      <KFab
        id="fab"
        v-if="fab.visible"
      />
    </q-page-sticky>
    <!-- windows -->
    <q-page-sticky position="top-left" :offset="leftWindow.position" class="k-sticky">
      <KWindow
        id="left-window"
        v-if="leftWindow.visible"
        placement="left"
        :style="`max-width: ${leftWindow.size[0]}px; max-height: ${leftWindow.size[1]};px;`"
      />
    </q-page-sticky>
    <q-page-sticky position="top-left" :offset="rightWindow.position" class="k-sticky">
      <KWindow
        id="right-window"
        v-if="rightWindow.visible"
        placement="right"
        :style="`max-width: ${rightWindow.size[0]}px; max-height: ${rightWindow.size[1]};px`"
      />
    </q-page-sticky>
    <q-page-sticky position="top-left" :offset="topWindow.position" class="k-sticky">
      <KWindow
        id="top-window"
        v-if="topWindow.visible"
        placement="top"
        :style="`max-width: ${topWindow.size[0]}px; max-height: ${topWindow.size[1]};px`"
      />
    </q-page-sticky>
    <q-page-sticky position="top-left" :offset="bottomWindow.position" class="k-sticky">
      <KWindow
        id="bottom-window"
        v-if="bottomWindow.visible"
        placement="bottom"
        :style="`max-width: ${bottomWindow.size[0]}px; max-height: ${bottomWindow.size[1]};px`"
      />
    </q-page-sticky>
    <!-- left -->
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

<script>
import _ from 'lodash'
import { Layout } from '../../layout.js'
import KContent from '../KContent.vue'
import KPanel from '../KPanel.vue'
import KOpener from './KOpener.vue'
import KWindow from './KWindow.vue'
import KFab from './KFab.vue'

export default {
  components: {
    KContent,
    KPanel,
    KOpener,
    KWindow,
    KFab
  },
  props: {
    padding: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    contentStyleFunction () {
      const layoutPadding = this.padding ? 24 * 2 : 0
      const widthOffset = layoutPadding
      const heightOffset = this.layoutOffset + layoutPadding
      return {
        paddingTop: `${this.topPadding}px`,
        paddingBottom: `${this.bottomPadding}px`,
        paddingRight: `${this.rightPadding}px`,
        widht: `calc(100vw - ${widthOffset}px)`,
        height: `calc(100vh - ${heightOffset}px)`
      }
    },
    isTopPaneOpened: {
      get: function () {
        return this.topPane.visible
      },
      set: function (value) {
        this.setTopPaneVisible(value)
      }
    },
    isLeftPaneOpened: {
      get: function () {
        return this.leftPane.visible
      },
      set: function (value) {
        this.setLeftPaneVisible(value)
      }
    },
    isRightPaneOpened: {
      get: function () {
        return this.rightPane.visible
      },
      set: function (value) {
        this.setRightPaneVisible(value)
      }
    },
    isBottomPaneOpened: {
      get: function () {
        return this.bottomPane.visible
      },
      set: function (value) {
        this.setBottomPaneVisible(value)
      }
    },
    hasLeftPaneComponents () {
      return !_.isEmpty(this.leftPane.components)
    },
    hasTopPaneComponents () {
      return !_.isEmpty(this.topPane.components)
    },
    hasRightPaneComponents () {
      return !_.isEmpty(this.rightPane.components)
    },
    hasBottomPaneComponents () {
      return !_.isEmpty(this.bottomPane.components)
    }
  },
  data () {
    return {
      page: Layout.getPage(),
      leftPane: Layout.getPane('left'),
      topPane: Layout.getPane('top'),
      rightPane: Layout.getPane('right'),
      bottomPane: Layout.getPane('bottom'),
      leftWindow: Layout.getWindow('left'),
      topWindow: Layout.getWindow('top'),
      rightWindow: Layout.getWindow('right'),
      bottomWindow: Layout.getWindow('bottom'),
      fab: Layout.getFab(),
      layoutOffset: 0,
      topPadding: 0,
      leftPadding: 0,
      bottomPadding: 0,
      rightPadding: 0,
      fabOffset: [16, 16]
    }
  },
  watch: {
    'leftPane.visible': {
      immediate: true,
      handler (visible) {
        if (visible) {
          setTimeout(() => {
            document.addEventListener('click', this.clickOutsideLeftPanelListener, true)
          }, 500)
        } else {
          document.removeEventListener('click', this.clickOutsideLeftPanelListener, true)
        }
      }
    }
  },
  methods: {
    layoutOffsetListener (offset) {
      // Catch layout offset and returns default Quasar function
      // see https://quasar.dev/layout/page#style-fn
      this.layoutOffset = offset
      return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' }
    },
    onContentResized (size) {
      this.$emit('content-resized', size)
    },
    onTopPaneResized (size) {
      this.topPadding = size.height
    },
    onRightPaneResized (size) {
      this.rightPaddding = size.width
    },
    onBottomPaneResized (size) {
      this.bottomPadding = size.height
    },
    setTopPaneVisible (visible) {
      Layout.setPaneVisible('top', visible)
    },
    setLeftPaneVisible (visible) {
      Layout.setPaneVisible('left', visible)
    },
    setRightPaneVisible (visible) {
      Layout.setPaneVisible('right', visible)
    },
    setBottomPaneVisible (visible) {
      Layout.setPaneVisible('bottom', visible)
    },
    clickOutsideLeftPanelListener (event) {
      const leftPanelElement = document.getElementById('left-panel')
      if (leftPanelElement) {
        if (!leftPanelElement.contains(event.target)) {
          const leftOpenerElement = document.getElementById('left-opener')
          if (leftOpenerElement && leftOpenerElement.contains(event.target)) return
          event.stopPropagation()
          this.setLeftPaneVisible(false)
        }
      }
    }
  }
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
}
.k-pane:hover, .k-left-pane:hover {
  border: solid 1px $primary;
}
.k-left-pane {
  height: 100vh;
  width: $left-pane-width;
}
</style>
