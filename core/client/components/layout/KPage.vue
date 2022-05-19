<template>
  <q-page :padding="padding" :style-fn="layoutOffsetListener">
    <!--
      Specific page content: can be provided as slot and/or by configuration
     -->
    <div id="page-content-container" :style="contentStyleFunction">
      <div class="fit">
        <q-resize-observer @resize="onContentResized" />
        <slot id="page-content" name="page-content" />
        <KContent
          id="page"
          v-show="page.content && page.mode"
          :content="page.content"
          :mode="page.mode"
          :filter="page.filter" 
        />
      </div>
    </div>
    <!--
      Managed stickies
      Be careful of the order
     -->
    <!-- bottom -->
    <q-page-sticky position="bottom" :style="{ 'z-index': stickyZIndex }">
      <div id="bottom-pane" v-show="hasBottomPaneContent" class="column items-center">
        <KOpener id="bottom-opener" v-if="hasBottomPaneOpener" v-model="isBottomPaneOpened" position="bottom" />
        <div>
          <KPanel
            id="bottom-panel"
            v-show="bottomPane.visible"
            :content="bottomPane.content"
            :mode="bottomPane.mode"
            :filter="bottomPane.filter"
            class="k-pane"
          />
          <q-resize-observer v-if="padding" debounce="200" @resize="onBottomPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <!-- right -->
    <q-page-sticky position="right" :style="{ 'z-index': stickyZIndex }">
      <div id="right-pane" v-show="hasRightPaneContent" class="row items-center">
        <KOpener id="right-opener" v-if="hasRightPaneOpener" v-model="isRightPaneOpened" position="right" />
        <div>
          <KPanel
            id="right-panel"
            v-show="rightPane.visible"
            :content="rightPane.content"
            :mode="rightPane.mode"
            :filter="rightPane.filter"
            direction="vertical"
            class="k-pane"
          />
          <q-resize-observer v-if="padding" debounce="200" @resize="onRightPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <!-- top -->
    <q-page-sticky position="top" :style="{ 'z-index': stickyZIndex }">
      <div id="top-pane" v-show="hasTopPaneContent" class="column items-center">
        <div>
          <KPanel
            id="top-panel"
            v-show="topPane.visible"
            :content="topPane.content"
            :mode="topPane.mode"
            :filter="topPane.filter"
            class="k-pane"
          />
          <q-resize-observer v-if="padding" debounce="200" @resize="onTopPaneResized" />
        </div>
        <KOpener id="top-opener" v-if="hasTopPaneOpener" v-model="isTopPaneOpened" position="top" />
      </div>
    </q-page-sticky>
    <!-- fab -->
    <q-page-sticky position="bottom-right" :offset="fabOffset" :style="{ 'z-index': stickyZIndex }">
      <KFab />
    </q-page-sticky>
    <!-- window -->
    <q-page-sticky position="top-left" :offset="window.position" :style="{ 'z-index': stickyZIndex }">
      <KWindow id="window" />
    </q-page-sticky>
    <!-- left -->
    <q-page-sticky position="left" :style="{ 'z-index': stickyZIndex }">
      <div id="left-pane" v-show="hasLeftPaneContent" class="row items-center">
        <div>
          <KPanel
            id="left-panel"
            v-show="leftPane.visible"
            :content="leftPane.content"
            :mode="leftPane.mode"
            :filter="leftPane.filter"
            direction="vertical"
            class="k-left-pane"
            @triggered="setLeftPaneVisible(false)"
          />
          <q-resize-observer v-if="padding" debounce="200" @resize="onLeftPaneResized" />
        </div>
        <KOpener id="left-opener" v-if="hasLeftPaneOpener" v-model="isLeftPaneOpened" position="left" />
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script>
import _ from 'lodash'
import { KContent, KPanel, KOpener } from '../frame'
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
    stickyZIndex () {
      if (this.page.sticky) return this.page.sticky.zIndex
      return 'auto'
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
    hasLeftPaneContent () {
      if (_.isEmpty(this.leftPane.content)) return false
      if (this.leftPane.mode) return !_.isEmpty(_.get(this.leftPane.content, this.leftPane.mode))
      return true
    },
    hasTopPaneContent () {
      if (_.isEmpty(this.topPane.content)) return false
      if (this.topPane.mode) return !_.isEmpty(_.get(this.topPane.content, this.topPane.mode))
      return true
    },
    hasRightPaneContent () {
      if (_.isEmpty(this.rightPane.content)) return false
      if (this.rightPane.mode) return !_.isEmpty(_.get(this.rightPane.content, this.rightPane.mode))
      return true
    },
    hasBottomPaneContent () {
      if (_.isEmpty(this.bottomPane.content)) return false
      if (this.bottomPane.mode) return !_.isEmpty(_.get(this.bottomPane.content, this.bottomPane.mode))
      return true
    }
  },
  data () {
    return {
      leftPane: this.$store.get('leftPane'),
      topPane: this.$store.get('topPane'),
      rightPane: this.$store.get('rightPane'),
      bottomPane: this.$store.get('bottomPane'),
      page: this.$store.get('page'),
      window: this.$store.get('window'),
      hasLeftPaneOpener: false,
      hasTopPaneOpener: false,
      hasRightPaneOpener: false,
      hasBottomPaneOpener: false,
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
    onLeftPaneResized (size) {
      this.leftPadding = size.width
    },
    onRightPaneResized (size) {
      this.rightPaddding = size.width
    },
    onBottomPaneResized (size) {
      this.bottomPadding = size.height
    },
    setTopPaneVisible (visible) {
      this.$store.patch('topPane', { visible })
    },
    setLeftPaneVisible (visible) {
      this.$store.patch('leftPane', { visible })
    },
    setRightPaneVisible (visible) {
      this.$store.patch('rightPane', { visible })
    },
    setBottomPaneVisible (visible) {
      this.$store.patch('bottomPane', { visible })
    },
    clickOutsideLeftPanelListener (event) {
      const leftPanelElement = document.getElementById('left-panel')
      if (leftPanelElement) {
        if (!leftPanelElement.contains(event.target)) {
          const leftOpenerElement = document.getElementById('left-opener')
          if (leftOpenerElement && leftOpenerElement.contains(event.target)) return
          this.setLeftPaneVisible(false)
        }
      }
    }
  },
  created () {
    // Read top pane configuration
    this.hasTopPaneOpener = this.$config('layout.topPane.opener', false)
    if (this.$config('layout.topPane.visible', false)) this.$store.patch('topPane', { visible: true })
    // Read left pane configuration
    this.hasLeftPaneOpener = this.$config('layout.leftPane.opener', false)
    if (this.$config('layout.leftPane.visible', false)) this.$store.patch('leftPane', { visible: true })
    // Read bottom pane configuration
    this.hasRightPaneOpener = this.$config('layout.rightPane.opener', false)
    if (this.$config('layout.rightPane.visible', false)) this.$store.patch('rightPane', { visible: true })
    // Read bottom pane configuration
    this.hasBottomPaneOpener = this.$config('layout.bottomPane.opener', false)
    if (this.$config('layout.bottomPane.visible', false)) this.$store.patch('bottomPane', { visible: true })
      // Read sticky configuration
    // Set extra padding value
    this.gutter = 8
  }
}
</script>

<style lang="scss">
  body {
    background-color: #EFEFEF;
  }
  .k-pane, .k-left-pane {
    background-color: #FFFFFF;
    border: solid 1px lightgrey;
    border-radius: 3px;
  }
  .k-pane:hover, .k-left-pane:hover {
    border: solid 1px var(--q-color-primary);
  }
  .k-left-pane {
    height: 100vh;
    width: 300px;
  }
</style>
