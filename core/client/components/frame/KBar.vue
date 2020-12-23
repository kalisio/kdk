<template>
  <div v-bind:class="{
      'row items-center no-wrap': direction === 'horizontal',
      'column content-center no-wrap': direction === 'vertical'
    }"
  >
    <slot name="before" />
    <template v-for="component in components">
      <component :key="component.uid" :is="component.componentKey" v-bind="component" class="q-ma-xs" />
    </template>
    <slot name="after" />
  </div>
</template>

<script>
import _ from 'lodash'
import path from 'path'
import { uid } from 'quasar'

export default {
  name: 'k-bar',
  props: {
    content: {
      type: Object,
      default: () => { return {} }
    },
    mode: {
      type: String,
      default: ''
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
    dense: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator: (value) => {
        return ['horizontal', 'vertical'].includes(value)
      }
    }
  },
  computed: {
    components () {
      let components = []
      const modes = _.keys(this.content)
      if (modes.length > 0) {
        const mode = this.mode !== '' ? this.mode : modes[0]
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
