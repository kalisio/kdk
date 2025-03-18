<template>
  <div>
    <q-fab
      v-if="hasOptions"
      icon="las la-filter"
      color="grey-9"
      flat
      direction="down"
      :vertical-actions-align="responsiveAlignment"
      padding="xs"
      @show="enableTooltip = false"
      @hide="enableTooltip = true"
    >
      <template v-for="tag in options" :key="tag.name">
        <q-fab-action
          :label="$tie(tag.label)"
          :color="tag.color"
          :text-color="tag.textColor"
          padding="1px"
          square
          @click="onTagAdded(tag)"
        />
      </template>
    </q-fab>
    <q-tooltip v-if="enableTooltip">
      {{ $t('C3XTagsFilterAction.FILTER') }}
    </q-tooltip>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { useCurrentActivity, useScreen } from '../../composables'

// Props
const props = defineProps({
  alignment: {
    type: [String, Object],
    default: 'center'
  }
})

// Data
const { Screen } = useScreen()
const { CurrentActivityContext } = useCurrentActivity()
const tagsFilter = CurrentActivityContext.state.tagsFilter
const enableTooltip = ref(true)

// Computed
const selection = computed(() => {
  return tagsFilter.selection
})
const options = computed(() => {
  return _.difference(tagsFilter.options, tagsFilter.selection)
})
const hasOptions = computed(() => {
  return !_.isEmpty(options.value)
})
const responsiveAlignment = computed(() => {
  if (_.isString(props.alignment)) return props.alignment
  return _.get(props.alignment, Screen.name)
})

// Function
function onTagAdded (tag) {
  Object.assign(CurrentActivityContext.state.tagsFilter, { selection: _.concat(selection.value, [tag]) })
}
</script>
