<template>
  <div v-html="html" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import showdown from 'showdown'

// Props
const props = defineProps({
  url: {
    type: String,
    default: ''
  },
  markdown: {
    type: String,
    default: ''
  },
  options: {
    type: Object,
    default: () => {}
  }
})

// Data
const html = ref('')

// Watch
watch(() => [props.url, props.markdown, props.options], () => {
  processMarkdown()
})

// Functions
async function processMarkdown () {
  let markdown = props.markdown
  const converter = new showdown.Converter(props.options)
  converter.setFlavor('github')
  if (!markdown && props.url) {
    const response = await fetch(props.url)
    if (response.status !== 200) {
      throw new Error('Impossible to retrieve markdown: ' + response.status)
    }
    markdown = await response.text()
  }
  html.value = converter.makeHtml(markdown)
}

// Hooks
onMounted(async () => {
  await processMarkdown()
})
</script>