<template>
  <div v-html="markdownAsHtml" />
</template>

<script>
import showdown from 'showdown'

export default {
  name: 'k-markdown-viewer',
  props: {
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
  },
  watch: {
    url: function () {
      this.markdownAsHtml = ''
      this.processMarkdown()
    },
    markdown: function () {
      this.processMarkdown()
    },
    options: function () {
      this.processMarkdown()
    }
  },
  data () {
    return {
      markdownAsHtml: ''
    }
  },
  methods: {
    async processMarkdown () {
      let markdown = this.markdown
      const converter = new showdown.Converter(this.options)
      converter.setFlavor('github')
      if (!markdown && this.url) {
        const response = await fetch(this.url)
        if (response.status !== 200) {
          throw new Error('Impossible to retrieve markdown: ' + response.status)
        }
        markdown = await response.text()
      }
      this.markdownAsHtml = converter.makeHtml(markdown)
    }
  },
  mounted () {
    this.processMarkdown()
  }
}
</script>
