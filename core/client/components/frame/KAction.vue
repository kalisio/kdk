<template>
  <!--
    Button renderer
   -->
  <q-btn v-if="renderer === 'button'"
    :id="id"
    no-caps
    no-wrap
    :color="computedColor"
    :icon="!iconRight ? computedIcon : undefined"
    :icon-right="iconRight ? computedIcon : undefined"
    :size="size"
    flat
    :round="label === null"
    :rounded="label !== null"
    :dense="dense"
    :disable="disabled"
    @click="onClicked">
    <!-- label -->
    <div v-if="computedLabel" :class="{ 'ellipsis q-pr-md': iconRight, 'ellipsis q-pl-md': !iconRight }">
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
    @click="onClicked">
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
    class="full-width"
    @click="onClicked">
    <q-item-section v-if="computedIcon || badge" avatar>
      <q-icon v-if="computedIcon" :name="computedIcon" :color="computedColor" :dense="dense" />
      <!-- badge -->
      <q-badge v-if="badge" v-bind="badge" :label="computedBadgeLabel">
        <q-icon v-if="badge.icon" v-bind="badge.icon" />
      </q-badge>
    </q-item-section>
    <q-item-section :class="'text-' + computedColor" no-wrap>
      {{ computedLabel }}
    </q-item-section>
  </q-item>
  <!--
    Fab renderer
   -->
  <q-btn v-else-if="renderer === 'fab'"
    :id="id"
    class="k-action-fab"
    :icon="computedIcon"
    :color="computedColor"
    :size="size"
    :round="true"
    :dense="dense"
    :disable="disabled"
    @click="onClicked">
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
    class="k-action-fab-action"
    no-caps
    :icon="computedIcon"
    :color="computedColor"
    :label="computedLabel"
    square
    external-label
    label-position="left"
    label-class="bg-primary text-white text-caption k-fab-action"
    :disable="disabled"
    @click="onClicked">
    <!-- badge -->
    <q-badge v-if="badge" v-bind="badge">
      <q-icon v-if="badge.icon" v-bind="badge.icon" />
    </q-badge>
  </q-fab-action>
  <!--
    Tab renderer
  -->
  <q-btn v-else-if="renderer === 'tab'"
    :class="{'k-action-tab-active': isToggled }"
    :id="id"
    no-caps
    no-wrap
    :label="computedLabel"
    :color="computedColor"
    :size="size"
    flat
    square
    :dense="dense"
    :disable="disabled"
    @click="onClicked">
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
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar, openURL } from 'quasar'
import { useAction } from '../../composables'
import { i18n } from '../../i18n.js'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: undefined
    },
    iconRight: {
      type: Boolean,
      default: false
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
    tooltip: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    toggled: {
      type: Boolean,
      default: false
    },
    toggle: {
      type: Object,
      default: () => {}
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
      type: Function,
      default: null
    },
    dialog: {
      type: Object,
      default: null
    },
    route: {
      type: Object,
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
  setup (props, { emit }) {
    // data
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()
    const { isToggled, toggle } = useAction(props)

    // computed
    const computedLabel = computed(() => {
      // Check also for translation key or already translated message
      if (isToggled.value && _.has(props.toggle, 'label')) return i18n.tie(props.toggle.label)
      return i18n.tie(props.label)
    })
    const computedIcon = computed(() => {
      if (isToggled.value && _.has(props.toggle, 'icon')) return props.toggle.icon
      return props.icon
    })
    const computedColor = computed(() => {
      if (isToggled.value) return _.get(props.toggle, 'color', 'accent')
      return props.color
    })
    const computedTooltip = computed(() => {
      // Check also for translation key or already translated message
      if (isToggled.value && _.has(props.toggle, 'tooltip')) return i18n.tie(props.toggle.tooltip)
      return i18n.tie(props.tooltip)
    })
    const computedBadgeLabel = computed(() => {
      // Check also for translation key or already translated message
      if (props.badge && _.has(props.badge, 'label')) return i18n.tie(props.badge.label)
      // Take care that changing this to null or '' breaks the display in Quasar
      return undefined
    })
    const dense = computed(() => {
      return $q.screen.lt.sm
    })

    // functions
    function bindRouteParams (path) {
      // When action is created from code we can directly inject the params
      // However, when created from the config we need to manage dynamic values
      // Clone route context to avoid losing dynamic parameters in this case
      const currentParams = _.get(route, path, {})
      const targetParams = _.get(props.route, path, {})
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
    }
    async function onClicked (event) {
      if (!props.propagate) event.stopPropagation()
      // Handle the toggle if needed
      if (props.toggle) toggle()
      // Handle the URL case
      if (props.url) openURL(props.url)
      // Handle the callback case
      if (props.handler) {
        try {
          await props.handler(props.context, isToggled.value)
        } catch (error) {
          // In case an error is raised we assume toggling has failed
          if (props.toggle) toggle()
          throw error
        }
      }
      // Handle the route case
      if (props.route) {
        // Allow to directly call a given URL, eg OAuth callback
        if (props.route.url) {
          location.href = props.route.url
        } else {
          // Process route params
          router.push(Object.assign({
            query: bindRouteParams('query'),
            params: bindRouteParams('params')
          }, _.omit(props.route, ['query', 'params']))).catch(() => {})
        }
      }
      // Handle the dialog case
      if (props.dialog) {
        let dialog = props.dialog
        const component = _.get(props.dialog, 'component')
        if (component) {
          dialog = {
            component: 'KDialog',
            componentProps: _.clone(dialog)
          }
        }
        $q.dialog(dialog)
      }
      // Notify the listeners
      emit('triggered', props.context, isToggled.value)
    }

    // watch
    watch(() => props.toggled, (value) => {
      toggle()
    })

    // expose
    return {
      isToggled,
      computedLabel,
      computedIcon,
      computedColor,
      computedTooltip,
      computedBadgeLabel,
      dense,
      onClicked
    }
  }
}
</script>

<style lang="scss" scoped>
  .k-action-fab, .k-action-fab-action {
    border: 2px solid var(--q-secondary);
  }
  .k-action-tab-active {
    border-bottom: solid 2px;
  }
</style>
