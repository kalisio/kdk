<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-chip :color="model.color" dense>
      {{ model.name }}
    </q-chip>
  </div>
  <q-select v-else
    ref="select"
    :for="properties.name + '-field'"
    v-model="items"
    :label="label"
    :multiple="properties.multiselect"
    hide-dropdown-icon
    use-input
    clearable
    :error-message="errorLabel"
    :error="hasError"
    :disabled="disabled"
    bottom-slots
    :options="options"
    @filter="onSearch"
    @input="onSelected">
     <!-- Value display -->
    <template v-slot:selected-item="scope">
      <q-chip
        removable
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        color="primary"
        text-color="white"
      >
        <q-avatar color="primary" :icon="scope.opt.icon" />
        {{ scope.opt.label }}
      </q-chip>
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar>
          <q-icon :name="scope.opt.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
import { Search } from '../../search'
import mixins from '../../mixins'

export default {
  name: 'k-item-field',
  mixins: [mixins.baseField],
  data () {
    return {
      items: null,
      options: [],
    }
  },
  methods: {
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
            return item1.value === item2.value 
          })
        } else this.options = results
        this.$refs.select.updateInputValue('')
      })
    },
    onSelected (value) {
      if (value) {
        if (this.properties.multiselect) this.model = _.map(this.items, item => { return item.data })
        else this.model = this.items.data
      } else this.model = this.emptyModel()
      this.options = []
      this.onChanged()
    }
  }
}
</script>
