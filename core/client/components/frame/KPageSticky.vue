<template>
  <q-page-sticky 
    v-if="hasContent" 
    :position="position" 
    :offset="offset"
  >
    <k-content v-bind="$props"></k-content>
  </q-page-sticky>
</template>

<script>
import _ from 'lodash'
import KContent from './KContent.vue'

export default {
  name: 'k-page-sticky',
  components: {
    KContent
  },
  props: {
    position: {
      type: String,
      required: true
    },
    offset: {
      type: Array,
      default: () => [0, 0]
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
  }
}
</script>
