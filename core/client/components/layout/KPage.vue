<template>
  <q-page id="page" :padding="padding">
    <!--
      Specific page content
     -->
    <div :style="contentStyle">
      <slot id="page-content" name="page-content"></slot>
    </div>
    <!--
      Managed stickies
     -->
    <q-page-sticky position="top">
      <div id="top-pane" v-show="topPane.content" class="column items-center">
        <div>
          <k-panel id="top-panel" v-show="isTopPaneOpened" :content="topPane.content" :mode="topPane.mode" class="k-pane" />
          <q-resize-observer v-if="padding" debounce="200" @resize="onTopPaneResized" />
        </div>
        <k-opener v-if="hasTopPaneOpener" v-model="isTopPaneOpened" position="top" />
      </div>
    </q-page-sticky>
    <q-page-sticky position="top" :offset="widgetOffset">
      <k-window id="window" ref="window" />
    </q-page-sticky>
    <q-page-sticky v-if="hasLeftDrawerOpener && leftDrawer.content" position="left">
      <k-opener v-model="isLeftDrawerOpened" position="left"  />
    </q-page-sticky>
    <!--q-page-sticky v-if="hasRightDrawerOpener && rightDrawer.content" position="right">
      <k-opener v-model="isRightDrawerOpened" position="right" />
    </q-page-sticky-->
    <q-page-sticky position="right">
      <div id="right-pane" v-show="rightPane.content" class="row items-center">
        <k-opener v-if="hasRightPaneOpener" v-model="isRightPaneOpened" position="right" />
        <div>
          <k-panel id="bottom-panel" v-show="isRightPaneOpened" :content="rightPane.content" :mode="rightPane.mode" class="k-pane" />
          <q-resize-observer v-if="padding" debounce="200" @resize="onRightPaneResized" />
        </div>
      </div>
    </q-page-sticky>
    <q-page-sticky position="bottom">
      <div id="bottom-pane" v-show="bottomPane.content" class="column items-center">
        <k-opener v-if="hasBottomPaneOpener" v-model="isBottomPaneOpened" position="bottom" />
        <div>
          <k-panel id="bottom-panel" v-show="isBottomPaneOpened" :content="bottomPane.content" :mode="bottomPane.mode" class="k-pane" />
          <q-resize-observer v-if="padding" debounce="200" @resize="onBottomPaneResized" />
        </div>
      </div>
    </q-page-sticky>
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
        this.$store.patch('topPane', { visible: value })
      }
    },
    isLeftDrawerOpened: {
      get: function () {
        return this.leftDrawer.visible
      },
      set: function (value) {
        this.$layout.setLeftDrawerVisible(value)
      }
    },
    isRightPaneOpened: {
      get: function () {
        return this.rightPane.visible
      },
      set: function (value) {
        this.$store.patch('rightPane', { visible: value })
      }
    },
    isBottomPaneOpened: {
      get: function () {
        return this.bottomPane.visible
      },
      set: function (value) {
        this.$store.patch('bottomPane', { visible: value })
      }
    }
  },
  data () {
    return {
      leftDrawer: this.$layout.getLeftDrawer(),
      topPane: this.$store.get('topPane'),
      rightPane: this.$store.get('rightPane'),
      bottomPane: this.$store.get('bottomPane'),
      hasLeftDrawerOpener: false,
      hasTopPaneOpener: false,
      hasRightPaneOpener: false,
      hasBottomPaneOpener: false,
      topPadding: 0,
      bottomPadding: 0,
      rightPadding: 0,
      widgetOffset: [0, 0],
      fabOffset: [16, 16]
    }
  },
  methods: {
    onTopPaneResized (size) {
      this.topPadding = size.height
    },
    onBottomPaneResized (size) {
      this.bottomPadding = size.height
    },
    onRightPaneResized (size) {
      this.rightPaddding = size.width
    }
  },
  created () {
    // load the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-opener'] = this.$load('frame/KOpener')
    this.$options.components['k-window'] = this.$load('layout/KWindow')
    this.$options.components['k-fab'] = this.$load('layout/KFab')
    // Read left drawer configuration
    this.hasLeftDrawerOpener = this.$config('layout.leftDrawer.opener', false)
    // Read top pane configuration
    this.hasTopPaneOpener = this.$config('layout.topPane.opener', false)
    if (this.$config('layout.topPane.visible', false)) this.$store.patch('topPane', { visible: true })
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
.k-pane {
  border: solid 1px lightgrey;
  border-radius: 5px;
  background: #ffffff
}

.k-pane:hover {
  border: solid 1px $primary;
}
</style>
