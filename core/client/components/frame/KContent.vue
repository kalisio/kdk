<template>
  <div>
    <template v-for="component in components" :key="component.uid">
      <component
        v-if="component.isVisible"
        :is="component.instance"
        :context="context"
        v-bind="component.bind ? component.props : component"
        :renderer="component.renderer ? component.renderer: actionRenderer"
        v-on="component.on ? { [component.on.event]: component.on.listener } : {}"
        @triggered="$emit('triggered', arguments)" />
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { Layout } from '../../layout'
import { loadComponent } from '../../utils'

export default {
  props: {
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
  },
  emits: ['triggered'],
  computed: {
    components () {
      const components = Layout.getComponents(this.filteredContent, this.mode, this.context)
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
    },
    filteredContent () {
      return (this.content ? Layout.filterContent(this.content, this.filter || {}) : [])
    }
  }
}
</script>
