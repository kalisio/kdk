<template>
  <k-action
    v-if="hasContent"
    :id="id"
    :label="label"
    :icon="icon"
    :color="color"
    :size="size"
    :toggle="toggle"
    :toggled="toggled"
    :disabled="disabled"
    :badge="badge"
    :tooltip="tooltip">
    <template v-slot:content>
      <q-popup-proxy
        :persistent="persistent"
        :auto-close="autoClose">
        <k-panel
          id="menu-entries"
          :content="content"
          :mode="mode"
          :context="context"
          :action-renderer="actionRenderer"
          direction="vertical" />
      </q-popup-proxy>
    </template>
  </k-action>
</template>

<script>
import _ from 'lodash'
import KAction from './KAction.vue'

export default {
  components: { KAction },
  name: 'k-menu',
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
    badge: {
      type: Object,
      default: () => null
    },
    toggle: {
      type: Object,
      default: () => null
    },
    toggled: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: String,
      default: ''
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
    hasContent () {
      return !_.isEmpty(this.content)
    }
  },
  created () {
    // load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  }
}
</script>
