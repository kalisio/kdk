<template>
  <div v-if="hasContent">
    <q-btn-dropdown
      :id="id"
      :icon="icon"
      :color="color"
      :size="size"
      :dropdown-icon="dropdownIcon"
      :no-icon-animation="!dropdownAnimation"
      :disable="disabled"
      :dense="dense"
      :persistent="persistent"
      :auto-close="autoClose"
      :menu-anchor="direction === 'vertical' ? 'bottom left' : 'bottom middle' "
      menu-self="top left"
      flat
      rounded
      no-caps
      @click="onClicked"
      @before-show="enableTooltip = false"
      @hide="enableTooltip = true"
    >
        <template v-slot:label>
          <div class="row items-center no-wrap">
            <q-badge v-if="badge" v-bind="badge" />
            <div class="text-center">
              {{ $tie(label) }}
            </div>
          </div>
        </template>
        <KPanel
          id="menu-entries"
          :content="content"
          :mode="mode"
          :context="context"
          :filter="filter"
          :action-renderer="actionRenderer"
          :direction="direction"
          class="no-wrap"
        />
    </q-btn-dropdown>
    <q-tooltip v-if="enableTooltip && tooltip">
      {{ tooltip }}
    </q-tooltip>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { i18n } from '../../i18n.js'
import KPanel from '../KPanel.vue'

// Props
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: undefined
  },
  color: {
    type: String,
    default: 'grey-9'
  },
  size: {
    type: String,
    default: 'md'
  },
  tooltip: {
    type: String,
    default: undefined
  },
  dropdownIcon: {
    type: String,
    default: undefined
  },
  dropdownAnimation: {
    type: Boolean,
    default: true
  },
  badge: {
    type: Object,
    default: () => null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  persistent: {
    type: Boolean,
    default: false
  },
  propagate: {
    type: Boolean,
    default: true
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
    default: 'button',
    validator: (value) => {
      return ['button', 'item'].includes(value)
    }
  }
})

// Data
const enableTooltip = ref(true)

// Computed
const hasContent = computed(() => {
  return !_.isEmpty(props.content)
})
const tooltip = computed(() => {
  // Check for translation key or already translated message
  return i18n.tie(props.tooltip)
})

// Functions
function onClicked (event) {
  if (!props.propagate) event.stopPropagation()
}
</script>

<style lang="scss">
.q-btn-dropdown__arrow {
  margin-left: 0px !important;
}
</style>
