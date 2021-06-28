<template>
  <q-btn-dropdown
    v-if="hasContent"
    :id="id"
    :label="$t(label)"
    :icon="icon"
    :color="color"
    :size="size"
    :disable="disabled"
    :dense="dense"
    :persistent="persistent"
    :auto-close="autoClose"
    menu-anchor="bottom left"
    menu-self="top left"
    flat
    no-caps
    fab-mini>
    <k-panel
      id="menu-entries"
      :content="content"
      :mode="mode"
      :context="context"
      :action-renderer="actionRenderer"
      direction="vertical" />
  </q-btn-dropdown>
</template>

<script>
import _ from 'lodash'
import { QBtnDropdown } from 'quasar'

export default {
  name: 'k-action-popup',
  components: {
    QBtnDropdown
  },
  props: {
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
      default: 'las la-ellipsis-v'
    },
    color: {
      type: String,
      default: 'grey-9'
    },
    size: {
      type: String,
      default: 'md'
    },
    disabled: {
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
    content: {
      type: [Object, Array],
      default: () => null
    },
    mode: {
      type: String,
      default: undefined
    },
    context: {
      type: Object,
      default: () => null
    },
    actionRenderer: {
      type: String,
      default: 'button',
      validator: (value) => {
        return ['button', 'item'].includes(value)
      }
    }
  },
  computed: {
    dense () {
      return this.$q.screen.lt.sm
    },
    hasContent () {
      return !_.isEmpty(this.content)
    }
  },
  created () {
    // load the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  }
}
</script>
