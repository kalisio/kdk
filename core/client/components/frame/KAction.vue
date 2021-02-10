<template>
  <!--
    Button renderer
   -->
  <q-btn v-if="renderer === 'button'"
    :id="id"
    :label="$q.screen.gt.xs ? $t(computedLabel) : ''"
    no-caps
    :icon="computedIcon"
    :color="computedColor"
    :size="size"
    :flat="flat"
    :round="label===''"
    :rounded="label!==''"
    :dense="dense"
    :disabled="disabled"
    @click="onClicked()">
    <!-- tooltip -->
    <q-tooltip v-if="computedTooltip">
      {{ $t(computedTooltip) }}
    </q-tooltip>
    <!-- badge -->
    <q-badge v-if="badge" v-bind="badge">
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
      <q-icon :dense="dense" :name="computedIcon" :color="computedColor" />
      <!-- badge -->
      <q-badge v-if="badge" v-bind="badge">
        <q-icon v-if="badge.icon" v-bind="badge.icon" />
      </q-badge>
    </q-item-section>
    <q-item-section>
      {{ $t(computedLabel) }}
    </q-item-section>
  </q-item>
  <!--
  Fab renderer
  -->
  <q-fab-action v-else-if="renderer === 'fab'"
    :id="id"
    no-caps
    :icon="computedIcon"
    :color="computedColor"
    :label="$t(computedLabel)"
    external-label
    label-position="left"
    :disabled="disabled"
    @click="onClicked()">
    <!-- badge -->
    <q-badge v-if="badge" v-bind="badge">
      <q-icon v-if="badge.icon" v-bind="badge.icon" />
    </q-badge>
  </q-fab-action>
</template>

<script>
import _ from 'lodash'
import { openURL } from 'quasar'

export default {
  name: 'k-action',
  props: {
    id: {
      type: String,
      required: true
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
      type: Object,
      default: () => { return null }
    },
    label: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: ''
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
      default: null
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
  watch: {
    toggled: function (value) {
      this.isToggled = value
    }
  },
  computed: {
    dense () {
      return this.$q.screen.lt.sm
    },
    computedLabel () {
      if (this.isToggled && this.toggle.label) return this.toggle.label
      return this.label
    },
    computedIcon () {
      if (this.isToggled && this.toggle.icon) return this.toggle.icon
      return this.icon
    },
    computedColor () {
      if (this.isToggled) return this.toggle.color || 'secondary'
      return this.color
    },
    computedTooltip () {
      // When toggled send back the toggled tooltip
      // Check also for translation key or already translated message
      if (this.isToggled && this.toggle.tooltip) {
        return (this.$i18n.i18next.exists(this.toggle.tooltip) ? this.$t(this.toggle.tooltip) : this.toggle.tooltip)
      } else {
        return (this.$i18n.i18next.exists(this.tooltip) ? this.$t(this.tooltip) : this.tooltip)
      }
    }
  },
  methods: {
    bindRouteParams (path) {
      // When action is created from code we can directly inject the params
      // From the config we we need to manage dynamic values
      // Clone route context to avoid losing dynamic parameters in this case
      const currentParams = _.get(this.$route, path, {})
      const targetParams = _.get(this.route, path, {})
      // A parameter like ':xxx' in config means xxx is a dynamic property of the route, not a static value
      // We split the target params object into two sets: one with static keys and one with dynamic keys
      const staticParams = Object.entries(targetParams)
        .filter(([key, value]) => (typeof value !== 'string') || !value.startsWith(':'))
        .map(([key, value]) => key)
      const dynamicParams = Object.entries(targetParams)
        .filter(([key, value]) => (typeof value === 'string') && value.startsWith(':'))
        .map(([key, value]) => key)
      // Merge static/dynamic params to build full list
      return Object.assign({}, _.pick(targetParams, staticParams), _.pick(currentParams, dynamicParams))
    },
    onClicked () {
      const params = []
      // Handle the context if needed
      if (this.context) params.push(this.context)
      // Handle the toggle if needed
      if (this.toggle) {
        this.isToggled = !this.isToggled
        params.push(this.isToggled)
      }
      // Handle the URL case
      if (this.url) openURL(this.url)
      // Handle the route case
      else if (this.route) {
        // Process route params
        this.$router.push(Object.assign({
          query: this.bindRouteParams('query'),
          params: this.bindRouteParams('params')
        }, _.omit(this.route, ['query', 'params']))).catch(() => {})
      }
      // Handle the callback case
      else if (this.handler) {
        if (params.length > 0) this.handler(...params)
        else this.handler()
      }
      // Notifie the listeners
      if (params.length > 0) this.$emit('triggered', ...params)
      else this.$emit('triggered')
    }
  }
}
</script>
