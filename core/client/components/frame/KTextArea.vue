<template>
  <div>
    <div v-if="hasToggle">
      <span v-on:click="toggle()" v-html="textToDisplay" class="text-area" />
    </div>
    <div v-else>
      <span v-html="textToDisplay" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-text-area',
  props: {
    text: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 40
    }
  },
  computed: {
    textToDisplay () {
      const nbCharacters = this.text.length
      // Convert from JS formatted strings to HTML formatted strings as we usually allow multilines in this one
      let result = this.text.replace(/[\n\r]/g, '<br/>')
      // Truncate the description if required
      if (nbCharacters > this.length) {
        if (this.mustTruncate) {
          result = _.truncate(result, { length: this.length, separator: ' ' })
          if (result.indexOf('<br/>') >= 0) result = result.replace('<br/>', '...<br/>')
          else result += '...'
        }
      }
      return result
    },
    hasToggle () {
      return this.text.length > this.length
    }
  },
  data () {
    return {
      mustTruncate: true
    }
  },
  methods: {
    toggle () {
      this.mustTruncate = !this.mustTruncate
    }
  }
}
</script>

<style>
.text-area {
  cursor: pointer;
}
</style>
