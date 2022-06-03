<template>
  <div v-if="widget" class="k-window fit column">
    <!--
      Window header
     -->
    <div
      id="window-header"
      class="k-window-header full-width row"
      v-touch-pan.prevent.mouse="onMoved"
    >
      <KPanel id="window-actions" class="full-width" :content="actions" />
    </div>
    <!--
      Window content
      -->
    <div class="fit">
      <q-tab-panels v-model="widget" animated>
        <template v-for="(widget, index) in widgets" :key="index">
          <q-tab-panel :name="widget.id" class="no-padding no-scroll">
            <component :is="widget.component" :mode="mode" v-bind="widget.props" style="z-index: 1;" />
          </q-tab-panel>
        </template>
      </q-tab-panels>
    </div>
    <!--
      Window footer
     -->
    <div
      id="window-footer"
      class="k-window-footer full-width row justify-end"
    >
      <!-- Window grip -->
      <q-icon 
        v-if="mode !== 'maximized'" 
        class="k-window-grip" 
        name="las la-slash" 
        size="10px" 
        v-touch-pan.prevent.mouse="onResized" 
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { Layout } from '../../layout.js'
import { loadComponent } from '../../utils.js'
import KPanel from '../frame/KPanel.vue'

export default {
  components: {
    KPanel
  },
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
          widget.component = loadComponent(componentName)
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
          handler: () => { this.widget = widget.id }
        })
      })
      const widgetMenu = [{
        id: 'widgets-menu-items',
        component: 'menu/KMenu',
        icon: 'las la-cube',
        tooltip: 'Widgets',
        size: 'sm',
        actionRenderer: 'item',
        content: widgetMenuItems
      }]
      const windowControls = [
        {
          id: 'pin-action',
          icon: 'las la-angle-up',
          tooltip: 'KWindow.PIN_ACTION',
          size: 'sm',
          visible: this.mode === 'floating',
          handler: this.onPinned
        },
        {
          id: 'maximize-action',
          icon: 'las la-expand',
          tooltip: 'KWindow.MAXIMIZE_ACTION',
          size: 'sm',
          visible: this.mode !== 'maximized',
          handler: this.onMaximized
        },
        {
          id: 'restore-action',
          icon: 'las la-compress',
          tooltip: 'KWindow.RESTORE_ACTION',
          size: 'sm',
          visible: this.mode === 'maximized',
          handler: this.onRestored
        },
        {
          id: 'close-action',
          icon: 'las la-times',
          tooltip: this.$t('KWindow.CLOSE_ACTION'),
          size: 'sm',
          handler: this.onClosed
        }
      ]
      return _.concat(widgetMenu, this.window.widgetActions, { component: 'QSpace' }, windowControls)
    }
  },
  data () {
    return {
      window: this.$store.get('window'),
      mode: 'pinned'
    }
  },
  watch: {
    '$q.screen.width': {
      handler () {
        this.onScreenResized()
      }
    },
    '$q.screen.height': {
      handler () {
        this.onScreenResized()
      }
    }
  },
  methods: {
    getGeometryKey () {
      return this.$config('appName').toLowerCase() + '-window-geometry'
    },
    storeGeometry (position, size) {
      window.localStorage.setItem(this.getGeometryKey(), JSON.stringify({ position, size }))
    },
    onPinned () {
      window.localStorage.removeItem(this.getGeometryKey())
      this.mode = 'pinned'
      this.onScreenResized()
    },
    onMaximized () {
      this.backupPosition = this.window.position
      this.backupSize = this.window.size
      this.backupMode = this.mode
      this.mode = 'maximized'
      this.onScreenResized()
    },
    onRestored () {
      this.$store.patch('window', { position: this.backupPosition, size: this.backupSize })
      this.mode = this.backupMode
    },
    onClosed () {
      const widgets = this.$store.get('window.widgets')
      this.$store.patch('window', { current: '', widgets })
    },
    onMoved (event) {
      if (!event) return
      if (this.mode !== 'maximized') {
        this.mode = 'floating'
        const xMax = this.$q.screen.width - this.window.size[0]
        const yMax = this.$q.screen.height - this.window.size[1]
        const newPosition = [
          Math.max(Math.min(Math.floor(this.window.position[0] + event.delta.x), xMax), 0),
          Math.min(Math.max(Math.floor(this.window.position[1] + event.delta.y), 0), yMax)
        ]
        this.$store.patch('window', { position: newPosition })
        if (event.isFinal) this.storeGeometry(newPosition, this.window.size)
      }
    },
    onResized (event) {
      if (!event) return
      // Handle the pinned and floating mode
      if (this.mode !== 'maximized') {
        this.mode = 'floating'
        const wMax = this.$q.screen.width - this.window.position[0]
        const hMax = this.$q.screen.height - this.window.position[1]
        const newSize = [
          Math.min(this.window.size[0] + event.delta.x, wMax),
          Math.min(this.window.size[1] + event.delta.y, hMax)
        ]
        this.$store.patch('window', { size: newSize })
        if (event.isFinal) this.storeGeometry(this.window.position, newSize)
      }
    },
    onScreenResized () {
      if (this.mode === 'pinned') {
        // Pinned mode
        let w = this.$q.screen.width
        if (this.$q.screen.gt.lg) w *= 0.7
        if (this.$q.screen.gt.md) w *= 0.8
        if (this.$q.screen.gt.sm) w *= 0.9
        const h = this.$q.screen.height * 0.3
        const x = this.$q.screen.width / 2 - w / 2
        this.$store.patch('window', { position: [x, 0], size: [w, h] })
      } else if (this.mode === 'floating') {
        // Floating mode
        if (this.window.position && this.window.size) {
          let x = this.window.position[0]
          let y = this.window.position[1]
          let w = this.window.size[0]
          let h = this.window.size[1]
          let constrained = false
          if ((x + w) > this.$q.screen.width) {
            x = Math.max(this.$q.screen.width - w, 0)
            if (x === 0) w = this.$q.screen.width
            constrained = true
          }
          if ((y + h) > this.$q.screen.height) {
            y = Math.max(this.$q.screen.height - h, 0)
            if (y === 0) h = this.$q.screen.height
            constrained = true
          }
          if (constrained) {
            this.$store.patch('window', { position: [x, y], size: [w, h] })
            this.storeGeometry([x, y], [w, h])
          }
        }
      } else {
        // Maximized mode
        this.$store.patch('window', { position: [0, 0], size: [this.$q.screen.width, this.$q.screen.height] })
      }
    }
  },
  created () {
    const geometry = window.localStorage.getItem(this.getGeometryKey())
    if (geometry) {
      const geometryObject = JSON.parse(geometry)
      this.$store.patch('window', { position: geometryObject.position, size: geometryObject.size })
      this.mode = 'floating'
    } else {
      this.onPinned()
    }
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
    border: solid 1px $primary;
  }
  .k-window-header {
    border-radius: 5px;
    cursor: move
  }
  .k-window-header:hover {
    background: #eeeeee
  }
  .k-window-footer {
    border-radius: 5px;
  }
  .k-window-grip:hover {
    cursor: nwse-resize
  }
</style>
