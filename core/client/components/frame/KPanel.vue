<template>
  <div v-bind:class="{
      'row justify-center': direction === 'horizontal',
      'column items-stretch content-stretch': direction === 'vertical'
    }"
  >
    <template v-for="component in components">
      <component 
        v-if="component.status ? component.status() !== 'hidden' : true" 
        :key="component.uid" 
        :disabled="component.status ? component.status() === 'disabled' : false"
        :is="component.componentKey" 
        v-bind="component" 
        :renderer="actionRenderer" 
        :style="component.style" />
    </template>
  </div>
</template>

<script>
import path from 'path'
import { uid } from 'quasar'
 
export default {
  name: 'k-panel',
  props: {
    content: {
      type: Object,
      default: () => { return null }
    },
    mode: {
      type: String,
      default: undefined
    },
    context: {
      type: Object,
      default: () => { return null }
    },
    color: {
      type: String,
      default: 'grey-9'
    },
    size: {
      type: String,
      default: 'md'
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator: (value) => {
        return ['horizontal', 'vertical'].includes(value)
      }
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
      const components = []
      const modes = _.keys(this.content)
      if (modes.length > 0) {
        const mode = this.mode ? this.mode : modes[0]
        _.forEach(_.get(this.content, mode, []), (component) => {
          // Define the component key
          const componentName = _.get(component, 'component', 'frame/KAction')
          const componentKey = _.kebabCase(path.basename(componentName))
          // Load the component if needed
          if ((componentKey[0] === 'k') && (!this.$options.components[componentKey])) this.$options.components[componentKey] = this.$load(componentName)
          // Update the component
          component['componentKey'] = componentKey
          component['uid'] = uid()
          _.defaults(component, this.$props)
          components.push(component)
        })
      }
      return components
    }
  }
}
</script>
