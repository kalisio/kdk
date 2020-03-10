<template>
  <q-btn :id="id" :color="color" :loading="isLoading" @click="onClick">
    <slot></slot>
  </q-btn>
</template>

<script>
import { QBtn } from 'quasar'

export default {
  name: 'k-btn',
  components: {
    QBtn
  },
  props: {
    id: {
      type: String,
      required: false
    },
    color: {
      type: String,
      default: 'grey'
    },
    flat: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    onClick () {
      this.$emit('click', { loading: this.loading })
    },
    loading (value) {
      this.isLoading = value
    }
  }
}
</script>
