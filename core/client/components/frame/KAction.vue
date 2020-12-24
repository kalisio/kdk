<template>
  <q-btn 
    :label="label"
    :icon="icon"
    :color="isToggled ? 'secondary' : color"
    :size="size"
    :flat="!isToggled"
    :outline="isToggled"
    :round="label===''"
    :rounded="label!==''"
    :dense="dense"
    @click="onClicked()">
    <!-- tooltip -->
    <q-tooltip v-if="tooltip">
      {{ tooltip }}
    </q-tooltip>
    <!-- badge -->
    <q-badge v-if="badge" class="q-py-xs" v-bind="badge">
      <q-icon v-if="badge.icon" v-bind="badge.icon" />
    </q-badge>
  </q-btn>
</template>

<script>
export default {
  name: 'k-action',
  props: {
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: ''
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
      default: () => { return null }
    },
    toggle: {
      type: Boolean,
      default: false
    },
    toggled: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    handler: {
      type: [Function, Object]
    }
  },
  data () {
    return {
      isToggled: this.toggled
    }
  },
  methods: {
    onClicked () {
      // Handle the toggle if any
      if (this.toggle) this.isToggled=!this.isToggled
      // If the handler is a function call it
      if (typeof this.handler === 'function') this.handler(this.context, this.isToggled)
      // If the handler is a string call the router
      else if (typeof this.handler === 'object') this.$router.push(this.handler)
      else console.log('fuck')
    }
  }
}
</script>
