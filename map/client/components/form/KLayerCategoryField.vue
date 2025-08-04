<template>
  <q-select
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
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
    @update:model-value="onChanged">
    <!-- Helper -->
    <template v-if="hasHelper" v-slot:append>
      <k-action
        :id="properties.name + '-helper'"
        :label="helperLabel"
        :icon="helperIcon"
        :tooltip="helperTooltip"
        :url="helperUrl"
        :dialog="helperDialog"
        :context="helperContext"
        @dialog-confirmed="onHelperDialogConfirmed"
        color="primary"
      />
    </template>
  </q-select>
</template>

<script>
import { api, mixins as kCoreMixins } from '../../../../core/client'

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
    const response = await api.getService('catalog').find({ query: { type: 'Category' } })
    this.availableCategories = response.data
  }
}
</script>
