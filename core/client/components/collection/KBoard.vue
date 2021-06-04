<template>
  <div class="fit row q-gutter-x-sm no-wrap">
    <template v-for="column in columns">
      <div
        :id="column.value"
        class="col q-pa-sm column content-start q-gutter-y-sm"
        :key="column.value">
          <div class="text-subtitle1 text-weight-medium">
            {{ $t(column.label) }}
          </div>
          <k-column 
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
export default {
  name: 'k-board',
  props: {
    columns: {
      type: Array,
      default: () => { return null }
    },
    height: {
      type: String,
      default: '80vh'
    }
  },
  beforeCreate () {
    this.$options.components['k-column'] = this.$load('collection/KColumn')
  }
}
</script>

