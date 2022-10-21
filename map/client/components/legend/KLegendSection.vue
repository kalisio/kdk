<template>
  <div class="column full-width q-gutter-xs">
    <div v-if="label" class="text-weight-light">
      {{ $tie(label) }}
    </div> 
    <slot>

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