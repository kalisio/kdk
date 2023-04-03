<template>
  <div class="k-window fit column">
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
        @touchstart.stop
        @mousedown.stop
      />
      <!-- widget header -->
      <KPanel
        v-if="widgetHeader"
        id="widget-header"
        :content="widgetHeader"
        @touchstart.stop
        @mousedown.stop
      />
      <div v-else class="q-px-sm text-subtitle1 ellipsis">
        {{ $tie(widgetLabel) }}
      </div>
      <q-space />
      <!-- window controls -->
      <KPanel
        id="window-controls"
        :content="controls"
        @touchstart.stop
        @mousedown.stop
      />
    </div>
    <!--
      Window content
      -->
    <div class="fit">
      <component
        v-if="widget"
        ref="widgetRef"
        :is="widget.instance"
        v-bind="widget.content"
        :style="widgetStyle"
      />
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
import { ref, computed, watch, provide } from 'vue'
import { useQuasar } from 'quasar'
import { Store, LocalStorage, Layout, utils } from '../..'
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
const currentWindow = Layout.getWindow(props.placement)
const currentMode = ref('pinned')
const widgetRef = ref(null)
const pinIcons = {
  left: 'las la-angle-left',
  right: 'las la-angle-right',
  top: 'las la-angle-up',
  bottom: 'las la-angle-down'
}
let backupPosition
let backupSize
let backupMode

// Provide
provide('widget', widgetRef)

// Computed
const widgets = computed(() => {
  let isCurrentValid = false
  _.forEach(currentWindow.components, (widget) => {
    const componentName = _.get(widget, 'content.component')
    widget.instance = utils.loadComponent(componentName)
    if (currentWindow.current === widget.id) isCurrentValid = true
  })
  if (!isCurrentValid) Layout.setWindowCurrent(props.placement, _.get(widgets, '[0].id'))
  return currentWindow.components
})
const menu = computed(() => {
  const widgetMenuItems = []
  _.forEach(widgets.value, widget => {
    widgetMenuItems.push({
      id: widget.id,
      label: widget.label,
      icon: widget.icon,
      handler: () => { widgetId.value = widget.id }
    })
  })
  const menu = []
  if (widgetMenuItems.length > 1) {
    menu.push({
      id: 'widgets-menu-items',
      component: 'menu/KMenu',
      icon: 'las la-cube',
      size: 'sm',
      tooltip: 'Widgets',
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
    size: 'sm',
    tooltip: 'KWindow.PIN_ACTION',
    class: 'k-window-control',
    visible: currentMode.value === 'floating',
    handler: onPinned
  }, {
    id: 'maximize-action',
    icon: 'las la-expand',
    size: 'sm',
    tooltip: 'KWindow.MAXIMIZE_ACTION',
    visible: currentMode.value !== 'maximized',
    handler: onMaximized
  }, {
    id: 'restore-action',
    icon: 'las la-compress',
    size: 'sm',
    tooltip: 'KWindow.RESTORE_ACTION',
    visible: currentMode.value === 'maximized',
    handler: onRestored
  }, {
    id: 'close-action',
    icon: 'las la-times',
    size: 'sm',
    tooltip: 'KWindow.CLOSE_ACTION',
    handler: onClosed
  }]
})
const widgetId = computed({
  get: function () {
    return currentWindow.current
  },
  set: function (value) {
    Layout.setWindowCurrent(props.placement, value)
  }
})
const widget = computed(() => {
  return _.find(widgets.value, { id: widgetId.value })
})
const widgetLabel = computed(() => {
  if (!widget.value) return ''
  return widget.value.label
})
const widgetHeader = computed(() => {
  if (!widget.value) return null
  let header = _.cloneDeep(widget.value.header)
  header = utils.bindContent(header, widgetRef.value)
  return header
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
    const border = 2
    return `min-width: ${currentWindow.size[0] - border}px;
            max-width: ${currentWindow.size[0] - border}px;
            min-height: ${widgetHeight - border}px;
            max-height: ${widgetHeight - border}px;
            z-index: 1;`
  }
})

// Watch
watch(() => [$q.screen.width, $q.screen.height], (value) => {
  onScreenResized()
})

// Functions
function getGeometryKey () {
  return `windows-${props.placement}-geometry`
}
function storeGeometry (position, size) {
  LocalStorage.set(getGeometryKey(), { position, size })
}
function updateGeomtry (position, size) {
  // Code taken from quasar screen plugin code
  const w = size[0]
  const s = $q.screen.sizes
  // Compute breakpoint
  const window = {
    position,
    size
  }
  const gt = {
    xs: w >= s.sm,
    sm: w >= s.md,
    md: w >= s.lg,
    lg: w >= s.xl
  }
  const lt = {
    sm: w < s.sm,
    md: w < s.md,
    lg: w < s.lg,
    xl: w < s.xl
  }
  const xs = lt.sm
  const sm = gt.xs === true && lt.md === true
  const md = gt.sm === true && lt.lg === true
  const lg = gt.md === true && lt.xl === true
  const xl = gt.lg
  const breakpoint = (xs === true && 'xs') ||
    (sm === true && 'sm') ||
    (md === true && 'md') ||
    (lg === true && 'lg') ||
    'xl'
  Object.assign(window, { xs, sm, md, lg, xl, gt, lt, breakpoint })
  Store.patch(Layout.getElementPath(`windows.${props.placement}`), window)
}
function onPinned () {
  LocalStorage.clear(getGeometryKey())
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
  updateGeomtry(backupPosition, backupSize)
  currentMode.value = backupMode
}
function onClosed () {
  Layout.setWindowVisible(props.placement, false)
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
    Layout.setWindowPosition(props.placement, newPosition)
    if (event.isFinal) storeGeometry(newPosition, currentWindow.size)
  }
}
function onResized (event) {
  if (!event) return
  // Handle the pinned and floating currentMode
  if (currentMode.value !== 'maximized') {
    if (currentMode.value !== 'floating') currentMode.value = 'floating'
    const wMax = $q.screen.width - currentWindow.position[0]
    const hMax = $q.screen.height - currentWindow.position[1]
    const newSize = [
      Math.min(currentWindow.size[0] + event.delta.x, wMax),
      Math.min(currentWindow.size[1] + event.delta.y, hMax)
    ]
    updateGeomtry(currentWindow.position, newSize)
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
    updateGeomtry([x, y], [w, h])
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
        updateGeomtry([x, y], [w, h])
        storeGeometry([x, y], [w, h])
      }
    }
  } else {
    // Maximized mode
    updateGeomtry([0, 0], [$q.screen.width, $q.screen.height])
  }
}

// restore the geometry if needed
const geometry = LocalStorage.get(getGeometryKey())
if (geometry) {
  updateGeomtry(geometry.position, geometry.size)
  currentMode.value = 'floating'
} else {
  onPinned()
}
</script>

<style lang="scss" scoped>
  .k-window {
    border-style: $window-border-style;
    border-width: $window-border-width;
    border-color:  $window-border-color;
    border-radius: $window-border-radius;
    background-color: $window-background;
  }
  .k-window:hover {
    border-color:  $window-hover-border-color;
  }
  .k-window-header {
    border-radius: $window-border-radius $window-border-radius 0 0;
    background-color: $window-header-background;
    cursor: move
  }
  .k-window-header:hover {
    background-color: $window-header-hover-background;
  }
  .k-window-footer {
    border-radius: 0 0 $window-border-radius $window-border-radius;
  }
  .k-window-grip:hover {
    cursor: nwse-resize;
  }
  .q-icon.las.la-expand,
  .q-icon.las-la-compress,
  .q-icon.las.la-times,
  .q-icon.las.la-angle-up,
  .q-icon.las.la-angle-down,
  .q-icon.las.la-angle-left,
  .q-icon.las.la-angle-right {
    font-size: $window-controls-size
  }
</style>
