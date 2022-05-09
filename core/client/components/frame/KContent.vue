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
import { defineAsyncComponent } from 'vue'
import _ from 'lodash'
import { Layout } from '../../layout'

export default {
  name: 'k-content',
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
  computed: {
    components () {
      const components = Layout.getComponents(this.filteredContent, this.mode, this.context)
      for (let i = 0; i < components.length; ++i) {
        const component = components[i]
        if (!_.startsWith(component.componentKey, 'q-')) component.instance = defineAsyncComponent(this.$load(component.componentName))
      }
      return components
    },
    filteredContent () {
      return (this.content ? Layout.filterContent(this.content, this.filter || {}) : [])
    }
  }
}
</script>
