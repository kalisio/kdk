<template>
  <div>
    <q-separator />
    <!--
      Header section
     -->
    <div v-if="!hideHeader" class="row full-width justify-between items-center no-wrap">
      <span class="text-grey-7 text-body-2 ellipsis">
        {{ title }}
      </span>
      <KPanel
        v-if="filteredActions"
        :content="filteredActions"
        class="no-wrap"
      />
    </div>
    <!--
      Content section
     -->
    <div v-bind:class="{ 'q-py-xs': dense, 'q-py-sm': !dense }">
      <slot />
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  actions: {
    type: Array,
    default: () => null
  },
  actionsFilter: {
    type: [String, Array],
    default: () => null
  },
  hideHeader: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Computed
const filteredActions = computed(() => {
  if (!props.actionsFilter) return props.actions
  let filter = props.actionsFilter
  if (_.isString(filter)) filter = [filter]
  return _.filter(props.actions, action => {
    return _.indexOf(filter, action.id) >= 0
  })
})
</script>
