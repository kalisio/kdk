<template>
  <KContent
    v-bind="$props"
    v-bind:class="{
      'row items-stretch justify-center no-wrap': direction === 'horizontal',
      'column ': direction === 'vertical'
    }"
    @triggered="$emit('triggered', arguments)"
  />
</template>

<script>
import KContent from './KContent.vue'

export default {
  components: {
    KContent
  },
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
        return ['button', 'form-button', 'item', 'tab'].includes(value)
      }
    }
  },
  emits: ['triggered']
}
</script>
