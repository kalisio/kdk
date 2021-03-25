<template>
  <q-select
    ref="select"
    v-model="model"
    :label="label"
    use-chips
    clearable
    :error-message="errorLabel"
    :error="hasError"
    bottom-slots
    :options="availableCategories"
    option-label="name"
    option-value="name"
    @input="onChanged">
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper" />
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
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
    }
  },
  async created () {
    // Build the list of available categories
    const response = await this.$api.getService('catalog').find({ query: { type: 'Category' } })
    this.availableCategories = response.data
  }
}
</script>
