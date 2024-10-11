<template>
  <div v-if="hasGeometry" class="k-window column">
    <!--
      Window header
     -->
    <div
      :id="`${placement}-window-header`"
      class="k-window-header full-width row items-center"
      v-touch-pan.prevent.mouse="onMoved"
    >
      <q-resize-observer @resize="onWindowHeaderResized" />
      <!-- window menu -->
      <KPanel
        v-if="currentWindow.controls.menu"
        :id="`${placement}-window-menu`"
        :content="menu"
        @touchstart.passive.stop
        @mousedown.passive.stop
      />
      <!-- widget header -->
      <KPanel
        v-if="widgetHeader"
        id="widget-header"
        :content="widgetHeader"
      />
      <div
        v-else-if="widgetLabel"
        class="q-px-sm text-subtitle1 ellipsis"
      >
        {{ $tie(widgetLabel) }}
      </div>
      <q-space />
      <!-- window controls -->
      <KMenu
        v-if="currentWindow.xs"
        id="window-controls"
        dropdown-icon="las la-ellipsis-h"
        size="sm"
        dense
        direction="horizontal"
        action-renderer="button"
        :content="headerControls"
        class="q-pr-xs"
      />
      <KPanel
        v-else
        id="window-controls"
        :content="headerControls"
      />
    </div>
    <!--
      Window content
      -->
    <div v-if="widget">
      <KScrollArea v-if="widget.scrollable"
        :maxHeight="widgetHeight"
        :style="`min-width: ${widgetWidth}px; max-width: ${widgetWidth}px;`"
      >
        <component
          :id="`${placement}-window-content`"
          ref="widgetRef"
          :is="widget.instance"
          v-bind="widget.content"
          :style="`min-width: ${widgetWidth}px; max-width: ${widgetWidth}px; min-height: ${widgetHeight}px`"
        />
      </KScrollArea>
      <component v-else
        :id="`${placement}-window-content`"
        ref="widgetRef"
        :is="widget.instance"
        v-bind="widget.content"
        :style="`min-width: ${widgetWidth}px; max-width: ${widgetWidth}px; min-height: ${widgetHeight}px; max-height: ${widgetHeight}px`"
      />
    </div>
    <!--
      Window footer
     -->
    <div
      :id="`${placement}-window-footer`"
      class="k-window-footer full-width row justify-end"
    >
      <q-resize-observer @resize="onWindowFooterResized" />
      <!-- window grip -->
      <q-icon
        v-if="currentWindow.controls.resize && currentWindow.state !== 'maximized'"
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
import { ref, computed, watch, provide } from 'vue'
import { useQuasar } from 'quasar'
import { Store } from '../../store.js'
import { LocalStorage } from '../../local-storage.js'
import { Layout } from '../../layout.js'
import { loadComponent, bindContent, computeResponsiveSize } from '../../utils'
import KPanel from '../KPanel.vue'
import KScrollArea from '../KScrollArea.vue'
import KMenu from '../menu/KMenu.vue'

// Props
const props = defineProps({
  placement: {
    type: String,
    required: true,
    validator: (value) => {
      return ['left', 'right', 'top', 'bottom'].includes(value)
    }
  },
  layoutOffset: {
    type: Number,
    default: 0
  }
})

// Data
const $q = useQuasar()
const header = Layout.getHeader()
const footer = Layout.getFooter()
const currentWindow = Layout.getWindow(props.placement)
const windowHeaderHeight = ref(0)
const windowFooterHeight = ref(0)
const widgetRef = ref(null)
const pinIcons = {
  left: 'las la-angle-left',
  right: 'las la-angle-right',
  top: 'las la-angle-up',
  bottom: 'las la-angle-down'
}
const unpinIcons = {
  left: 'las la-angle-right',
  right: 'las la-angle-left',
  top: 'las la-angle-down',
  bottom: 'las la-angle-up'
}
const border = 2

// Provide
provide('widget', widgetRef)

// Computed
const widgets = computed(() => {
  let isCurrentValid = false
  _.forEach(currentWindow.components, (widget) => {
    const componentName = _.get(widget, 'content.component')
    widget.instance = loadComponent(componentName)
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
      id: `${props.placement}-window-menu`,
      component: 'menu/KMenu',
      icon: 'las la-cube',
      dense: true,
      tooltip: 'Widgets',
      actionRenderer: 'item',
      content: widgetMenuItems
    })
  }
  return menu
})
const headerControls = computed(() => {
  return [{
    id: `pin-${props.placement}-window`,
    icon: pinIcons[props.placement],
    size: 'sm',
    tooltip: 'KWindow.PIN_ACTION',
    class: 'k-window-control',
    visible: currentWindow.controls.pin && currentWindow.state === 'floating',
    handler: () => Layout.setWindowState(props.placement, 'pinned')
  }, {
    id: `unpin-${props.placement}-window`,
    icon: unpinIcons[props.placement],
    size: 'sm',
    tooltip: 'KWindow.RESTORE_ACTION',
    class: 'k-window-control',
    visible: currentWindow.controls.unpin && currentWindow.state === 'pinned' && restoreGeometry,
    handler: () => Layout.setWindowState(props.placement, 'floating')
  }, {
    id: `maximize-${props.placement}-window`,
    icon: 'las la-expand',
    size: 'sm',
    tooltip: 'KWindow.MAXIMIZE_ACTION',
    visible: currentWindow.controls.maximize && currentWindow.state !== 'maximized',
    handler: () => Layout.setWindowState(props.placement, 'maximized')
  }, {
    id: `restore-${props.placement}-window`,
    icon: 'las la-compress',
    size: 'sm',
    tooltip: 'KWindow.RESTORE_ACTION',
    visible: currentWindow.controls.restore && currentWindow.state === 'maximized',
    handler: () => Layout.setWindowState(props.placement, LocalStorage.get(getStorageKey('restore-state')) || 'pinned')
  }, {
    id: `close-${props.placement}-window`,
    icon: 'las la-times',
    size: 'sm',
    tooltip: 'KWindow.CLOSE_ACTION',
    visible: currentWindow.controls.close,
    handler: () => Layout.setWindowVisible(props.placement, false)
  }]
})
const hasGeometry = computed(() => {
  return currentWindow.position && currentWindow.size
})
const widget = computed(() => {
  return _.find(widgets.value, { id: widgetId.value })
})
const widgetId = computed({
  get: function () {
    return currentWindow.current
  },
  set: function (value) {
    Layout.setWindowCurrent(props.placement, value)
  }
})
const widgetLabel = computed(() => {
  if (!widget.value) return undefined
  return widget.value.label
})
const widgetHeader = computed(() => {
  if (!widget.value) return null
  let header = _.cloneDeep(widget.value.header)
  header = bindContent(header, widgetRef.value)
  return header
})
const widgetWidth = computed(() => {
  return currentWindow.size[0] - border
})
const widgetHeight = computed(() => {
  return currentWindow.size[1] - windowHeaderHeight.value - windowFooterHeight.value
})

// Watch
watch(() => [$q.screen.width, $q.screen.height], (value) => onScreenResized())
watch(() => currentWindow.state, (newState, oldState) => refresh(newState, oldState))

// Functions
function getStorageKey (element) {
  return `windows-${props.placement}-${element}`
}
function writeState () {
  LocalStorage.set(getStorageKey('state'), currentWindow.state)
}
function readState () {
  return LocalStorage.get(getStorageKey('state'))
}
function storeGeometry () {
  LocalStorage.set(getStorageKey('geometry'), { position: currentWindow.position, size: currentWindow.size })
}
function restoreGeometry () {
  return LocalStorage.get(getStorageKey('geometry'))
}
function refresh (newState, oldState) {
  switch (newState) {
    case 'pinned': {
      LocalStorage.clear(getStorageKey('restore-state'))
      writeState()
      setPinnedGeometry()
      break
    }
    case 'maximized': {
      if (oldState) LocalStorage.set(getStorageKey('restore-state'), oldState)
      writeState()
      setMaximizedGeometry()
      break
    }
    case 'floating': {
      LocalStorage.clear(getStorageKey('restore-state'))
      writeState()
      const geometry = restoreGeometry()
      if (geometry) {
        updateGeometry(geometry.position, geometry.size, true)
      } else {
        const position = currentWindow.sizePolicy.floating.position
        const size = currentWindow.sizePolicy.floating.size
        updateGeometry(position, size, true)
      }
      break
    }
    default:
      logger.error(`[KDK] invalid window state ${currentWindow.state}`)
  }
}
function setPinnedGeometry () {
  const size = computeResponsiveSize(currentWindow.sizePolicy.pinned)
  let x, y
  if (props.placement === 'top' || props.placement === 'bottom') {
    x = $q.screen.width / 2 - size[0] / 2
    y = props.placement === 'top' ? 0 : $q.screen.height - size[1]
  } else {
    x = props.placement === 'left' ? 0 : $q.screen.width - size[0]
    y = $q.screen.height / 2 - size[1] / 2
  }
  updateGeometry([x, y], size)
}
function setMaximizedGeometry () {
  let height = $q.screen.height
  if (header.visible) height -= header.size[1]
  if (footer.visible) height -= footer.size[1]
  updateGeometry([0, 0], [$q.screen.width, height])
}
function updateGeometry (position, size, check = false) {
  // check geometry
  if (check) {
    const pageHeight = $q.screen.height - props.layoutOffset
    const pageWidth = $q.screen.width
    const w = Math.min(Math.max(size[0], currentWindow.sizePolicy.minSize[0]), pageWidth)
    const h = Math.min(Math.max(size[1], currentWindow.sizePolicy.minSize[1]), pageHeight)
    const x = Math.max(Math.min(position[0], pageWidth - w), 0)
    const y = Math.max(Math.min(position[1], pageHeight - h), 0)
    position = [x, y]
    size = [w, h]
  }
  // compute breakpoints
  // Code taken from quasar screen plugin code
  const w = size[0]
  const s = $q.screen.sizes
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
  const window = { position, size, xs, sm, md, lg, xl, gt, lt, breakpoint }
  Store.patch(Layout.getElementPath(`windows.${props.placement}`), window)
}
function onMoved (event) {
  if (!event) return
  if (currentWindow.state !== 'maximized') {
    // Set Focus
    Layout.setFocus(`windows.${props.placement}`)
    // Update geometry
    if (currentWindow.state !== 'floating') {
      storeGeometry()
      Layout.setWindowState(props.placement, 'floating')
    }
    const xMax = $q.screen.width - currentWindow.size[0]
    const yMax = $q.screen.height - props.layoutOffset - currentWindow.size[1]
    const newPosition = [
      Math.max(Math.min(Math.floor(currentWindow.position[0] + event.delta.x), xMax), 0),
      Math.min(Math.max(Math.floor(currentWindow.position[1] + event.delta.y), 0), yMax)
    ]
    updateGeometry(newPosition, currentWindow.size)
    if (event.isFinal) storeGeometry()
  }
}
const onResized = _.throttle((event) => {
  if (!event) return
  // Set Focus
  Layout.setFocus(`windows.${props.placement}`)
  // Handle the pinned and floating currentState
  if (currentWindow.state !== 'maximized') {
    if (currentWindow.state !== 'floating') {
      storeGeometry()
      Layout.setWindowState(props.placement, 'floating')
    }
    const wMax = $q.screen.width - currentWindow.position[0]
    const hMax = $q.screen.height - props.layoutOffset - currentWindow.position[1]
    const newSize = [
      Math.min(Math.max(currentWindow.size[0] + event.delta.x, currentWindow.sizePolicy.minSize[0]), wMax),
      Math.min(Math.max(currentWindow.size[1] + event.delta.y, currentWindow.sizePolicy.minSize[1]), hMax)
    ]
    updateGeometry(currentWindow.position, newSize)
    if (event.isFinal) storeGeometry()
  }
}, 5)
const onScreenResized = _.throttle(() => {
  if (currentWindow.state === 'pinned') setPinnedGeometry()
  else if (currentWindow.state === 'maximized') setMaximizedGeometry()
  else updateGeometry(currentWindow.position, currentWindow.size, true)
}, 50)
function onWindowHeaderResized (size) {
  windowHeaderHeight.value = size.height
}
function onWindowFooterResized (size) {
  windowFooterHeight.value = size.height
}

// restore the state
const currentState = currentWindow.state
if (currentState) refresh(currentState)
else {
  const fallbackState = readState() || 'pinned'
  Layout.setWindowState(props.placement, fallbackState)
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
    height: v-bind(windowFooterHeight)px;
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
