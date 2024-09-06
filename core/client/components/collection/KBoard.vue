<template>
  <q-scroll-area class="fit">
    <div class="fit row justify-between q-gutter-x-sm no-wrap">
      <template v-for="column in columns" :key="column.value">
        <KGrid
          ref="columnRefs"
          :id="column.value"
          :name="column.value"
          v-bind="column.props"
          :append-items="true"
          :header="getHeader(column.label)"
          headerClass="full-width justify-center"
        />
      </template>
    </div>
  </q-scroll-area>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import { i18n } from '../../i18n.js'
import KGrid from './KGrid.vue'

// Props
defineProps({
  columns: {
    type: Array,
    default: () => null
  }
})

// Data
const columnRefs = ref([])

// Functions
function getColumn (value) {
  return _.find(columnRefs.value, { name: value })
}
function getColumns (values) {
  return values.map(value => getColumn(value))
}
function getHeader (label) {
  return [{
    component: 'QChip', label: i18n.tie(label), color: 'grey-10', 'text-color': 'white', square: true
  }]
}

// Expose
defineExpose({
  getColumn,
  getColumns
})
</script>
