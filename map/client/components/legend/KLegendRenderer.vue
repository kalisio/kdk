<template>
  <div class="column full-width q-gutter-xs">
    <div v-if="label" class="text-weight-light">
      {{ $tie(label) }}
    </div> 
    <slot>
      <!-- to be overloaded -->
    </slot>
  </div>
</template>

<script setup>
// props
defineProps({
  label: {
    type: String,
    default: undefined
  }
})
</script>