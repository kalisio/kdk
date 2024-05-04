<template>
  <div>
    <template v-for="component in avaiableComponents" :key="component.uid">
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
import logger from 'loglevel'
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
const avaiableComponents = computed(() => {
  if (_.isEmpty(props.content)) return []
  let components = filterContent(props.content, props.filter || {})
  components = getComponents(components, props.mode, props.context)
  for (let i = 0; i < components.length; ++i) {
    const component = components[i]
    // Check for hidden/visible handler or property
    // If not a functional call the target property can be a reactive one
    // so that we "bind" it to the component instead of "filter" the component here
    component.isHidden = getVisibility(component, 'hidden', false)
    component.isVisible = getVisibility(component, 'visible', true)
    if (!_.startsWith(component.name, 'Q')) {
      logger.trace(`Loading component ${component.name}`)
      component.instance = loadComponent(component.name)
    } else {
      logger.trace(`Using component ${component.name}`)
      component.instance = component.name
    }
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
function getComponents (content, mode) {
  let components = []
  // Get component config for given mode if any
  if (Array.isArray(content)) components = content
  else components = _.get(content, mode)
  const processedComponents = []
  // Then create component objects
  _.forEach(components, component => {
    // Get the component and add the required props
    component.name = _.get(component, 'component', 'action/KAction')
    component.uid = uid()
    processedComponents.push(component)
  })
  return processedComponents
}
function onTriggered (params) {
  emit('triggered', params)
}
</script>
