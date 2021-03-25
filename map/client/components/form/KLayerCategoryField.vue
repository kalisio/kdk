<template>
  <q-select
    ref="select"
    v-model="model"
    :label="label"
    use-input
    use-chips
    new-value-mode="add-unique"
    clearable
    :error-message="errorLabel"
    :error="hasError"
    bottom-slots
    :options="availableCategories"
    @input="onChanged">
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper" />
    </template>
  </q-select>
</template>

<script>
import { mixins as kCoreMixins } from '../../../../core/client'

export default {
  name: 'k-category-field',
  mixins: [kCoreMixins.baseField],
  data () {
    return {
      availableCategories: []
    }
  },
  methods: {
    emptyModel () {
      return null
    },
    onUpdated () {
      console.log(this.model)
    }
  },
  async created () {
    // Build the list of available categories
    const response = await this.$api.getService('catalog').find({ query: { type: 'category' } })
    this.availableCategories = response.data
  }
}
</script>
