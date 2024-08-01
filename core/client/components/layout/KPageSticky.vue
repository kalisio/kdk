<template>
  <q-page-sticky
    v-if="hasContent"
    class="k-sticky-z-index"
    :position="position"
    :offset="offset"
  >
    <KContent
      v-bind="$props"
    />
  </q-page-sticky>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import KContent from '../KContent.vue'

// Props
const props = defineProps({
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
})

// Computed
const hasContent = computed(() => {
  return !_.isEmpty(props.content)
})
</script>

<style lang="scss" scoped>
  .k-sticky-z-index {
    z-index: $sticky-z-index;
  }
</style>
