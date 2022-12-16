<template>
  <div v-if="visible" class="k-window fit column">
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
        <template v-for="(widget, index) in widgets" :placement="index">
          <q-tab-panel :name="widget.id" class="no-padding no-scroll">
            <component
              :is="widget.component"
              :window="window"
              :mode="mode"
              v-bind="widget"
              style="z-index: 1;"
            />
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
  props: {
    placement: {
      type: String,
      required: true,
      validator: (value) => {
        return ['left', 'right', 'top', 'bottom'].includes(value)
      }
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.window.visible
      },
      set: function (value) {
        this.$store.patch(`windows.${this.placement}`, { visible: false })
      }
    },
    widget: {
      get: function () {
        return this.window.current
      },
      set: function (value) {
        this.$store.patch(`windows.${this.placement}`, { current: value })
      }
    },
    widgets () {
      let widgets = this.window.widgets
      // Apply filtering
      widgets = Layout.filterContent(widgets, this.window.filter || {})
      _.forEach(widgets, (widget) => {
        if (!widget.placement) {
          const componentName = _.get(widget, 'component')
          widget.component = loadComponent(componentName)
        }
      })
      return widgets
    },
    pinIcon () {
      switch (this.placement) {
        case 'left':
          return 'las la-angle-left'
        case 'right':
          return 'las la-angle-right'
        case 'top':
          return 'las la-angle-up'
      }
      return 'las la-angle-down'
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
      const widgetMenu = []
      if (widgetMenuItems.length > 1) {
        widgetMenu.push({
          id: 'widgets-menu-items',
          component: 'menu/KMenu',
          icon: 'las la-cube',
          tooltip: 'Widgets',
          size: 'sm',
          actionRenderer: 'item',
          content: widgetMenuItems
        })
      }
      const windowControls = [
        {
          id: 'pin-action',
          icon: this.pinIcon,
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
      window: this.$store.get(`windows.${this.placement}`),
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
      return this.$config('appName').toLowerCase() + '-' + this.placement + '-window-geometry'
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
      this.$store.patch(`windows.${this.placement}`, { position: this.backupPosition, size: this.backupSize })
      this.mode = this.backupMode
    },
    onClosed () {
      this.$store.patch(`windows.${this.placement}`, { visible: false })
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
        this.$store.patch(`windows.${this.placement}`, { position: newPosition })
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
        this.$store.patch(`windows.${this.placement}`, { size: newSize })
        if (event.isFinal) this.storeGeometry(this.window.position, newSize)
      }
    },
    onScreenResized () {
      if (this.mode === 'pinned') {
        // Pinned mode
        let w, h, x, y
        if (this.placement === 'top' || this.placement === 'bottom') {
          w = this.$q.screen.width
          if (this.$q.screen.gt.sm) w = this.$q.screen.width * 0.9
          if (this.$q.screen.gt.md) w = this.$q.screen.width * 0.8
          if (this.$q.screen.gt.lg) w = w = this.$q.screen.width * 0.7
          h = this.$q.screen.height * 0.3
          x = this.$q.screen.width / 2 - w / 2
          y = this.placement === 'top' ? 0 : this.$q.screen.height - h
        } else {
          w = this.$q.screen.width * 0.15
          if (this.$q.screen.lt.xl) w = this.$q.screen.width * 0.2
          if (this.$q.screen.lt.lg) w = this.$q.screen.width * 0.25
          if (this.$q.screen.lt.md) w = this.$q.screen.width * 0.35
          if (this.$q.screen.lt.sm) w = this.$q.screen.width
          h = this.$q.screen.height * 0.6
          x = this.placement === 'left' ? 0 : this.$q.screen.width - w
          y = this.$q.screen.height / 2 - h / 2
        }
        this.$store.patch(`windows.${this.placement}`, { position: [x, y], size: [w, h] })
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
            this.$store.patch(`windows.${this.placement}`, { position: [x, y], size: [w, h] })
            this.storeGeometry([x, y], [w, h])
          }
        }
      } else {
        // Maximized mode
        this.$store.patch(`windows.${this.placement}`, { position: [0, 0], size: [this.$q.screen.width, this.$q.screen.height] })
      }
    }
  },
  created () {
    // Define a default widget if needed
    if (!this.window.current && this.window.widgets.length > 0) {
      this.$store.patch(`windows.${this.placement}`, { current: this.window.widgets[0].id })
    }
    // Retrieve the geometry
    const geometry = window.localStorage.getItem(this.getGeometryKey())
    if (geometry) {
      const geometryObject = JSON.parse(geometry)
      this.$store.patch(`windows.${this.placement}`, { position: geometryObject.position, size: geometryObject.size })
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
