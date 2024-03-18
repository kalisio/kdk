<template>
  <div v-if="html" v-html="html" />
</template>

<script setup>
import { ref, watch } from 'vue'

// Data
const html = ref(null)

// Props
const props = defineProps({
  content: {
    type: String,
    default: null
  }
})

// Watch
watch(() => props.content, async (value) => {
    html.value = props.content
}, { immediate: true })
</script>