<template>
  <q-btn-dropdown
    v-if="hasContent"
    :id="id"
    :label="$t(label)"
    :icon="icon"
    :color="color"
    :size="size"
    :dropdown-icon="dropdownIcon"
    :disable="disabled"
    :dense="dense"
    :persistent="persistent"
    :auto-close="autoClose"
    menu-anchor="bottom left"
    menu-self="top left"
    flat
    no-caps
    fab-mini
    @click="onClicked">
    <KPanel
      id="menu-entries"
      :content="content"
      :mode="mode"
      :context="context"
      :action-renderer="actionRenderer"
      direction="vertical"
    />
  </q-btn-dropdown>
</template>

<script>
import _ from 'lodash'
import KPanel from '../frame/KPanel.vue'

export default {
  components: {
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
      default: ''
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
  methods: {
    onClicked (event) {
      if (!this.propagate) event.stopPropagation()
    }
  }
}
</script>

<style lang="scss">
  .q-btn-dropdown__arrow {
    margin-left: 0px !important;
  }
</style>
