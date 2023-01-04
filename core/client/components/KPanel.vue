<template>
  <KContent
    v-if="hasContent"
    v-bind:class="{
      'row items-center': direction === 'horizontal',
      'column': direction === 'vertical'
    }"
    v-bind="$props"
    @triggered="onTriggered"
  />
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import KContent from './KContent.vue'

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

// Emit
const emit = defineEmits(['triggered'])

// Computed
const hasContent = computed(() => {
  return !_.isEmpty(props.content)
})

// Functions
function onTriggered (args) {
  emit('triggered', args)
}
</script>
