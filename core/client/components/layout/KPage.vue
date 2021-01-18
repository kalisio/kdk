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
      <div v-if="topPane.content" class="column items-center">
        <k-panel id="top-pane" v-if="isTopPaneOpened" :content="topPane.content" :mode="topPane.mode" class="k-pane" />
        <k-opener v-if="hasTopPaneOpener" v-model="isTopPaneOpened" position="top" />
      </div>
    </q-page-sticky>  
    <q-page-sticky position="top" :offset="widgetOffset">
      <k-window id="window" ref="window" />
    </q-page-sticky>
    <q-page-sticky v-if="hasLeftDrawerOpener && hasLeftDrawerComponent" position="left">
      <k-opener v-model="isLeftDrawerOpened" position="left"  />
    </q-page-sticky>
    <q-page-sticky v-if="hasRightDrawerOpener && hasRightDrawerComponent" position="right">
      <k-opener v-model="isRightDrawerOpened" position="right" />
    </q-page-sticky>
    <q-page-sticky position="bottom">
      <div v-if="bottomPane.content" class="column items-center">
        <k-opener v-if="hasBottomPaneOpener" v-model="isBottomPaneOpened" position="bottom" />
        <k-panel id="bottom-pane" v-if="isBottomPaneOpened" :content="bottomPane.content" :mode="bottomPane.mode" class="k-pane" />        
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
      let style = ''
      if (this.padding) {
        if (this.topPane.content && this.topPane.visible) style = 'padding-top: 50px' // TODO
        if (this.bottomPane.content && this.bottomPane.visible) style = 'padding-bottom: 50px' //TODO
      }
      return style
    },
    isTopPaneOpened: {
      get: function () {
        return this.topPane.visible
      },
      set: function (value) {
        this.$store.patch('topPane', { visible: value })
      }
    },
    isBottomPaneOpened: {
      get: function () {
        return this.bottomPane.visible
      },
      set: function (value) {
        this.$store.patch('bottomPane', { visible: value })
      }
    },
    isLeftDrawerOpened: {
      get: function () {
        return this.leftDrawer.visible
      },
      set: function (value) {
        this.$store.patch('leftDrawer', { visible: value })
      }
    },
    hasLeftDrawerComponent () {
      return !!this.leftDrawer.component
    },
    isRightDrawerOpened: {
      get: function () {
        return this.rightDrawer.visible
      },
      set: function (value) {
        this.$store.patch('rightDrawer', { visible: value })
      }
    },
    hasRightDrawerComponent () {
      return !!this.rightDrawer.component
    }
  },
  data () {
    return {
      topPane: this.$store.get('topPane'),
      bottomPane: this.$store.get('bottomPane'),
      leftDrawer: this.$store.get('leftDrawer'),
      rightDrawer: this.$store.get('rightDrawer'),
      hasTopPaneOpener: false,
      hasBottomPaneOpener: false,
      hasLeftDrawerOpener: false,
      hasRightDrawerOpener: false,
      widgetOffset: [0, 0],
      fabOffset: [16, 16]
    }
  },
  created () {
    // load the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-opener'] = this.$load('frame/KOpener')
    this.$options.components['k-window'] = this.$load('layout/KWindow')
    this.$options.components['k-fab'] = this.$load('layout/KFab')
    // Read top/bottom pane configuration
    this.hasTopPaneOpener = this.$config('layout.topPane.opener', false)
    if (this.$config('layout.topPane.visible', false)) this.$store.patch('topPane', { visible: true })
    this.hasBottomPaneOpener = this.$config('layout.bottomPane.opener', false)
    if (this.$config('layout.bottomPane.visible', false)) this.$store.patch('bottomPane', { visible: true })
    // Read drawers configuration
    this.hasLeftDrawerOpener = this.$config('layout.leftDrawer.opener', false)
    this.hasRightDrawerOpener = this.$config('layout.rightDrawer.opener', false)
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
