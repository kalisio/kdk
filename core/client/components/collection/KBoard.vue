<template>
  <div class="fit row justify-between q-gutter-x-sm no-wrap">
    <div class="col-*" />
    <template v-for="column in columns" :key="column.value">
      <div :id="column.value" :style="{ minWidth: `${column.width}px` }">
        <k-column
          :label="column.label"
          :key="column.value"
          :ref="column.value"
          v-bind="column.props"
          :append-items="true"
          :height="height" />
      </div>
    </template>
    <div class="col-*" />
  </div>
</template>

<script>
import KColumn from './KColumn.vue'

export default {
  name: 'k-board',
  components: {
    KColumn
  },
  props: {
    columns: {
      type: Array,
      default: () => null
    },
    height: {
      type: Number,
      required: true
    }
  },
  methods: {
    getColumn (value) {
      return this.$refs[value][0]
    }
  }
}
</script>
