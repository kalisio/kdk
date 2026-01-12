<template>
  <KAction
    v-if="hasTimeFilterRange"
    id="time-filter-control"
    icon="las la-clock"
    tooltip="KTimeFilterControl.FILTER"
    :handler="showTimeFilter"
  />
</template>

<script setup>
import _ from 'lodash'
import { useCollectionFilter } from '../../composables'

// Data
const {
  hasTimeFilterRange,
  timeFilterRange,
  setTimeFilterSelection
} = useCollectionFilter()

// Functions
async function showTimeFilter () {
  setTimeFilterSelection({
    start: _.get(timeFilterRange.value, 'min'),
    end: _.get(timeFilterRange.value, 'max')
  })
}
</script>
