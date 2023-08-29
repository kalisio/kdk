<template>
  <div class="row justify-between q-gutter-x-sm no-wrap">
    <div class="col-*" />
    <template v-for="column in columns" :key="column.value">
      <KColumn
        :id="column.value"
        ref="columnRefs"
        :name="column.value"
        :header="[{
          component: 'QSpace'
        }, {
          component: 'QChip',
          label: $tie(column.label),
          color: 'grey-10',
          'text-color': 'white',
          square: true,
          class: 'justify-center'
        }, {
          component: 'QSpace'
        }]"
        v-bind="column.props"
        :height="height"
        :width="column.width"
        :style="{ minWidth: `${column.width}px`, maxWidth: `${column.width}px` }"
      >
      </KColumn>
    </template>
    <div class="col-*" />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import KColumn from './KColumn.vue'

// Props
const props = defineProps({
  columns: {
    type: Array,
    default: () => null
  },
  height: {
    type: Number,
    required: true
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

// Expose
defineExpose({
  getColumn,
  getColumns
})
</script>
