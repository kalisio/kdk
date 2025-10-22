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
    v-model="items"
    :label="label"
    :multiple="properties.multiselect"
    autocomplete="off"
    hide-dropdown-icon
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
        <q-avatar v-if="getIcon(scope.opt)" :icon="getIcon(scope.opt)" color="primary" />
        {{ getLabel(scope.opt) }}
      </q-chip>
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="getId(scope.opt)"
      >
        <q-item-section v-if="getIcon(scope.opt)" avatar>
          <q-icon :name="getIcon(scope.opt)" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ getLabel(scope.opt) }}</q-item-label>
          <q-item-label caption>{{ getDescription(scope.opt) }}</q-item-label>
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
    hasSingleService () {
      const services = _.uniqBy(this.properties.services, 'service')
      return services.length === 1
    }
  },
  methods: {
    getServiceForItem (item) {
      return (this.hasSingleService
        ? this.properties.services[0]
        : _.find(this.properties.services, { service: item.service }))
    },
    getId (item) {
      return _.kebabCase(this.getLabel(item))
    },
    getLabel (item) {
      const service = this.getServiceForItem(item)
      return _.get(item, service.field || 'name', '')
    },
    getDescription (item) {
      const service = this.getServiceForItem(item)
      return _.get(item, service.description || 'description', '')
    },
    getIcon (item) {
      return _.get(item, 'icon.name', _.get(item, 'icon', ''))
    },
    emptyModel () {
      if (this.properties.multiselect) return []
      return null
    },
    fill (value) {
      this.model = value
      this.items = _.clone(value)
    },
    async onSearch (pattern, update, abort) {
      if (pattern.length < 2) {
        abort()
        return
      }
      const results = await Search.query(this.properties.services, pattern)
      update(() => {
        if (this.properties.multiselect) {
          this.options = _.differenceWith(results, this.items, (item1, item2) => {
            return _.get(item1, item1.field) === _.get(item2, item2.field) && item1.service === item2.service
          })
        } else this.options = results
      })
    },
    onSelected (value) {
      if (value) {
        // FIXME: ???
        if (this.properties.multiselect) this.model = this.items
        else this.model = this.items
      } else this.model = this.emptyModel()
      this.options = []
      this.$refs.select.updateInputValue('')
      this.onChanged()
    }
  }
}
</script>
