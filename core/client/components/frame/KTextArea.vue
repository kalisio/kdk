<template>
  <div
    v-bind:class="{
      'ellipsis': ellipsis === '1-line' && truncate,
      'ellipsis-2-lines': ellipsis === '2-lines' && truncate,
      'ellipsis-3-lines': ellipsis === '3-lines' && truncate
    }"
    @click="truncate=!truncate"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave">
    {{text}}
  </div>
</template>

<script>
export default {
  name: 'k-text-area',
  props: {
    text: {
      type: String,
      default: ''
    },
    ellipsis: {
      type: String,
      default: '1-line',
      validator: (value) => {
        return ['disabled', '1-line', '2-lines', '3-lines'].includes(value)
      }
    }
  },
  data () {
    return {
      truncate: true
    }
  },
  methods: {
    onMouseOver () {
      if (!this.$q.platform.is.mobile) this.truncate = false
    },
    onMouseLeave () {
      if (!this.$q.platform.is.mobile) this.truncate = true
    }
  }
}
</script>
