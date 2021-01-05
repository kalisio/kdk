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
      <div v-if="activityBar.content" class="column items-center">
        <k-bar id="activity-bar" v-if="isActivityBarOpened" :content="activityBar.content" :mode="activityBar.mode" class="k-activity-bar" />
        <k-opener v-if="hasActivityBarOpener" v-model="isActivityBarOpened" position="top" />
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
    <q-page-sticky v-if="hasFooterOpener && hasFooterComponent" position="bottom">
      <k-opener v-model="isFooterOpened" position="bottom" />
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
      if (this.padding && this.activityBar.content && this.activityBar.visible) return 'padding-top: 50px'
      return ''
    },
    isActivityBarOpened: {
      get: function () {
        return this.activityBar.visible
      },
      set: function (value) {
        this.$store.patch('activityBar', { visible: value })
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
    },
    isFooterOpened: {
      get: function () {
        return this.footer.visible
      },
      set: function (value) {
        this.$store.patch('footer', { visible: value })
      }
    },
    hasFooterComponent () {
      return !!this.footer.component
    }
  },
  data () {
    return {
      activityBar: this.$store.get('activityBar'),
      widgetOffset: [0, 0],
      fabOffset: [16, 16],
      leftDrawer: this.$store.get('leftDrawer'),
      rightDrawer: this.$store.get('rightDrawer'),
      footer: this.$store.get('footer'),
      hasActivityBarOpener: false,
      hasLeftDrawerOpener: false,
      hasRightDrawerOpener: false,
      hasFooterOpener: false
    }
  },
  created () {
    // load the required components
    this.$options.components['k-bar'] = this.$load('frame/KBar')
    this.$options.components['k-opener'] = this.$load('frame/KOpener')
    this.$options.components['k-window'] = this.$load('layout/KWindow')
    this.$options.components['k-fab'] = this.$load('layout/KFab')
    // Read drawers configuration to check whether openers have to be displayed or not
    this.hasActivityBarOpener = this.$config('layout.activityBar.opener', false)
    this.hasLeftDrawerOpener = this.$config('layout.leftDrawer.opener', false)
    this.hasRightDrawerOpener = this.$config('layout.rightDrawer.opener', false)
    this.hasFooterOpener = this.$config('layout.footer.opener', false)
  }
}
</script>

<style lang="stylus">
.k-activity-bar {
  border: solid 1px lightgrey;
  border-radius: 5px;
  background: #ffffff
}

.k-activity-bar:hover {
  border: solid 1px $primary;
}
</style>
