<template>
  <div>
    <q-fab
      v-if="hasOptions"
      id="tags-filter-control"
      icon="las la-filter"
      color="grey-9"
      flat
      direction="down"
      :vertical-actions-align="computedAlignment"
      padding="xs"
      @show="showTooltip = false"
      @hide="showTooltip = true"
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
    <q-tooltip v-if="showTooltip">
      {{ $t('KTagsFilterControl.FILTER') }}
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
const showTooltip = ref(true)

// Computed
const selection = computed(() => {
  return _.get(tagsFilter, 'selection', [])
})
const options = computed(() => {
  return _.difference(_.get(tagsFilter, 'options'), selection.value)
})
const hasOptions = computed(() => {
  return !_.isEmpty(options.value)
})
const computedAlignment = computed(() => {
  if (_.isString(props.alignment)) return props.alignment
  return _.get(props.alignment, Screen.name)
})

// Function
function onTagAdded (tag) {
  _.set(tagsFilter, 'selection', _.concat(selection.value, [tag]))
}
</script>
