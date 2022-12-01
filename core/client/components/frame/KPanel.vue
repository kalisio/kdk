<template>
  <KContent
    v-bind:class="{
      'row items-center': direction === 'horizontal',
      'column': direction === 'vertical'
    }"
    v-bind="$props"
    @triggered="onTriggered"
  />
</template>

<script setup>
import KContent from './KContent.vue'

// props
defineProps({
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
})

// emit
const emit = defineEmits(['triggered'])

// functions
function onTriggered (args) {
  emit('triggered', args)
}
</script>
