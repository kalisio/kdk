<template>
  <div v-if="widget" class="k-window" :style="windowStyle">
    <!--
      Window bar
     -->
     <div class="row justify-between items-center q-pb-xs">
       <!-- Widgets tab bar -->
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
      <!-- Window actions -->
      <k-panel class="q-pa-sm" :content="actions" color="primary" />
    </div>
    <!--
      Window content
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
    widget: {
      get: function () {
        return this.window.current
      },
      set: function (value) {
        this.$store.set('window.current', value)
      }
    },
    actions () {
      return {
        default: [
          {
            id: 'change-mode',
            icon: this.mode === 'minimized' ? 'las la-expand' : 'las la-compress',
            tooltip: this.$t(this.mode === 'minimized' ? 'KWindow.MINIMIZE_ACTION' : 'KWindow.MAXIMIZE_ACTION'),
            handler: this.onModeChanged
          },
          {
            id: 'close-action',
            icon: 'las la-times',
            tooltip: this.$t('KWindow.CLOSE_ACTION'),
            handler: this.onClosed
          }
        ]
      }
    },
    widgets () {
      _.forEach(this.window.widgets, (widget) => {
        if (!widget.key) {
          const componentName = _.get(widget, 'component')
          const componentKey = _.kebabCase(path.basename(componentName))
          widget.componentKey = componentKey
          this.$options.components[componentKey] = this.$load(componentName)
        }
      })
      return this.window.widgets
    },
    windowStyle () {
      if (this.mode === 'maximized') return 'width: 100vw'
      return this.$q.screen.gt.lg ? 'width: 55vw'
        : this.$q.screen.gt.md ? 'width: 70vw'
          : this.$q.screen.gt.sm ? 'width: 85vw'
            : 'width: 100vw'
    }
  },
  data () {
    return {
      window: this.$store.get('window'),
      mode: 'minimized'
    }
  },
  methods: {
    onModeChanged () {
      if (this.mode === 'minimized') this.mode = 'maximized'
      else this.mode = 'minimized'
    },
    onClosed () {
      const widgets = this.$store.get('window.widgets')
      this.$store.patch('window', { current: '', widgets })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-panel'] = this.$load('frame/KBar')
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
