<template>
  <div v-if="isOpened" class="k-window" :style="windowStyle">
    <!-- 
      Tab bar
     -->
     <div class="row justify-between items-center q-pb-xs">
      <q-tabs
        v-model="widget"
        dense no-caps
        active-color="primary"
        align="left"
        narrow-indicator
      >
        <template v-for="(widget,index) in widgets">
          <q-tab :key="index" :name="widget.name" :icon="widget.icon" />
        </template>
      </q-tabs>
      <k-tool-bar :actions="actions" size="sm" />
    </div>
    <!--
      Tab panes
      -->
    <q-tab-panels v-model="widget" animated>
      <template v-for="(widget, index) in widgets">
        <q-tab-panel :key="index" :name="widget.name" class="no-padding">
          <component :is="widget.componentKey" :mode="mode" v-bind="widget.props" style="z-index: 1" />
        </q-tab-panel>
      </template>>
    </q-tab-panels>
  </div>
</template>

<script>
import _ from 'lodash'
import path from 'path'

export default {
  name: 'k-window',
  computed: {
    actions () {
      return [
        {
          name: 'change-mode',
          label: this.$t(this.mode === 'minimized' ? 'KWindow.MINIMIZE_ACTION' : 'KWindow.MAXIMIZE_ACTION'),
          icon: this.mode === 'minimized' ? 'las la-expand' : 'las la-compress',
          handler: () => this.toggleMode()
        },
        {
          name: 'close-action',
          label: this.$t('KWindow.CLOSE_ACTION'),
          icon: 'las la-times',
          handler: () => this.close()
        }
      ]
    },
    widgets () {
      _.forEach(this.window.widgets, (widget) => {
        if (! widget.key) {
          const componentName = _.get(widget, 'component')
          const componentKey = _.kebabCase(path.basename(componentName))
          widget['componentKey'] = componentKey
          this.$options.components[componentKey] = this.$load(componentName)
        }
      })
      return this.window.widgets
    },
    windowStyle () {
      if (this.mode === 'maximized') return "width: 100vw"
      return this.$q.screen.gt.lg ? "width: 55vw" :
             this.$q.screen.gt.md ? "width: 70vw" :
             this.$q.screen.gt.sm ? "width: 85vw" :
             "width: 100vw"
    }
  },
  data () {
    return {
      window: this.$store.get('window'),
      widget: '',
      mode: 'minimized',
      isOpened: false
    }
  },
  methods: {
    setMode (mode) {
      this.mode = mode
      this.$emit('state-changed', this.mode)
    },
    toggleMode () {
      this.setMode(this.mode === 'minimized' ? 'maximized' : 'minimized')
    },
    open (widget) {
      this.isOpened = true
      this.widget = widget
      this.$emit('state-changed', this.mode)
    },
    close () {
      this.isOpened = false
      this.$emit('state-changed', 'closed')
    },
    toggle () {
      if (!this.isOpened) {
        this.open()
      } else {
        this.close()
      }
    },
    isOpen () {
      return this.isOpened
    },
    isMinimized () {
      return (this.mode === 'minimized')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
  }
}
</script>

<style lang="stylus">
.k-window
  border: solid 1px lightgrey;
  border-radius: 5px;
  background: #ffffff

.k-window:hover
  border: solid 1px $primary;
</style>
