<template>
  <div class="q-pl-sm row items-center q-gutter-sm">
    <template v-for="item in items">
      <q-chip
        dense
        removable
        color="primary"
        text-color="white"
        :key="item._id"
        :icon="itemIcon(item)"
        :label="itemName(item)"
        @remove="onItemRemoved(item)" />
    </template>
    <k-autocomplete v-if="!isCompleted"
      class="col"
      ref="autocomplete"
      :borderless="true"
      :clearable="false"
      :services="services"
      @changed="onAutocompleteChanged" />
  </div>
</template>

<script>
import _ from 'lodash'
import KAutocomplete from './KAutocomplete.vue'
import { getIconName } from '../../utils'

export default {
  name: 'k-item-chooser',
  components: {
    KAutocomplete
  },
  computed: {
    isCompleted () {
      return this.multiselect ? false : (this.items.length > 0)
    }
  },
  props: {
    defaultItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    services: {
      type: Array,
      required: true
    },
    multiselect: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    defaultItems: function () {
      this.items = _.clone(this.defaultItems)
    },
    services: function () {
      this.clear()
    }
  },
  data () {
    return {
      items: [],
      pattern: ''
    }
  },
  methods: {
    itemIcon (item) {
      // Make this work on either icon object like { name: xxx, color: yyy } or icon names
      const icon = getIconName(item)
      return (icon || getIconName(item, 'icon'))
    },
    itemName (item) {
      if (item.value) return item.value
      else return item.name
    },
    clear () {
      this.items = []
      this.pattern = ''
      this.$refs.autocomplete.clear()
    },
    onItemRemoved (oldItem) {
      this.items = this.items.filter(item => item._id !== oldItem._id)
      this.$emit('changed', this.items, this.pattern)
    },
    onAutocompleteChanged (value) {
      if (typeof value === 'string') {
        // The input pattern has changed
        this.pattern = value
        this.$emit('changed', this.items, this.pattern)
      } else {
        // An item has been selected
        if (_.findIndex(this.items, item => item._id === value._id) === -1) {
          // Check wether a limit has been defined for the service
          if (value.limit) {
            const serviceItems = _.filter(this.items, { service: value.service })
            if (serviceItems.length === value.limit) {
              _.remove(this.items, { _id: serviceItems.pop()._id })
            }
          }
          this.$refs.autocomplete.clear()
          this.pattern = ''
          this.items.push(value)
          this.$emit('changed', this.items, this.pattern)
        }
      }
    }
  }
}
</script>
