<template>
  <!--
    Button renderer
   -->
  <q-btn v-if="renderer === 'button'"
    :id="id"
    no-caps
    no-wrap
    :color="computedColor"
    :icon="computedIcon"
    :size="size"
    flat
    :round="label===''"
    :rounded="label!==''"
    :dense="dense"
    :disable="disabled"
    @click="onClicked(arguments[0])">
    <!-- label -->
    <div v-if="computedLabel" class="ellipsis q-pl-md">
      {{ computedLabel }}
    </div>
    <!-- tooltip -->
    <q-tooltip v-if="computedTooltip">
      {{ computedTooltip }}
    </q-tooltip>
    <!-- badge -->
    <q-badge v-if="badge" v-bind="badge" :label="computedBadgeLabel">
      <q-icon v-if="badge.icon" v-bind="badge.icon" />
    </q-badge>
    <!-- extra content -->
    <slot>
    </slot>
  </q-btn>
  <!--
    Form button renderer
   -->
  <q-btn v-else-if="renderer === 'form-button'"
    :id="id"
    no-wrap
    color="primary"
    :outline="outline"
    :size="size"
    :dense="dense"
    :disable="disabled"
    :loading="loading"
    @click="onClicked(arguments[0])">
    <div class="ellipsis">
      {{ computedLabel }}
    </div>
  </q-btn>
  <!--
    Item renderer
   -->
  <q-item v-else-if="renderer === 'item'"
    :id="id"
    clickable
    :dense="dense"
    :disable="disabled"
    @click="onClicked(arguments[0])">
    <q-item-section v-if="computedIcon || badge" avatar>
      <q-icon v-if="computedIcon" :name="computedIcon" :color="computedColor" :dense="dense" />
      <!-- badge -->
      <q-badge v-if="badge" v-bind="badge" :label="computedBadgeLabel">
        <q-icon v-if="badge.icon" v-bind="badge.icon" />
      </q-badge>
    </q-item-section>
    <q-item-section no-wrap>
      {{ computedLabel }}
    </q-item-section>
  </q-item>
  <!--
    Fab renderer
   -->
  <q-btn v-else-if="renderer === 'fab'"
    :id="id"
    class="k-fab"
    :icon="computedIcon"
    :color="computedColor"
    :size="size"
    :round="true"
    :dense="dense"
    :disable="disabled"
    @click="onClicked(arguments[0])">
    <!-- tooltip -->
    <q-tooltip v-if="computedTooltip" anchor="top middle" self="bottom right">
      {{ computedTooltip }}
    </q-tooltip>
    <!-- badge -->
    <q-badge v-if="badge" v-bind="badge" :label="computedBadgeLabel">
      <q-icon v-if="badge.icon" v-bind="badge.icon" />
    </q-badge>
  </q-btn>
  <!--
  Fab action renderer
  -->
  <q-fab-action v-else-if="renderer === 'fab-action'"
    :id="id"
    class="k-fab-action"
    no-caps
    :icon="computedIcon"
    :color="computedColor"
    :label="computedLabel"
    square
    external-label
    label-position="left"
    label-class="bg-primary text-white text-caption"
    :disable="disabled"
    @click="onClicked(arguments[0])">
    <!-- badge -->
    <q-badge v-if="badge" v-bind="badge">
      <q-icon v-if="badge.icon" v-bind="badge.icon" />
    </q-badge>
  </q-fab-action>
  <!--
    Tab renderer
  -->
  <q-btn v-else-if="renderer === 'tab'"
    v-bind:class="{'k-tab-active': isToggled }"
    :id="id"
    no-caps
    no-wrap
    :icon="computedIcon"
    :color="computedColor"
    :size="size"
    flat
    square
    :dense="dense"
    :disable="disabled"
    @click="onClicked(arguments[0])">
    <div v-if="computedLabel" class="test-subtitle1">
      {{ computedLabel }}
    </div>
    <!-- tooltip -->
    <q-tooltip v-if="computedTooltip">
      {{ computedTooltip }}
    </q-tooltip>
    <!-- badge -->
    <q-badge v-if="badge" v-bind="badge" :label="computedBadgeLabel">
      <q-icon v-if="badge.icon" v-bind="badge.icon" />
    </q-badge>
    <!-- extra content -->
    <slot>
    </slot>
  </q-btn>
</template>

<script>
import _ from 'lodash'
import { openURL } from 'quasar'

export default {
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
      default: () => {}
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
    loading: {
      type: Boolean,
      default: false
    },
    propagate: {
      type: Boolean,
      default: true
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
        return ['button', 'form-button', 'item', 'fab', 'fab-action', 'tab'].includes(value)
      }
    }
  },
  inheritAttrs: false,
  emits: ['triggered'],
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
      if (this.isToggled && _.has(this.toggle, 'label')) {
        return this.$tie(this.toggle.label)
      }
      return this.$tie(this.label)
    },
    computedIcon () {
      if (this.isToggled && _.has(this.toggle, 'icon')) return this.toggle.icon
      return this.icon
    },
    computedColor () {
      if (this.isToggled) return _.get(this.toggle, 'color', 'accent')
      return this.color
    },
    computedTooltip () {
      // Check also for translation key or already translated message
      if (this.isToggled && _.has(this.toggle, 'tooltip')) {
        return this.$tie(this.toggle.tooltip)
      } else {
        return this.$tie(this.tooltip)
      }
    },
    computedBadgeLabel () {
      // Check also for translation key or already translated message
      if (this.badge && _.has(this.badge, 'label')) {
        return this.$tie(this.badge.label)
      } else {
        // Take care that changing this to null or '' breaks the display in Quasar
        return undefined
      }
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
    async onClicked (event) {
      if (!this.propagate) event.stopPropagation()
      // Handle the toggle if needed
      if (this.toggle) {
        this.isToggled = !this.isToggled
      }
      // Handle the URL case
      if (this.url) openURL(this.url)
      // Handle the callback case
      if (this.handler) await this.handler(this.context, this.isToggled)
      // Handle the route case
      if (this.route) {
        // Process route params
        this.$router.push(Object.assign({
          query: this.bindRouteParams('query'),
          params: this.bindRouteParams('params')
        }, _.omit(this.route, ['query', 'params']))).catch(() => {})
      }
      // Notify the listeners
      this.$emit('triggered', this.context, this.isToggled)
    }
  }
}
</script>

<style lang="scss" scoped>
  .k-fab, .k-fab-action {
    border: 2px solid var(--q-color-secondary);
  }
  .k-tab-active {
    border-bottom: solid 2px;
  }
</style>
