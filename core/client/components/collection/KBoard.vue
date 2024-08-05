<template>
  <q-scroll-area class="fit">
    <div class="fit row justify-between q-gutter-x-sm no-wrap">
      <div class="col-*" />
      <template v-for="column in columns" :key="column.value">
        <KCollection
          ref="columnRefs"
          :id="column.value"
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
          :append-items="true"
        >
        </KCollection>
      </template>
      <div class="col-*" />
    </div>
  </q-scroll-area>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import KCollection from './KCollection.vue'

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

// Expose
defineExpose({
  getColumn,
  getColumns
})
</script>
