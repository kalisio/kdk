<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-chip :color="model.color" dense>
      {{ model.name }}
    </q-chip>
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :error-message="errorLabel"
    :error="hasError"
    :disabled="disabled"
    no-error-icon
    bottom-slots
  >
    <k-item-chooser
      :id="properties.name + '-field'"
      :multiselect="properties.multiselect"
      :default-items="defaultItems"
      :services="properties.services"
      @changed="updateModel" />
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-field>
</template>

<script>
import _ from 'lodash'
import { KItemChooser } from '../input'
import mixins from '../../mixins'

export default {
  name: 'k-item-field',
  components: {
    KItemChooser
  },
  mixins: [mixins.baseField],
  data () {
    return {
      defaultItems: []
    }
  },
  methods: {
    emptyModel () {
      if (this.properties.multiselect) return []
      return null
    },
    fill (value) {
      this.model = value
      if (this.properties.multiselect) {
        this.defaultItems = _.clone(value)
      } else if (_.isNil(value)) this.defaultItems = []
      else this.defaultItems = [_.clone(value)]
    },
    updateModel (items) {
      // filter rendering properties only if not used as data model properties
      const renderingProperties = ['value', 'label', 'icon']
      const filteredItems = items.map(function (item) {
        const filteredProperties = []
        renderingProperties.forEach(property => {
          if (!_.has(item, property)) filteredProperties.push(property)
        })
        return _.omit(item, filteredProperties)
      })
      if (this.properties.multiselect) this.model = filteredItems
      else this.model = filteredItems.length > 0 ? filteredItems[0] : null
      this.onChanged()
    }
  }
}
</script>
