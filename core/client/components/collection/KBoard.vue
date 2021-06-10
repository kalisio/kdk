<template>
  <div class="fit row q-gutter-x-sm no-wrap">
    <template v-for="column in columns">
      <div
        :id="column.value"
        class="col"
        :key="column.value">
          <k-column 
            :label="column.label"
            :key="column.value" 
            v-bind="column.props" 
            :append-items="true" 
            :height="height"
            style="min-width: 100%;" />
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
      default: () => { return null }
    },
    height: {
      type: Number,
      required: true
    }
  }
}
</script>

