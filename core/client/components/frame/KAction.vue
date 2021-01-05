<template>
  <q-btn 
    :id="id"
    :label="$q.screen.gt.xs ? label : ''"
    no-caps
    :icon="icon"
    :color="isToggled ? 'secondary' : color"
    :size="size"
    :flat="!isToggled"
    :outline="isToggled"
    :round="label===''"
    :rounded="label!==''"
    :dense="$q.screen.lt.md"
    :disabled="!handler"
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
import logger from 'loglevel'

export default {
  name: 'k-action',
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
    context: {
      type: Object,
      default: () => { return null }
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
      // If the handler is a route object call the router
      else if (typeof this.handler === 'object') this.$router.push(this.handler)
      else logger.debug('Invalid handler', this.handler)
    }
  }
}
</script>
