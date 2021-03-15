<template>
  <k-card v-bind="$props" :itemActions="actions" :bind-actions="false">
  </k-card>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-organisation-card',
  mixins: [mixins.baseItem],
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
  }
}
</script>
