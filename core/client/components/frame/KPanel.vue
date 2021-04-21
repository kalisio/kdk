<template>
  <k-content class="k-panel"
    v-bind="$props"
    v-bind:class="{
      'row justify-center': direction === 'horizontal',
      'column': direction === 'vertical'
    }" 
    @triggered="$emit('triggered', arguments)" />
</template>

<script>
export default {
  name: 'k-panel',
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
        return ['button', 'form-button', 'item'].includes(value)
      }
    }
  },
  created () {
    // load the required components
    this.$options.components['k-content'] = this.$load('frame/KContent')
  }
}
</script>

<style lang="stylus">
  .k-panel {
    background-color: #ffffff;
  }
</style>