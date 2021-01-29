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
    :flat="flat"
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
    <!-- extra content -->
    <slot name="content">
    </slot>
  </q-btn>
  <!--
    Item renderer
   -->
  <q-item v-else-if="renderer === 'item'"
    :id="id" 
    clickable
    :dense="dense"
    :disabled="disabled"
    @click="onClicked()">
    <q-item-section avatar>
      <q-icon :dense="dense" :name="icon" :color="color" />
      <!-- badge -->
      <q-badge v-if="badge" v-bind="badge">
        <q-icon v-if="badge.icon" v-bind="badge.icon" />
      </q-badge>
    </q-item-section>
    <q-item-section>
      {{ $t(label) }}
    </q-item-section>
  </q-item>
  <!--
  Fab renderer
  -->
  <q-fab-action v-else-if="renderer === 'fab'"
    :id="id"
    no-caps
    :icon="icon"
    :color="isToggled ? 'secondary' : color"
    :label="$t(label)"
    external-label
    label-position="left"
	
    :disabled="disabled"
    @click="onClicked()">
    <!-- badge -->
    <q-badge v-if="badge" class="q-py-xs" v-bind="badge">
      <q-icon v-if="badge.icon" v-bind="badge.icon" />
    </q-badge>
  </q-fab-action>
</template>

<script>
import { openURL } from 'quasar'

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
    tooltip: {
      type: String,
      default: ''
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
    url: {
      type: String,
      default: null,
    },
    renderer: {
      type: String,
      default: 'button',
      validator: (value) => {
        return ['button', 'item', 'fab'].includes(value)
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
      return this.$q.screen.lt.sm
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
      // If it an URL then open the link
      else if (this.url) openURL(this.url)
      // Otherwise log a comment
      this.$emit('triggered')
    }
  }
}
</script>
