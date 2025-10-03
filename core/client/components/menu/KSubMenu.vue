<template>
  <div v-hover="{ enter: onShowMenu, leave: onHideMenuRequested }">
    <KAction v-bind="props">
      <q-menu
        v-model="showMenu"
        :anchor="anchor"
        :self="self"
        :offset="offset"
        :persistent="persistent"
        :auto-close="autoClose">
        <div v-hover="{ enter: onShowMenu, leave: onHideMenuRequested }">
          <div class="row">
            <KPanel
              id="submenu-entries"
              :content="content"
              :mode="mode"
              :context="context"
              :filter="filter"
              :action-renderer="actionRenderer"
              :direction="direction"
              class="no-wrap"
            />
          </div>
        </div>
      </q-menu>
    </KAction>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { actionProps } from '../../utils/utils.actions.js'
import KAction from '../action/KAction.vue'

// Props
const props = defineProps(Object.assign({
  anchor: {
    type: String,
    default: 'bottom right'
  },
  self: {
    type: String,
    default: 'bottom left'
  },
  offset: {
    type: Array,
    default: () => [0, 0]
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  persistent: {
    type: Boolean,
    default: false
  },
  content: {
    type: [Object, Array],
    default: () => null
  },
  mode: {
    type: String,
    default: undefined
  },
  filter: {
    type: Object,
    default: () => {}
  },
  context: {
    type: Object,
    default: () => null
  },
  direction: {
    type: String,
    default: () => 'vertical'
  },
  actionRenderer: {
    type: String,
    default: 'item',
    validator: (value) => {
      return ['button', 'item'].includes(value)
    }
  }
}, actionProps))

// Data
const showMenu = ref(false)
let hideMenuRequested = false

// Functions
function onShowMenu () {
  hideMenuRequested = false
  showMenu.value = true
}
// As we'd like to automatically hide the menu when leaving the "parent" action and not selecting anything in the submenu
// but we'd like to keep it open if the user wants to select something in the submenu, we are using the enter/leave mouse events to show/hide the menu.
// The problem is that when leaving the parent action to move to the submenu the leave/enter events might not be received in the right order.
// The trick is to add a small delay to the hide menu action so that if meanwhile the user enters the submenu the show menu action will override it.
function onHideMenuRequested () {
  hideMenuRequested = true
  setTimeout(() => {
    if (hideMenuRequested) showMenu.value = false
  }, 250)
}
</script>
