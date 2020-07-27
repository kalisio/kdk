<template>
  <div
    @click="truncate=!truncate"
    v-html="html">
  </div>
</template>

<script>
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'

export default {
  name: 'k-text-area',
  props: {
    text: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 50
    }
  },
  computed: {
    html () {
      if (!this.truncate) return sanitizeHtml(this.text)
      return _.truncate(sanitizeHtml(this.text), { length: this.length, separator: '<br>'})
    }
  },
  data () {
    return {
      truncate: true
    }
  }
}
</script>

