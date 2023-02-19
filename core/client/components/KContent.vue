<template>
  <div>
    <template v-for="component in avaiableComponents" :key="component.uid">
      <component
        v-if="component.isVisible"
        :is="component.instance"
        :context="context"
        v-bind="component.bind ? component.props : component"
        :renderer="component.renderer ? component.renderer: actionRenderer"
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
import { filterContent, loadComponent } from '../utils/index.js'

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
    let isVisible = _.get(component, 'visible', true)
    // Can be a functional call
    if (typeof isVisible === 'function') {
      isVisible = isVisible(props.context)
    }
    if ((typeof isVisible === 'string') && isVisible.startsWith(':')) {
      isVisible = _.get(props.context, isVisible.substring(1))
    }
    // If not a functional call the target property can be a reactive one
    // so that we "bind" it to the component instead of "filter" the component here
    component.isVisible = isVisible
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
function getComponents (content, mode) {
  let components = []
  // Get component config for given mode if any
  if (Array.isArray(content)) components = content
  else components = _.get(content, mode)
  const processedComponents = []
  // Then create component objects
  _.forEach(components, component => {
    // Get the component and add the required props
    component.name = _.get(component, 'component', 'KAction')
    component.uid = uid()
    processedComponents.push(component)
  })
  return processedComponents
}
function onTriggered (params) {
  emit('triggered', params)
}
</script>
