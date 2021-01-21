<template>
  <!--
    Button renderer
   -->
  <q-btn v-if="renderer === 'button'"
    :id="id"
    :label="$q.screen.gt.xs ? $t(label) : ''"
    no-caps
    :icon="icon"
    :color="isToggled ? 'secondary' : color"
    :size="size"
    flat
    :round="label===''"
    :rounded="label!==''"
    :dense="dense"
    :disabled="disabled"
    @click="onClicked()">
    <!-- tooltip -->
    <q-tooltip v-if="tooltip">
      {{ $t(tooltip) }}
    </q-tooltip>
    <!-- badge -->
    <q-badge v-if="badge" class="q-py-xs" v-bind="badge">
      <q-icon v-if="badge.icon" v-bind="badge.icon" />
    </q-badge>
  </q-btn>
  <!--
    Item renderer
   -->
  <q-item v-else-if="renderer === 'item'"
    :id="id" clickable
    :dense="dense"
    :disabled="disabled"
    @click="onClicked()">
    <q-item-section avatar>
      <q-icon :dense="dense" :name="icon" />
      <!-- badge -->
      <q-badge v-if="badge" v-bind="badge">
        <q-icon v-if="badge.icon" v-bind="badge.icon" />
      </q-badge>
    </q-item-section>
    <q-item-section>
      {{ $t(label) }}
    </q-item-section>
  </q-item>
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
    disabled: {
      type: Boolean,
      default: false
    },
    context: {
      type: Object,
      default: () => { return null }
    },
    status: {
      type: [Function],
      default: () => { return null }
    },
    handler: {
      type: [Function],
      default: null
    },
    route: {
      type: [Object],
      default: () => { return null }
    },
    renderer: {
      type: String,
      default: 'button',
      validator: (value) => {
        return ['button', 'item'].includes(value)
      }
    }
  },
  data () {
    return {
      isToggled: this.toggled
    }
  },
  computed: {
    dense () {
      return this.$q.screen.lt.md
    }
  },
  methods: {
    onClicked () {
      // Handle the toggle if any
      if (this.toggle) this.isToggled = !this.isToggled
      // If it has an handler call it
      if (this.handler) this.handler(this.context)
      // If it is a route update the router
      // TODO: is there any better solution to avoid redundant navigation
      else if (this.route) this.$router.push(this.route).catch(() => {})
      // Otherwise log a comment
      else logger.debug(`Invalid action ${this.id}: you should define an handler or a route`)
    }
  }
}
</script>
