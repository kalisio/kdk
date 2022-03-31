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
      return widgets
    },
    actions () {
      const widgetMenuItems = []
      _.forEach(this.widgets, widget => {
        widgetMenuItems.push({
          id: widget.id,
          label: widget.label,
          icon: widget.icon,
          dense: true,
          handler: () => { this.widget = widget.id }
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
          id: 'pin-action',
          icon: 'las la-angle-up',
          tooltip: 'KWindow.RESET_ACTION',
          dense: true,
          visible: this.mode === 'floating',
          handler: this.onPinned
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
      if (this.mode === 'pinned') {
        let width = this.$q.screen.width
        if (this.$q.screen.gt.lg) width = 0.5 * this.$q.screen.width
        if (this.$q.screen.gt.md) width = 0.6 * this.$q.screen.width
        if (this.$q.screen.gt.sm) width = 0.8 * this.$q.screen.width
        const height = this.$q.screen.height * 0.3
        const x = this.$q.screen.width / 2 - width / 2
        const y = 0
        this.$store.patch('window', { position: [x, y], size: [width, height] })
      } else if (this.mode === 'floating') {
        const size = this.window.size
        if (size) return { width: `${size[0]}px`, height: `${size[1]}px` }  
      } else {
        this.$store.patch('window', { size: [this.$q.screen.width, this.$q.screen.height ]})
      }
    }
  },
  data () {
    return {
      window: this.$store.get('window'),
      mode: 'pinned'
    }
  },
  methods: {
    getGeometryKey () {
      return this.$config('appName').toLowerCase() + '-window-geometry'
    },
    onPinned () {
      window.localStorage.removeItem(this.getGeometryKey())
      this.mode = 'pinned'      
    },
    onMaximized () {     
      this.$store.patch('window', { backupPosition: this.$store.get('window.position'), backupSize: this.$store.get('window.size'), backupMode: this.mode })
      this.$store.patch('window', { position: [0, 0] })
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
        const currentPosition = this.$store.get('window.position')
        const newPosition = [currentPosition[0] + event.delta.x, currentPosition[1] + event.delta.y]
        this.$store.patch('window', { position: newPosition })
        if (event.isFinal) {
          window.localStorage.setItem(this.getGeometryKey(), JSON.stringify({ 
            position: newPosition, 
            size: this.$store.get('window.size')
          }))
        }
      }
    },
    onResized (event) {
      if (this.mode !== 'maximized') {
        this.mode = 'floating'
        const currentSize = this.$store.get('window.size')
        const newSize = [currentSize[0] + event.delta.x, currentSize[1] + event.delta.y]
        this.$store.patch('window', { size: newSize })
        if (event.isFinal) {
          window.localStorage.setItem(this.getGeometryKey(), JSON.stringify({ 
            position: this.$store.get('window.position'),
            size: newSize
          }))
        }
      }
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  },
  created () {
    const geometry = window.localStorage.getItem(this.getGeometryKey())
    if (geometry) {
      const geometryObject = JSON.parse(geometry)
      this.$store.patch('window', { position: geometryObject.position, size: geometryObject.size })
      this.mode = 'floating'
    } else {
      this.onReset()
    }
  }
}
</script>

<style lang="scss">
  body {
    overflow: hidden;
  }
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
