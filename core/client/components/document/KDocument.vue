<template>
  <div v-if="content">
    <KHtml v-if="contentType === 'html'"
      :content="content"
    />
    <KMarkdown v-if="contentType === 'md'"
      :content="content"
      :options="options"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { ref, watch } from 'vue' 
import { i18n } from '../../i18n.js'
import KHtml from './KHtml.vue'
import KMarkdown from './KMarkdown.vue'

// Props
const props = defineProps({
  url: {
    type: String,
    default: undefined
  },
  localize: {
    type: Boolean,
    default: true
  },
  options: {
    type: Object,
    default: () => null
  },
})

// Data
const contentType = ref(null)
const content = ref(null)

// Function
function guessContentType () {
  if (!_.isEmpty(props.contentType)) return props.contentType
  const index = _.lastIndexOf(props.url, '.')
  if (index) {
    return props.url.substring(index + 1)
  }
}

// Watch
watch(() => [props.content, props.url], async (value) => {
  if (!_.isEmpty(props.url)) {
    content.value = null
    // guess content type
    contentType.value = guessContentType()
    if (contentType.value) {
      let urls
      // localize file if needed
      if (props.localize) urls = i18n.localize(props.url)
      else urls = [props.url]
      for (const url of urls) {
        const response = await fetch(url)
        if (response.status === 200) {
          content.value = await response.text()
          break
        }
      }
      if (data.value === null) {
        logger.error(`[KDK] fetch '${props.url}' failed with error with code: ${response.status}`)
      }
    } else {
      logger.error(`[KDK] cannot guess content type for '${props.url}'`)
    }
  } else {
    data.value = null
  }
}, { immediate: true })
</script>