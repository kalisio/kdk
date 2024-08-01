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
    :stack="stack"
    :dense="dense"
    :disable="computedDisabled"
    v-close-popup="closePopup"
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
    :disable="computedDisabled"
    :loading="loading"
    v-close-popup="closePopup"
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
    class="full-width"
    clickable
    :dense="dense"
    :disable="computedDisabled"
    v-close-popup="closePopup"
    @click="onClicked">
    <q-item-section v-if="computedIcon || badge" avatar>
      <q-icon v-if="computedIcon" :name="computedIcon" :color="computedColor" :dense="dense" />
      <!-- badge -->
      <q-badge v-if="badge" v-bind="badge" :label="computedBadgeLabel">
        <q-icon v-if="badge.icon" v-bind="badge.icon" />
      </q-badge>
    </q-item-section>
    <q-item-section :class="'text-' + computedColor" no-wrap>
      <q-item-label :lines="1">{{ computedLabel }}</q-item-label>
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
    :disable="computedDisabled"
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
    :label-position="iconRight ? 'left' : 'right'"
    label-class="bg-primary text-white text-caption k-fab-action"
    :disable="computedDisabled"
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
    :disable="computedDisabled"
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
// WARNING for now we must declare the inheritAttrs this way. Lint will try to move it. Don't do it.
// TODO: need to updated when switch to vue > 3.3 to be able to declare options
export default {
  inheritAttrs: false
}
</script>

<script setup>
import _ from 'lodash'
import { ref, toRef, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar, openURL } from 'quasar'
import { i18n } from '../../i18n.js'
import { actionProps } from '../../utils/utils.actions'
import { bindParams } from '../../utils/utils.content.js'

// Data
const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const props = defineProps(actionProps)
const isToggled = _.has(props, 'toggle.value') ? toRef(props.toggle, 'value') : ref(props.toggled)

// Emit
const emit = defineEmits(['triggered', 'toggled', 'dialog-confirmed', 'dialog-canceled'])

// Computed
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
const computedDisabled = computed(() => {
  if (!props.disabled) return false
  if (typeof props.disabled === 'function') return props.disabled()
  return props.disabled
})
const computedTooltip = computed(() => {
  if (computedDisabled.value) return
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

// Functions
function toggle () {
  isToggled.value = !isToggled.value
  emit('toggled', props.context, isToggled.value)
}
function bindRouteParams (path) {
  // When action is created from code we can directly inject the params.
  // However, when created from the config we need to manage dynamic values.
  // A parameter like ':xxx' in config means xxx is a dynamic property of
  // the current route or the context object, not a static value.
  // We bind the target params object to both possible context.
  const currentParams = _.get(route, path, {})
  const targetParams = _.get(props.route, path, {})
  const routeParams = bindParams(targetParams, currentParams)
  const contextParams = bindParams(targetParams, props.context)
  return _.merge(routeParams, contextParams)
}
async function onClicked (event) {
  if (!props.propagate) event.stopPropagation()
  // handle the toggle if needed
  if (props.toggle) toggle()
  // handle the URL case
  if (props.url) openURL(props.url)
  // handle the callback case
  if (props.handler) {
    try {
      await props.handler(props.context, isToggled.value)
    } catch (error) {
      // in case an error is raised we assume toggling has failed
      if (props.toggle) toggle()
      throw error
    }
    return
  }
  // handle the route case
  if (props.route) {
    // allow to directly call a given URL, eg OAuth callback
    if (props.route.url) {
      location.href = props.route.url
    } else {
      // process route params
      router.push(Object.assign({
        query: bindRouteParams('query'),
        params: bindRouteParams('params')
      }, _.omit(props.route, ['query', 'params']))).catch(() => {})
    }
    return
  }
  // handle the dialog case
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
      .onOk((result) => {
        emit('dialog-confirmed', props.context, result)
      })
      .onCancel((result) => {
        emit('dialog-canceled', props.context, result)
      })
  }
  // notify listeners
  emit('triggered', props.context, isToggled.value)
}

// Watch
watch(() => props.toggled, (value) => {
  if (isToggled.value !== value) isToggled.value = value
})

// Expose
defineExpose({
  isToggled,
  toggle
})
</script>

<style lang="scss" scoped>
.k-action-fab, .k-action-fab-action {
  border: 2px solid var(--q-secondary);
}
.k-action-tab-active {
  border-bottom: solid 2px;
}
</style>
