<template>
  <KHtml 
    v-if="html"
    :content="html"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import showdown from 'showdown'
import KHtml from './KHtml.vue'

// Props
const props = defineProps({
  content: {
    type: String,
    default: undefined
  },
  options: {
    type: Object,
    default: () => {}
  }
})

// Data
const html = ref(null)

// Watch
watch(() => [props.content, props.options], async (value) => {
  if (props.content) {
    const converter = new showdown.Converter(props.options)
    html.value = converter.makeHtml(props.content)
  } else {
    html.value = null
  }
}, { immediate: true })
</script>