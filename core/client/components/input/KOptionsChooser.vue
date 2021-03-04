<template>
  <k-action
    v-if="hasOptions"
    id="options-chooser"
    :label="label"
    :tooltip="tooltip"
    :icon="computedIcon"
    :color="color"
    :size="size"
    :badge="computedBadge"
    :disabled="disabled">
    <template v-slot:content>
      <q-menu id="options-chooser-menu" ref="menu" transition-show="scale" transition-hide="scale">
        <q-list>
          <q-item v-for="option in computedOptions" :key="option.key" clickable @click="onClicked(option)">
            <q-item-section v-if="option.icon">
              <q-icon :name="option.icon" size="1.5rem" />
            </q-item-section>
            <q-item-section v-if="option.lablel">
              {{ option.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </template>
  </k-action>
</template>

<script>
import _ from 'lodash'
import { uid } from 'quasar'

export default {
  name: 'k-option-chooser',
  props: {
    label: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'grey-9'
    },
    size: {
      type: String,
      default: 'md'
    },
    options: {
      type: [Array],
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedOptions () {
      const options = []
      _.forEach(this.options, option => {
        if (!_.isEqual(option.value, this.option.value)) {
          option.key = uid()
          options.push(option)
        }
      })
      return options
    },
    computedIcon () {
      if (this.option) {
        return this.option.icon || this.icon
      }
      return undefined
    },
    computedBadge () {
      if (this.option) {
        if (this.option.badge) return { floating: true, color: 'secondary', label: this.option.badge }
      }
      return undefined
    },
    hasOptions () {
      return this.options.length > 0
    }
  },
  data () {
    return {
      option: undefined
    }
  },
  methods: {
    onClicked (option) {
      this.option = option
      this.$emit('option-chosen', option.value)
      this.$refs.menu.hide()
    }
  },
  created () {
    // load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
    // Set the default option if needed
    if (this.options.length > 0) {
      const defaultOption = _.head(_.filter(this.options, 'default'))
      this.option = defaultOption || this.options[0]
    }
  }
}
</script>
