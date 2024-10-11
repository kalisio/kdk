<template>
  <q-btn-dropdown
    v-if="hasContent"
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
    @click="onClicked">
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
        :action-renderer="actionRenderer"
        :direction="direction"
        class="no-wrap"
      />
  </q-btn-dropdown>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
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

// Computed
const hasContent = computed(() => {
  return !_.isEmpty(props.content)
})

// Functions
function onClicked (event) {
  if (!props.propagate) event.stopPropagation()
}
</script>

<style lang="scss" scoped>
.q-btn {
  padding: 4px 6px 4px 2px;
}
.q-btn-dropdown__arrow {
  margin-left: 0px !important;
}
</style>
