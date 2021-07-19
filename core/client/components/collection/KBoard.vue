<template>
  <div class="fit row justify-between q-gutter-x-sm no-wrap">
    <template v-for="column in columns">
      <div
        :id="column.value"
        :key="column.value"
        :style="{ minWidth: `${column.width}px` }"
      >
        <k-column
          :label="column.label"
          :key="column.value" 
          v-bind="column.props" 
          :append-items="true" 
          :height="height" />
      </div>
    </template>
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
  }
}
</script>

<style lang="stylus">
body {
  overflow-y: hidden; /* Hide vertical scrollbar */
}
</style>