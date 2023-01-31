<template>
  <div v-if="isVisible" class="k-window fit column">
    <!--
      Window header
     -->
    <div
      class="k-window-header full-width row items-center"
      v-touch-pan.prevent.mouse="onMoved"
    >
      <!-- window menu -->
      <KPanel
        id="window-menu"
        :content="menu"
      />
      <!-- widget header -->
      <KPanel
        id="widget-header"
        :content="widgetHeader"
        :context="widgetReference"
      />
      <q-space />
      <!-- window controls -->
      <KPanel
        id="window-controls"
        :content="controls"
      />
    </div>
    <!--
      Window content
      -->
    <div class="fit">
      <q-tab-panels
        v-model="currentWidget"
        animated
      >
        <template v-for="widget in availableWidgets" :key="widget.id">
          <q-tab-panel :name="widget.id" class="no-padding no-scroll">
            <component
              :ref="onWidgetRefCreated"
              :is="widget.component"
              v-bind="widgetContent"
              :style="widgetStyle"
            />
          </q-tab-panel>
        </template>
      </q-tab-panels>
    </div>
    <!--
      Window footer
     -->
    <div id="window-footer" class="k-window-footer full-width row justify-end">
      <!-- window grip -->
      <q-icon
        v-if="currentMode !== 'maximized'"
        class="k-window-grip"
        name="las la-slash"
        size="10px"
        v-touch-pan.prevent.mouse="onResized"
      />
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { ref, computed, watch, provide } from 'vue'
import { useQuasar } from 'quasar'
import { Store, Layout, utils } from '../..'
import KPanel from '../KPanel.vue'

// Props
const props = defineProps({
  placement: {
    type: String,
    required: true,
    validator: (value) => {
      return ['left', 'right', 'top', 'bottom'].includes(value)
    }
  }
})

// Data
const $q = useQuasar()
const currentWindow = Store.get(`windows.${props.placement}`)
const currentMode = ref('pinned')
const widgetHeader = ref(null)
const widgetContent = ref(null)
const widgetReference = ref(null)
const pinIcons = {
  left: 'las la-angle-left',
  right: 'las la-angle-right',
  top: 'las la-angle-up',
  bottom: 'las la-angle-down'
}
let backupPosition
let backupSize
let backupMode

provide('widget', widgetReference)

// Computed
const isVisible = computed({
  get: function () {
    return currentWindow.visible
  },
  set: function (value) {
    Store.patch(`windows.${props.placement}`, { visible: false })
  }
})
const menu = computed(() => {
  const widgetMenuItems = []
  _.forEach(availableWidgets.value, widget => {
    widgetMenuItems.push({
      id: widget.id,
      label: widget.label,
      icon: widget.icon,
      handler: () => { currentWidget.value = widget.id }
    })
  })
  const menu = []
  if (widgetMenuItems.length > 1) {
    menu.push({
      id: 'widgets-menu-items',
      component: 'menu/KMenu',
      icon: 'las la-cube',
      tooltip: 'Widgets',
      size: 'sm',
      actionRenderer: 'item',
      content: widgetMenuItems
    })
  }
  return menu
})
const controls = computed(() => {
  return [{
    id: 'pin-action',
    icon: pinIcons[props.placement],
    tooltip: 'KWindow.PIN_ACTION',
    size: 'xs',
    visible: currentMode.value === 'floating',
    handler: onPinned
  }, {
    id: 'maximize-action',
    icon: 'las la-expand',
    tooltip: 'KWindow.MAXIMIZE_ACTION',
    size: 'xs',
    visible: currentMode.value !== 'maximized',
    handler: onMaximized
  }, {
    id: 'restore-action',
    icon: 'las la-compress',
    tooltip: 'KWindow.RESTORE_ACTION',
    size: 'xs',
    visible: currentMode.value === 'maximized',
    handler: onRestored
  }, {
    id: 'close-action',
    icon: 'las la-times',
    tooltip: 'KWindow.CLOSE_ACTION',
    size: 'xs',
    handler: onClosed
  }]
})
const availableWidgets = computed(() => {
  // retrieve the widgets applying an optional filter
  const widgets = Layout.filterContent(currentWindow.widgets, currentWindow.filter || {})
  // add the component to be loaded
  _.forEach(widgets, (widget) => {
    const componentName = _.get(widget, 'content.component')
    if (componentName) widget.component = utils.loadComponent(componentName)
    else logger.error(`widget ${widget.id} component is undefined`)
  })
  return widgets
})
const currentWidget = computed({
  get: function () {
    return currentWindow.current
  },
  set: function (value) {
    Store.patch(`windows.${props.placement}`, { current: value })
  }
})
const widgetStyle = computed(() => {
  if (currentWindow.size) {
    // compute the widget height
    let widgetHeight = currentWindow.size[1]
    const windowHeaderElement = document.getElementById('window-header')
    if (windowHeaderElement) {
      widgetHeight -= parseInt(window.getComputedStyle(windowHeaderElement).getPropertyValue('height'))
    }
    const windowFooterElement = document.getElementById('window-footer')
    if (windowFooterElement) {
      widgetHeight -= parseInt(window.getComputedStyle(windowFooterElement).getPropertyValue('height'))
    }
    // return the style
    return `minWidth: ${currentWindow.size[0]}px;
            maxWidth: ${currentWindow.size[0]}px;
            minHeight: ${widgetHeight}px; 
            maxHeight: ${widgetHeight}px;
            z-index: 1;`
  }
})

// Watch
watch(() => [$q.screen.width, $q.screen.height], (value) => {
  onScreenResized()
})

// Functions
function onWidgetRefCreated (reference) {
  if (reference) {
    // setup the corresponding header
    const widget = _.find(availableWidgets.value, { id: currentWidget.value })
    if (!widget.reference) {
      logger.debug(`setting up widget ${widget.id}`)
      widget.reference = reference
      // bind the content and stores it
      const content = [widget.content]
      widget.content = Layout.bindContent(content, reference)[0]
      // bind the header if any and stores it
      if (widget.header) widget.header = Layout.bindContent(widget.header, reference)
      else widget.header = [{ component: 'KStamp', text: widget.label, direction: 'horizontal' }]
    }
    widgetContent.value = widget.content
    widgetHeader.value = widget.header
    widgetReference.value = widget.reference
  } else {
    // empty the header
    widgetHeader.value = null
  }
}
function getGeometryKey () {
  return _.get(config, 'appName').toLowerCase() + '-' + props.placement + '-window-geometry'
}
function storeGeometry (position, size) {
  window.localStorage.setItem(getGeometryKey(), JSON.stringify({ position, size }))
}
function updateWindow (position, size) {
  // Code taken from quasar screen plugin code
  const w = size[0]
  const s = $q.screen.sizes
  // Compute breakpoint
  const window = {
    position,
    size,
    gt: {
      xs: w >= s.sm,
      sm: w >= s.md,
      md: w >= s.lg,
      lg: w >= s.xl
    },
    lt: {
      sm: w < s.sm,
      md: w < s.md,
      lg: w < s.lg,
      xl: w < s.xl
    }
  }
  Object.assign(window, {
    xs: window.lt.sm,
    sm: window.gt.xs === true && window.lt.md === true,
    md: window.gt.sm === true && window.lt.lg === true,
    lg: window.gt.md === true && window.lt.xl === true,
    xl: window.gt.lg
  })
  window.breakpoint = (window.xs === true && 'xs') ||
    (window.sm === true && 'sm') ||
    (window.md === true && 'md') ||
    (window.lg === true && 'lg') ||
    'xl'
  Store.patch(`windows.${props.placement}`, window)
}
function onPinned () {
  window.localStorage.removeItem(getGeometryKey())
  currentMode.value = 'pinned'
  onScreenResized()
}
function onMaximized () {
  backupPosition = currentWindow.position
  backupSize = currentWindow.size
  backupMode = currentMode.value
  currentMode.value = 'maximized'
  onScreenResized()
}
function onRestored () {
  updateWindow(backupPosition, backupSize)
  currentMode.value = backupMode
}
function onClosed () {
  Store.patch(`windows.${props.placement}`, { visible: false })
}
function onMoved (event) {
  if (!event) return
  if (currentMode.value !== 'maximized') {
    currentMode.value = 'floating'
    const xMax = $q.screen.width - currentWindow.size[0]
    const yMax = $q.screen.height - currentWindow.size[1]
    const newPosition = [
      Math.max(Math.min(Math.floor(currentWindow.position[0] + event.delta.x), xMax), 0),
      Math.min(Math.max(Math.floor(currentWindow.position[1] + event.delta.y), 0), yMax)
    ]
    Store.patch(`windows.${props.placement}`, { position: newPosition })
    if (event.isFinal) storeGeometry(newPosition, currentWindow.size)
  }
}
function onResized (event) {
  if (!event) return
  // Handle the pinned and floating currentMode
  if (currentMode.value !== 'maximized') {
    currentMode.value = 'floating'
    const wMax = $q.screen.width - currentWindow.position[0]
    const hMax = $q.screen.height - currentWindow.position[1]
    const newSize = [
      Math.min(currentWindow.size[0] + event.delta.x, wMax),
      Math.min(currentWindow.size[1] + event.delta.y, hMax)
    ]
    updateWindow(currentWindow.position, newSize)
    if (event.isFinal) storeGeometry(currentWindow.position, newSize)
  }
}
function onScreenResized () {
  if (currentMode.value === 'pinned') {
    // Pinned mode
    let w, h, x, y
    if (props.placement === 'top' || props.placement === 'bottom') {
      w = $q.screen.width
      if ($q.screen.gt.sm) w = $q.screen.width * 0.9
      if ($q.screen.gt.md) w = $q.screen.width * 0.8
      if ($q.screen.gt.lg) w = w = $q.screen.width * 0.7
      h = $q.screen.height * 0.3
      x = $q.screen.width / 2 - w / 2
      y = props.placement === 'top' ? 0 : $q.screen.height - h
    } else {
      w = $q.screen.width * 0.15
      if ($q.screen.lt.xl) w = $q.screen.width * 0.25
      if ($q.screen.lt.lg) w = $q.screen.width * 0.30
      if ($q.screen.lt.md) w = $q.screen.width * 0.40
      if ($q.screen.lt.sm) w = $q.screen.width
      h = $q.screen.height * 0.6
      x = props.placement === 'left' ? 0 : $q.screen.width - w
      y = $q.screen.height / 2 - h / 2
    }
    updateWindow([x, y], [w, h])
  } else if (currentMode.value === 'floating') {
    // Floating mode
    if (currentWindow.position && currentWindow.size) {
      let x = currentWindow.position[0]
      let y = currentWindow.position[1]
      let w = currentWindow.size[0]
      let h = currentWindow.size[1]
      let constrained = false
      if ((x + w) > $q.screen.width) {
        x = Math.max($q.screen.width - w, 0)
        if (x === 0) w = $q.screen.width
        constrained = true
      }
      if ((y + h) > $q.screen.height) {
        y = Math.max($q.screen.height - h, 0)
        if (y === 0) h = $q.screen.height
        constrained = true
      }
      if (constrained) {
        updateWindow([x, y], [w, h])
        storeGeometry([x, y], [w, h])
      }
    }
  } else {
    // Maximized mode
    updateWindow([0, 0], [$q.screen.width, $q.screen.height])
  }
}

// Immediate
// pick a default widget if needed
if (!currentWindow.current && currentWindow.widgets.length > 0) {
  Store.patch(`windows.${props.placement}`, { current: currentWindow.widgets[0].id })
}
// restore the geometry if needed
const geometry = window.localStorage.getItem(getGeometryKey())
if (geometry) {
  const geometryObject = JSON.parse(geometry)
  updateWindow(geometryObject.position, geometryObject.size)
  currentMode.value = 'floating'
} else {
  onPinned()
}
</script>

<style lang="scss" scoped>
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
