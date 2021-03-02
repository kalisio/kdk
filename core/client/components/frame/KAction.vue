<template>
  <!--
    Button renderer
   -->
  <q-btn v-if="renderer === 'button'"
    :id="id"
    :label="$q.screen.gt.xs ? computedLabel : ''"
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
      {{ computedTooltip }}
    </q-tooltip>
    <!-- badge -->
    <q-badge v-if="badge" v-bind="badge" :label="computedBadgeLabel">
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
      <q-badge v-if="badge" v-bind="badge" :label="computedBadgeLabel">
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
    :label="computedLabel"
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
      default: () => null
    },
    handler: {
      type: [Function],
      default: null
    },
    route: {
      type: [Object],
      default: () => null
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
      // Check also for translation key or already translated message
      if (this.isToggled && this.toggle.label) {
        return (this.$i18n.i18next.exists(this.toggle.label) ? this.$t(this.toggle.label) : this.toggle.label)
      } else {
        return (this.$i18n.i18next.exists(this.label) ? this.$t(this.label) : this.label)
      }
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
      // Check also for translation key or already translated message
      if (this.isToggled && this.toggle.tooltip) {
        return (this.$i18n.i18next.exists(this.toggle.tooltip) ? this.$t(this.toggle.tooltip) : this.toggle.tooltip)
      } else {
        return (this.$i18n.i18next.exists(this.tooltip) ? this.$t(this.tooltip) : this.tooltip)
      }
    },
    computedBadgeLabel () {
      // Check also for translation key or already translated message
      if (this.badge && this.badge.label) {
        return (this.$i18n.i18next.exists(this.badge.label) ? this.$t(this.badge.label) : this.badge.label)
      }
      return null
    }
  },
  methods: {
    bindRouteParams (path) {
      // When action is created from code we can directly inject the params
      // However, when created from the config we need to manage dynamic values
      // Clone route context to avoid losing dynamic parameters in this case
      const currentParams = _.get(this.$route, path, {})
      const targetParams = _.get(this.route, path, {})
      // A parameter like ':xxx' in config means xxx is a dynamic property of the route or the context object, not a static value
      // We split the target params object into two sets: one with static keys and one with dynamic keys
      const staticParams = Object.entries(targetParams)
        .filter(([key, value]) => (typeof value !== 'string') || !value.startsWith(':'))
        .map(([key, value]) => key)
      // Take care that for dynamic parameters we might have a mapping,
      // eg context: ':item._id', so we need to keep both key and value
      const dynamicParams = Object.entries(targetParams)
        .filter(([key, value]) => (typeof value === 'string') && value.startsWith(':'))
        .map(([key, value]) => [key, value.substring(1)])
      // Merge static/dynamic params to build full list
      const params = _.pick(targetParams, staticParams)
      dynamicParams.forEach(([key, value]) => {
        // If dynamic param is not available in route use this context
        if (_.has(currentParams, value)) _.set(params, key, _.get(currentParams, value))
        else _.set(params, key, _.get(this.context, value))
      })
      return params
    },
    onClicked () {
      // Handle the toggle if needed
      if (this.toggle) {
        this.isToggled = !this.isToggled
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
      } else if (this.handler) {
        // Handle the callback case
        this.handler(this.context, this.isToggled)
      }
      // Notify the listeners
      this.$emit('triggered', this.context, this.isToggled)
    }
  }
}
</script>
