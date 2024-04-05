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
  const index = _.lastIndexOf(props.url, '.')
  if (index) {
    return props.url.substring(index + 1)
  }
}

// Watch
watch(() => props.url, async (value) => {
  if (!_.isEmpty(props.url)) {
    content.value = null
    // guess content type
    contentType.value = guessContentType()
    if (contentType.value) {
      let urls
      // localize file if needed
      if (props.localize) urls = i18n.localize(props.url)
      else urls = [props.url]
      // try to load the content
      let response
      for (const url of urls) {
        try {
          response = await fetch(url)
          if (response.ok) {
            content.value = await response.text()
            break
          }
        } catch (error) {
          // ignore the error
        }
      }
      if (content.value === null) {
        logger.error(`[KDK] fetch '${props.url}' failed with error with code: ${response.status}`)
      }
    } else {
      logger.error(`[KDK] cannot guess content type for '${props.url}'`)
    }
  } else {
    content.value = null
  }
}, { immediate: true })
</script>