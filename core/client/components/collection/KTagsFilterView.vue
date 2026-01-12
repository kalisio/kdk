<template>
  <KTagSelection
    :selection="tagsFilterSelection"
    @selection-changed="onSelectionChanged"
  />
</template>

<script setup>
import _ from 'lodash'
import { useCollectionFilter } from '../../composables'
import KTagSelection from '../tags/KTagSelection.vue'

// Data
const { tagsFilterSelection, setTagsFilterSelection } = useCollectionFilter()

// Functions
function onSelectionChanged (selection) {
  setTagsFilterSelection(selection)
}
</script>
