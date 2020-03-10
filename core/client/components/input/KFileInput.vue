<template>
  <div>
    <q-input
      type="file"
      v-bind="$attrs"
      @input="onChanged" />
  </div>
</template>

<script>
import { QInput } from 'quasar'

export default {
  name: 'k-file-input',
  components: {
    QInput
  },
  props: {
    mimeTypes: {
      type: Array,
      required: true
    }
  },
  methods: {
    onChanged (files) {
      if (files.length === 0) {
        this.$emit('cleared')
      } else {
        const file = files[0]
        if (!this.mimeTypes.includes(file.type)) this.$emit('rejected', file)
        else {
          const reader = new FileReader()
          reader.addEventListener('loadend', () => this.$emit('loaded', file, reader.result))
          reader.addEventListener('error', () => this.$emit('failed', file))
          reader.readAsText(file)
        }
      }
    }
  }
}
</script>
