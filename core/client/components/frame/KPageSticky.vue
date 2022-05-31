<template>
  <q-page-sticky
    v-if="hasContent"
    class="k-sticky"
    :position="position"
    :offset="offset"
  >
    <KContent v-bind="$props" />
  </q-page-sticky>
</template>

<script>
import _ from 'lodash'
import KContent from './KContent.vue'

export default {
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

<style lang="scss">
  .k-sticky {
    z-index: $sticky-z-index;
  }
</style>