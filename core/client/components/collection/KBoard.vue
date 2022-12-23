<template>
  <div class="row justify-between q-gutter-x-sm no-wrap">
    <div class="col-*" />
    <template v-for="column in columns" :key="column.value">
      <div :id="column.value" :style="{ minWidth: `${column.width}px` }">
        <KColumn
          :key="column.value"
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
          :ref="column.value"
          v-bind="column.props"
          :append-items="true"
          :height="height"
        >
        </KColumn>
      </div>
    </template>
    <div class="col-*" />
  </div>
</template>

<script>
import KColumn from './KColumn.vue'

export default {
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
