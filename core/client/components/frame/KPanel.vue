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
import { defineProps, defineEmits } from 'vue'
import KContent from './KContent.vue'

// emit
const emit = defineEmits(['triggered'])

// props
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

// functions
function onTriggered (args) {
  emit('triggered', args)
}
</script>
