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
import { Layout } from '../layout'
import { loadComponent } from '../utils'

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
  let components = Layout.filterContent(props.content, props.filter || {})
  components = Layout.getComponents(components, props.mode, props.context)
  for (let i = 0; i < components.length; ++i) {
    const component = components[i]
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
function onTriggered (args) {
  emit('triggered', args)
}
</script>
