<template>
  <q-select
    use-input
    hide-selected
    :clearable="clearable"
    :borderless="borderless"
    dropdown-icon=""
    v-model="pattern"
    :options="options"
    @filter="onSearch"
    @input="onSelected">
    <template v-if="services.length" v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">{{$t('KAutocomplete.NO_RESULTS')}}</q-item-section>
      </q-item>
    </template>
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar>
          <q-icon :name="scope.opt.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label v-html="scope.opt.label" />
          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
import { processIcon } from '../../utils'

export default {
  name: 'k-autocomplete',
  props: {
    services: {
      type: Array,
      required: true
    },
    minLength: {
      type: Number,
      default: 2
    },
    borderless: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    processResults: {
      type: Function
    }
  },
  data () {
    return {
      pattern: '',
      options: []
    }
  },
  methods: {
    clear () {
      this.pattern = ''
    },
    async onSearch (pattern, update, abort) {
      if (pattern.length < this.minLength) {
        abort()
        // Emit change on clear
        if (!pattern) this.$emit('changed', '')
        return
      }
      // Perform request for partial match to all registered services
      const requests = this.services.map(serviceDescriptor => {
        const service = this.$api.getService(serviceDescriptor.service)
        // build the query using given templet if any
        const query = Object.assign({}, serviceDescriptor.baseQuery)
        // Then add partial match
        // We don't use set by dot here because Mongo queries on nested fields
        // require the key to contain the path and not nested objects
        // _.set(query, serviceDescriptor.field, { $search: pattern })

        query[serviceDescriptor.field] = { $search: pattern }
        return service.find({ query })
      })
      const responses = await Promise.all(requests)
      const results = []
      for (let i = 0; i < responses.length; i++) {
        const response = responses[i]
        const serviceDescriptor = this.services[i]
        if (response.total > 0) {
          response.data.forEach(data => {
            data.service = serviceDescriptor.service
            data.field = serviceDescriptor.field
            if (!data.icon) data.icon = serviceDescriptor.icon
            const result = {
              label: _.get(data, serviceDescriptor.field),
              value: _.get(data, serviceDescriptor.field),
              icon: _.get(data, serviceDescriptor.iconField || 'icon.name')
            }
            processIcon(result, 'icon')
            if (serviceDescriptor.subfield) {
              data.subfield = serviceDescriptor.subfield
              result.description = _.get(data, serviceDescriptor.subfield)
            }
            Object.assign(result, { data: data })
            results.push(result)
          })
        }
      }
      if (this.processResults) {
        this.processResults(pattern, results)
      }
      this.$emit('changed', pattern)
      update(() => { this.options = results })
    },
    onSelected (item) {
      // Can be null on clear
      this.$emit('changed', item ? item.data : {})
    }
  }
}
</script>
