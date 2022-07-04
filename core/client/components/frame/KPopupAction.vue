<template>
  <KAction
    v-if="hasContent"
    :id="id"
    :label="label"
    :icon="icon"
    :color="color"
    :size="size"
    :toggle="toggle"
    :toggled="toggled"
    :disabled="disabled"
    :propagate="propagate"
    :badge="badge"
    :tooltip="tooltip">
      <q-popup-proxy
        fit
        :persistent="$q.screen.gt.xs ? persistent : false"
        :auto-close="autoClose"
        transition-show="scale"
        transition-hide="scale">
        <KPanel
          id="menu-entries"
          class="bg-white"
          :content="content"
          :mode="mode"
          :context="context"
          :action-renderer="actionRenderer"
          direction="vertical"
        />
      </q-popup-proxy>
  </KAction>
</template>

<script>
import _ from 'lodash'
import KAction from './KAction.vue'
import KPanel from './KPanel.vue'

export default {
  components: {
    KAction,
    KPanel
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
  }
}
</script>
