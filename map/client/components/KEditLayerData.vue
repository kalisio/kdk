<template>
  <k-action v-bind="$props" :toggled="isToggled" />
</template>

<script>
import KAction from '../../../core/client/components/action/KAction.vue'

export default {
  name: 'k-edit-layer-data',
  components: {
    KAction
  },
  inject: ['kActivity'],
  props: {
    id: {
      type: String,
      required: true
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
    flat: {
      type: Boolean,
      default: true
    },
    outline: {
      type: Boolean,
      default: false
    },
    badge: {
      type: Object,
      default: () => null
    },
    toggle: {
      type: Object,
      default: () => null
    },
    label: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    context: {
      type: Object,
      default: () => null
    },
    handler: {
      type: [Function],
      default: null
    },
    renderer: {
      type: String,
      default: 'button',
      validator: (value) => {
        return ['button', 'form-button', 'item', 'fab'].includes(value)
      }
    }
  },
  computed: {
    isToggled () {
      return this.kActivity.isLayerEdited(this.context)
    }
  }
}
</script>
