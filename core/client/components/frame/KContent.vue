<template>
  <div>
    <template v-for="component in components">
      <component
        :key="component.uid"
        :is="component.componentKey"
        v-bind="component.bind ? component.props : component"
        :renderer="component.renderer ? component.renderer: actionRenderer"
        v-on="component.on ? { [component.on.event]: component.on.listener } : {}" />
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import { Layout } from '../../layout'

export default {
  name: 'k-content',
  props: {
    id: {
      type: String,
      required: true
    },
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
        return ['button', 'item'].includes(value)
      }
    }
  },
  computed: {
    components () {
      let components = []
      if (this.content) {
        components = Layout.getComponents(_.cloneDeep(this.content), this.mode, this.filter, this.context)
        _.forEach(components, (component) => {
          const { componentKey, componentName } = component
          // Load the component if needed: do not load any Quasar component and avoid loading twice
          if (!_.startsWith(componentKey, 'q-') && !this.$options.components[componentKey]) {
            this.$options.components[componentKey] = this.$load(componentName)
          }
          // Checks whether an id is defined
          if (!component.id) component.id = componentKey
          if (this.context) component.context = this.context
        })
      }
      return components
    }
  }
}
</script>
