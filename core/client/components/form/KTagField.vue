<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <template v-for="(chip, index) in model">
      <q-chip
        :key="chip.value + '-' + index"
        :icon="chip.icon.name"
        :color="chip.icon.color"
        outline
        dense>
        {{chip.value}}
      </q-chip>
    </template>
  </div>
  <div v-else>
    <q-select
      ref="select"
      :for="properties.name + '-field'"
      v-model="tags"
      :label="label"
      :multiple="true"
      hide-dropdown-icon
      use-input
      clearable
      new-value-mode="add-unique"
      :error-message="errorLabel"
      :error="hasError"
      :disabled="disabled"
      bottom-slots
      :options="options"
      @filter="onSearch"
      @input="onSelected"
      @new-value="onAdded">
      <!-- Value display -->
      <template v-slot:selected-item="scope">
        <q-chip
          outline
          square
          removable
          @remove="scope.removeAtIndex(scope.index)"
          :color="getColor(scope.opt)"
          :tabindex="scope.tabindex">
          <q-icon v-if="hasIcon(scope.opt)" class="q-pr-sm" :name="getIcon(scope.opt)" :color="getColor(scope.opt)" />
          {{ scope.opt.value }}
        </q-chip>
      </template>
      <!-- Options display -->
      <template v-slot:option="scope">
        <q-item
          :id="scope.opt.value"
          v-bind="scope.itemProps"
          v-on="scope.itemEvents">
          <q-item-section v-if="hasIcon(scope.opt)" avatar>
            <q-icon :name="getIcon(scope.opt)" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.value }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <!-- Helper -->
      <template v-if="helper" v-slot:hint>
        <span v-html="helper"></span>
      </template>
    </q-select>
  </div>
</template>

<script>
import _ from 'lodash'
import { Store } from '../../store'
import { Search } from '../../search'
import mixins from '../../mixins'

export default {
  name: 'k-tag-field',
  mixins: [mixins.baseField],
  data () {
    return {
      services: [{
        service: 'tags',
        baseQuery: { scope: this.properties.scope },
        field: 'value'
      }],
      tags: [],
      options: []
    }
  },
  methods: {
    hasIcon (item) {
      return !_.isEmpty(this.getIcon())
    },
    getIcon (item) {
      return _.get(item, 'icon.name')
    },
    getColor (item) {
      return _.get(item, 'icon.color')
    },
    emptyModel () {
      return []
    },
    fill (value) {
      this.model = value
      // Update tags as well but only those of current context as tag service can be contextual
      const context = Store.get('context')
      this.partition = _.partition(this.model, { context: _.get(context, '_id') })
      this.tags = this.partition[0]
    },
    async onSearch (pattern, update, abort) {
      if (pattern.length < 2) {
        abort()
        return
      }
      const results = await Search.query(this.services, pattern)
      update(() => {
        this.options = _.differenceWith(results, this.tags, (tag1, tag2) => {
          return tag1.value === tag2.value
        })
      })
    },
    onSelected (value) {
      this.options = []
      if (value) this.$refs.select.updateInputValue('')
      else this.tags = [] // cleared
      this.updateModel()
    },
    onAdded (value, done) {
      // Add the value if and only if it is not an option or it is already added
      if (!_.find(this.options, { value }) && !_.find(this.tags, { value })) {
        const tag = { 
          value: value,
          scope: this.properties.scope,
          icon: {
            name: '',
            color: ''
          }
        }
        done(tag)
        this.$refs.select.updateInputValue('')
        this.updateModel()
      }
    },
    updateModel () {
      // filter rendering properties only
      this.model = _.concat(this.tags, this.partition[1])
      this.onChanged()
    }
  }
}
</script>
