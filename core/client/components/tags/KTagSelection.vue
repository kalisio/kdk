<template>
  <div
    v-if="hasSelection"
    class="q-pl-xs row justify-center items-center q-gutter-x-xs k-tags-filter"
  >
    <template v-for="tag in tags" :key="tag.name">
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
import { ref, computed, watch } from 'vue'
import { useScreen } from '../../composables'
import KAction from '../action/KAction.vue'
import KChip from '../KChip.vue'

// Props
const props = defineProps({
  selection: {
    type: Array,
    default: () => []
  },
  onSelectionChanged: {
    type: Function,
    default: () => {}
  }
})

// Emits
const emit = defineEmits(['selection-changed'])

// Data
const { dense } = useScreen()
const tags = ref(props.selection)

// Watch
watch(() => props.selection, (newSelection) => {
  tags.value = newSelection
})

// Computed
const hasSelection = computed(() => {
  return !_.isEmpty(tags.value)
})

// Functions
function onRemoved (tag) {
  tags.value = tags.value.filter(t => t.name !== tag.name)
  props.onSelectionChanged(tags.value)
  emit('selection-changed', tags.value)
}
function onClear () {
  tags.value = []
  props.onSelectionChanged(tags.value)
  emit('selection-changed', tags.value)
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
