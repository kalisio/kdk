<template>
  <q-page :padding="padding">
    <!--
      Specific page content: can be provided as slot and/or by configuration
     -->
    <div :style="contentStyle">
      <slot id="page-content" name="page-content"></slot>
      <k-content
        id="page"
        v-show="page.content && page.mode"
        :content="page.content"
        :mode="page.mode"
        :filter="page.filter" />
    </div>
    <!--
      Managed stickies
      Be careful of the order
     -->
    <!-- bottom -->
    <q-page-sticky position="bottom">
      <div id="bottom-pane" v-show="hasBottomPaneContent" class="column items-center">
        <k-opener id="bottom-opener" v-if="hasBottomPaneOpener" v-model="isBottomPaneOpened" position="bottom" />
        <div>
          <k-panel
            id="bottom-panel"
            v-show="bottomPane.visible"
            :content="bottomPane.content"
            :mode="bottomPane.mode"
            :filter="bottomPane.filter"
            class="k-pane" />
          <q-resize-observer v-if="padding" debounce="200" @resize="onBottomPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <!-- right -->
    <q-page-sticky position="right">
      <div id="right-pane" v-show="hasRightPaneContent" class="row items-center">
        <k-opener id="right-opener" v-if="hasRightPaneOpener" v-model="isRightPaneOpened" position="right" />
        <div>
          <k-panel
            id="right-panel"
            v-show="rightPane.visible"
            :content="rightPane.content"
            :mode="rightPane.mode"
            :filter="rightPane.filter"
            direction="vertical"
            class="k-pane" />
          <q-resize-observer v-if="padding" debounce="200" @resize="onRightPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <!-- top -->
    <q-page-sticky position="top">
      <div id="top-pane" v-show="hasTopPaneContent" class="column items-center">
        <div>
          <k-panel
            id="top-panel"
            v-show="topPane.visible"
            :content="topPane.content"
            :mode="topPane.mode"
            :filter="topPane.filter"
            class="k-pane" />
          <q-resize-observer v-if="padding" debounce="200" @resize="onTopPaneResized" />
        </div>
        <k-opener id="top-opener" v-if="hasTopPaneOpener" v-model="isTopPaneOpened" position="top" />
      </div>
    </q-page-sticky>
    <!-- fab -->
    <q-page-sticky position="bottom-right" :offset="fabOffset">
      <k-fab />
    </q-page-sticky>
    <!-- window -->
    <q-page-sticky position="top" :offset="widgetOffset">
      <k-window id="window" ref="window" />
    </q-page-sticky>
    <!-- left -->
    <q-page-sticky position="left">
      <div id="left-pane" v-show="hasLeftPaneContent" class="row items-center">
        <div>
          <k-panel
            id="left-panel"
            v-show="leftPane.visible"
            :content="leftPane.content"
            :mode="leftPane.mode"
            :filter="leftPane.filter"
            direction="vertical"
            class="k-left-pane"
            @triggered="setLeftPaneVisible(false)" />
          <q-resize-observer v-if="padding" debounce="200" @resize="onLeftPaneResized" />
        </div>
        <k-opener id="left-opener" v-if="hasLeftPaneOpener" v-model="isLeftPaneOpened" position="left" />
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-page',
  props: {
    padding: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    contentStyle () {
      return `padding-top: ${this.topPadding}px; padding-bottom: ${this.bottomPadding}px`
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
      hasLeftPaneOpener: false,
      hasTopPaneOpener: false,
      hasRightPaneOpener: false,
      hasBottomPaneOpener: false,
      topPadding: 0,
      leftPadding: 0,
      bottomPadding: 0,
      rightPadding: 0,
      widgetOffset: [0, 0],
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
    onTopPaneResized (size) {
      this.topPadding = size.height + this.gutter
    },
    onLeftPaneResized (size) {
      this.leftPadding = size.width + this.gutter
    },
    onRightPaneResized (size) {
      this.rightPaddding = size.width + this.gutter
    },
    onBottomPaneResized (size) {
      this.bottomPadding = size.height + this.gutter
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
    // load the required components
    this.$options.components['k-content'] = this.$load('frame/KContent')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-opener'] = this.$load('frame/KOpener')
    this.$options.components['k-window'] = this.$load('layout/KWindow')
    this.$options.components['k-fab'] = this.$load('layout/KFab')
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
    // Set extra padding value
    this.gutter = 8
  }
}
</script>

<style lang="stylus">
.k-pane, .k-left-pane {
  border: solid 1px lightgrey;
  border-radius: 5px;
}

.k-pane:hover, .k-left-pane:hover {
  border: solid 1px var(--q-color-primary);
}

.k-left-pane {
  height: 100vh;
  width: 300px;
}
</style>
