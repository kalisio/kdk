<template>
  <div v-if="widget" class="k-window fit column" :style="windowStyle">
    <!--
      Window header
     -->
    <div 
      id="window-header" 
      class="k-window-header q-pt-xs" 
      v-touch-pan.prevent.mouse="onMoved">
      <k-panel id="window-actions" :content="actions" />
    </div>
    <!--
      Window content
      -->
    <div class="col">
      <q-tab-panels v-model="widget" animated>
        <template v-for="(widget, index) in widgets">
          <q-tab-panel :key="index" :name="widget.id" class="no-padding">
            <component :is="widget.componentKey" :mode="mode" v-bind="widget.props" style="z-index: 1;" />
          </q-tab-panel>
        </template>>
      </q-tab-panels>
    </div>
    <!--
      Window footer
     -->   
    <div
      id="window-footer"
      class="k-window-footer row justify-end items-center">
      <q-icon v-if="mode !== 'maximized'" name="las la-slash" size="10px" v-touch-pan.prevent.mouse="onResized" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import path from 'path'
import { Layout } from '../../layout'

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
    widgets () {
      let widgets = this.window.widgets
      // Apply filtering
      widgets = Layout.filterContent(widgets, this.window.filter || {})
      _.forEach(widgets, (widget) => {
        if (!widget.key) {
          const componentName = _.get(widget, 'component')
          const componentKey = _.kebabCase(path.basename(componentName))
          widget.componentKey = componentKey
          this.$options.components[componentKey] = this.$load(componentName)
        }
      })
      console.log(widgets)
      return widgets
    },
    actions () {
      let widgetMenuItems = []
      _.forEach(this.widgets, widget => {
        widgetMenuItems.push({
          id: widget.id,
          label: widget.label,
          icon: widget.icon,
          dense: true,
          handler: () => this.widget = widget.id
        })
      })
      const widgetMenu = [{
        id: 'widgets-menu-items',
        component: 'menu/KMenu',
        icon: 'las la-cube',
        tooltip: 'Widgets',
        dense: true,
        actionRenderer: 'item',
        content: widgetMenuItems
      }]
      const windowControls = [
        {
          id: 'reset-action',
          icon: 'las la-angle-up',
          tooltip: 'KWindow.RESET_ACTION',
          dense: true,
          visible: this.mode === 'floating',
          handler: this.onReset
        },
        {
          id: 'maximize-action',
          icon: 'las la-expand',
          tooltip: 'KWindow.MAXIMIZE_ACTION',
          dense: true,
          visible: this.mode !== 'maximized',
          handler: this.onMaximized
        },
        {
          id: 'restore-action',
          icon: 'las la-compress',
          tooltip: 'KWindow.RESTORE_ACTION',
          dense: true,
          visible: this.mode === 'maximized',
          handler: this.onRestored
        },
        {
          id: 'close-action',
          icon: 'las la-times',
          tooltip: this.$t('KWindow.CLOSE_ACTION'),
          dense: true,
          handler: this.onClosed
        }
      ]
      return _.concat(widgetMenu, this.window.widgetActions, [{ component: 'QSpace' }], windowControls)
    },
    windowStyle () {
      const size = this.window.size
      return { width: `${size[0]}px`, height: `${size[1]}px` }
    }
  },
  data () {
    return {
      window: this.$store.get('window'),
      mode: 'pinned'
    }
  },
  methods: {
    onReset () {
      let width = this.$q.screen.width
      if (this.$q.screen.gt.lg) width = 0.5 * this.$q.screen.width
      if (this.$q.screen.gt.md) width = 0.6 * this.$q.screen.width 
      if (this.$q.screen.gt.sm) width = 0.8 * this.$q.screen.width 
      let height = this.$q.screen.height * .3
      let x = this.$q.screen.width / 2 - width / 2
      let y = 0
      this.$store.patch('window', { position: [x, y], size: [width, height] })
      this.mode = 'pinned'
    },
    onMaximized () {
      this.$store.patch('window', { backupPosition: this.$store.get('window.position'), backupSize: this.$store.get('window.size'), backupMode: this.mode })
      this.$store.patch('window', { position: [0, 0], size: [this.$q.screen.width, this.$q.screen.height ]})
      this.mode = 'maximized'
    },
    onRestored () {
      this.$store.patch('window', { position: this.$store.get('window.backupPosition'), size: this.$store.get('window.backupSize') })
      this.mode = this.$store.get('window.backupMode')
    },
    onClosed () {
      const widgets = this.$store.get('window.widgets')
      this.$store.patch('window', { current: '', widgets })
    },
    onMoved (event) {
      if (this.mode !== 'maximized') {
        this.mode = 'floating'
        const position = this.$store.get('window.position')
        this.$store.patch('window', { position: [ position[0] + event.delta.x, position[1] + event.delta.y ] })
      }
    },
    onResized (event) {
      if (this.mode !== 'maximized') {
        this.mode = 'floating'
        const size = this.$store.get('window.size')
        this.$store.patch('window', { size: [ size[0] + event.delta.x, size[1] + event.delta.y ] })
      }
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  },
  created () {
    let position = this.window.position
    let size = this.window.size
    if (!size) {
      size = [ this.$q.screen.width * .5, this.$q.screen.height *.25 ]
    }
    if (!position) {
      position = [ this.$q.screen.width / 2 - size[0] / 2, 0]
    }
    this.$store.patch('window', { position, size })
  }
}
</script>

<style lang="scss">
  .k-window {
    border: solid 1px lightgrey;
    border-radius: 5px;
    background: #ffffff;
  }
  .k-window:hover {
    border: solid 1px var(--q-color-primary);
  }
  .k-window-header {
     border-radius: 5px;
  }
  .k-window-header:hover {
    background: #eeeeee
  }
  .k-window-footer {
     border-radius: 5px;
  }
  .k-window-footer:hover {
     cursor: nwse-resize
  }
</style>
