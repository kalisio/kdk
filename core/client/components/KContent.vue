<template>
  <div>
    <template v-for="component in filteredComponents" :key="component.uid">
      <Suspense v-if="component.suspense">
        <component
          v-if="component.isVisible && !component.isHidden"
          :is="component.instance"
          :context="context"
          :renderer="component.renderer ? component.renderer: actionRenderer"
          v-bind="component"
          v-on="component.on ? { [component.on.event]: component.on.listener } : {}"
          @triggered="onTriggered" />
      </Suspense>
      <component v-else
        v-if="component.isVisible && !component.isHidden"
        :is="component.instance"
        :context="context"
        :renderer="component.renderer ? component.renderer: actionRenderer"
        v-bind="component"
        v-on="component.on ? { [component.on.event]: component.on.listener } : {}"
        @triggered="onTriggered" />
    </template>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { uid } from 'quasar'
import { filterContent, getBoundValue, loadComponent } from '../utils/index.js'

// Props
const props = defineProps({
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
      return ['button', 'form-button', 'item', 'tab'].includes(value)
    }
  }
})

// Emit
const emit = defineEmits(['triggered'])

// Computed
const filteredComponents = computed(() => {
  if (_.isEmpty(props.content)) return []
  // Retrieve the components
  let components = props.content
  if (!Array.isArray(components)) components = _.get(components, props.mode, [])
  // Filter the components
  if (!_.isEmpty(props.filter)) components = filterContent(components, props.filter)
  // Configure the components
  for (const component of components) {
    component.name = _.get(component, 'component', 'action/KAction')
    component.uid = uid()
    component.isHidden = getVisibility(component, 'hidden', false)
    component.isVisible = getVisibility(component, 'visible', true)
    if (!_.startsWith(component.name, 'Q')) component.instance = loadComponent(component.name)
    else component.instance = component.name
  }
  return components
})

// Functions
function getVisibility (component, property, defaultValue) {
  let isVisible = _.get(component, property, defaultValue)
  // Can be a functional call
  if (typeof isVisible === 'function') {
    isVisible = isVisible(props.context)
  } else {
    isVisible = getBoundValue(isVisible, props.context)
  }
  return isVisible
}
function onTriggered (params) {
  emit('triggered', params)
}
</script>
