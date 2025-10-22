<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-chip :color="model.color" dense>
      {{ model.name }}
    </q-chip>
  </div>
  <q-select v-else
    ref="select"
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :multiple="multiple"
    autocomplete="off"
    hide-dropdown-icon
    emit-value
    use-input
    clearable
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    :autofocus="hasFocus"
    bottom-slots
    :options="options"
    @filter="onSearch"
    @update:model-value="onSelected">
    <!-- Value display -->
    <template v-slot:selected-item="scope">
      <q-chip
        square
        removable
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        color="primary"
        text-color="white"
      >
        {{ scope.opt }}
      </q-chip>
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="scope.opt.id"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.value }}</q-item-label>
          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
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
import _ from 'lodash'
import { Search } from '../../search'
import { baseField } from '../../mixins'

export default {
  mixins: [baseField],
  data () {
    return {
      items: null,
      options: []
    }
  },
  computed: {
    multiple () {
      return _.get(this.properties, 'field.multiple', false)
    }
  },
  methods: {
    emptyModel () {
      if (this.properties.multiselect) return []
      return null
    },
    async onSearch (pattern, update, abort) {
      if (pattern.length < 2) {
        abort()
        return
      }
      const search = {
        service: this.properties.field.service,
        field: this.properties.field.propertyField,
        baseQuery: this.properties.field.baseQuery
      }
      const results = await Search.query(search, pattern)
      update(() => {
        // Format the search response
        const valueField = this.properties.field.propertyField
        const descriptionField = this.properties.field.descriptionField || 'description'
        const options = _.map(results, option => {
          return {
            id: _.kebabCase(_.get(option, valueField)),
            value: _.get(option, valueField),
            description: _.get(option, descriptionField)
          }
        })
        if (this.multiple) {
          // Remove doublons in case of multiples properties
          this.options = _.differenceWith(options, this.items, (item1, item2) => {
            return item1.id === item2.id
          })
        } else this.options = options
      })
    },
    onSelected (value) {
      if (!value) this.model = this.emptyModel()
      this.options = []
      this.$refs.select.updateInputValue('')
      this.onChanged()
    }
  }
}
</script>
