<template>
  <div
    class="k-textarea-capture"
    v-html="sanitizedText"
  />
</template>

<script setup>
import { computed } from 'vue'
import _ from 'lodash'
import config from 'config'
import sanitizeHtml from 'sanitize-html'

// props
const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})

// data
const sanitizeHtmlOptions = {
  ...sanitizeHtml.defaults,
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'strike' ]),
  allowedAttributes: _.merge(sanitizeHtml.defaults.allowedAttributes, { '*': ['style'] }),
  allowedStyles: { '*': { 'text-align': [/^left$/, /^right$/, /^center$/] }}
}

// computed
const sanitizedText = computed(() => {
  return sanitizeHtml(props.text, sanitizeHtmlOptions)
})
const cssBackgroundColor = computed(() => {
  return _.get(config, 'capture.backgroundColor')
})
const cssColor = computed(() => {
  return _.get(config, 'capture.color')
})
</script>

<style lang="scss" scoped>
.k-textarea-capture {
  background-color: v-bind(cssBackgroundColor);
  color: v-bind(cssColor);
  width: 100%;
  padding: 5px 20px;
}
</style>
