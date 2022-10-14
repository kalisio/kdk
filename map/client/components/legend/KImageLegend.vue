<template>
  <div class="row full-width justify-center">
    <q-img  v-bind="content" />
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: Object,
    required: true
  }
})
</script>
