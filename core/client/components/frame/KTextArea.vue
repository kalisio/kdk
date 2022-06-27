<template>
  <div
    v-html="html"
    @click="truncate=!truncate"
  >
  </div>
</template>

<script>
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'

export default {
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
      return _.truncate(sanitizeHtml(this.text), { length: this.length, separator: '<br>' })
    }
  },
  data () {
    return {
      truncate: true
    }
  }
}
</script>
