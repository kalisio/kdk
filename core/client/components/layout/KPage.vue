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
     -->
    <!-- left -->
    <q-page-sticky position="left">
      <div id="left-pane" v-show="leftPane.content && leftPane.mode" class="row items-center">
        <div>
          <k-panel
            id="left-panel"
            v-show="isLeftPaneOpened"
            :content="leftPane.content"
            :mode="leftPane.mode"
            :filter="leftPane.filter"
            direction="vertical"
            class="k-left-panel"
            @triggered="setLeftPaneVisible(false)" />"
          <q-resize-observer v-if="padding" debounce="200" @resize="onLeftPaneResized" />
        </div>
        <k-opener v-if="hasLeftPaneOpener" v-model="isLeftPaneOpened" position="left" />
      </div>
    </q-page-sticky>
    <!-- top -->
    <q-page-sticky position="top">
      <div id="top-pane" v-show="topPane.content && topPane.mode" class="column items-center">
        <div>
          <k-panel
            id="top-panel"
            v-show="isTopPaneOpened"
            :content="topPane.content"
            :mode="topPane.mode"
            :filter="topPane.filter"
            class="k-panel" />
          <q-resize-observer v-if="padding" debounce="200" @resize="onTopPaneResized" />
        </div>
        <k-opener v-if="hasTopPaneOpener" v-model="isTopPaneOpened" position="top" />
      </div>
    </q-page-sticky>
    <!-- window -->
    <q-page-sticky position="top" :offset="widgetOffset">
      <k-window id="window" ref="window" />
    </q-page-sticky>
    <!-- right -->
    <q-page-sticky position="right">
      <div id="right-pane" v-show="rightPane.content && rightPane.mode" class="row items-center">
        <k-opener v-if="hasRightPaneOpener" v-model="isRightPaneOpened" position="right" />
        <div>
          <k-panel
            id="right-panel"
            v-show="isRightPaneOpened"
            :content="rightPane.content"
            :mode="rightPane.mode"
            :filter="rightPane.filter"
            direction="vertical"
            class="k-panel" />
          <q-resize-observer v-if="padding" debounce="200" @resize="onRightPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <!-- bottom -->
    <q-page-sticky position="bottom">
      <div id="bottom-pane" v-show="bottomPane.content && bottomPane.mode" class="column items-center">
        <k-opener v-if="hasBottomPaneOpener" v-model="isBottomPaneOpened" position="bottom" />
        <div>
          <k-panel
            id="bottom-panel"
            v-show="isBottomPaneOpened"
            :content="bottomPane.content"
            :mode="bottomPane.mode"
            :filter="bottomPane.filter"
            class="k-panel" />
          <q-resize-observer v-if="padding" debounce="200" @resize="onBottomPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <!-- fab -->
    <q-page-sticky position="bottom-right" :offset="fabOffset">
      <k-fab />
    </q-page-sticky>
  </q-page>
</template>

<script>
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
        if (visible) setTimeout(() => document.addEventListener('click', this.clickOutsideLeftPanelListener), 500)
        else document.removeEventListener('click', this.clickOutsideLeftPanelListener)
      }
    }
  },
  methods: {
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
      let leftPanelElement = document.getElementById('left-panel')
      if (!leftPanelElement.contains(event.target)) this.setLeftPaneVisible(false)
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
  }
}
</script>

<style lang="stylus">
.k-panel, .k-left-panel {
  border: solid 1px lightgrey;
  border-radius: 5px;
  background: #ffffff
}

.k-panel:hover, .k-left-panel {
  border: solid 1px $primary;
}

.k-left-panel {
  height: 100vh;
  width: 300px;
}
</style>
