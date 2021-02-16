<template>
  <q-page-sticky v-if="hasContent" :id="id" :position="position" :offset="offset">
    <k-content v-bind="$props"></k-content>
  </q-page-sticky>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-page-sticky',
  props: {
    id: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    offset: {
      type: Array,
      default: () => [0, 0]
    },
    color: {
      type: String,
      default: 'grey-9'
    },
    size: {
      type: String,
      default: 'md'
    },
    content: {
      type: [Object, Array],
      default: () => null
    },
    mode: {
      type: String,
      default: undefined
    },
    context: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    hasContent () {
      return !_.isEmpty(this.content)
    }
  },
  created () {
    // load the required components
    this.$options.components['k-content'] = this.$load('frame/KContent')
  }
}
</script>
