<template>
  <div
    v-if="hasSelection"
    class="q-pl-xs row justify-center items-center q-gutter-x-xs k-tags-filter"
  >
    <template v-for="tag in selection" :key="tag.name">
      <KChip
        v-bind="tag"
        removable
        @remove="onRemoved(tag)"
        square
        :dense="dense"
      />
    </template>
    <KAction
      id="clear-tags"
      icon="cancel"
      color="grey-7"
      size="12px"
      :handler="onClear"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { useCurrentActivity, useScreen } from '../../composables'
import KAction from '../action/KAction.vue'

// Data
const { dense } = useScreen()
const { CurrentActivityContext } = useCurrentActivity()
const { state } = CurrentActivityContext

// Computed
const hasSelection = computed(() => {
  return state.tagsFilter && !_.isEmpty(selection.value)
})
const selection = computed(() => {
  return state.tagsFilter.selection
})

// Functions
function onRemoved (tag) {
  _.set(state.tagsFilter, 'selection', _.without(selection.value, tag))
}
function onClear () {
  _.set(state.tagsFilter, 'selection', [])
}
</script>

<style lang="scss" scoped>
.k-tags-filter {
  padding-left: 8px;
  padding-right: 4px;
  border-radius: 24px;
  border: 1px solid lightgrey;
  background-color: #dedede
}
</style>
