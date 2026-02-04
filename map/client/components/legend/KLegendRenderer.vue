<template>
  <div class="column full-width q-gutter-xs">
    <div v-if="label" :class="labelClass">
      {{ $tie(label) }}
    </div>
    <div class="q-pr-sm">
      <slot>
      <!-- to be overloaded -->
      </slot>
    </div>
  </div>
</template>

<script setup>
// props
defineProps({
  label: {
    type: String,
    default: undefined
  },
  labelClass: {
    type: String,
    default: 'text-weight-medium'
  }
})
</script>
