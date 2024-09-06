<template>
  <KAction
    v-if="hasOptions"
    id="options-chooser"
    :label="label"
    :tooltip="tooltip"
    :icon="computedIcon"
    :color="color"
    :size="size"
    :badge="computedBadge"
    :disabled="disabled">
      <q-popup-proxy
        id="options-chooser-popup"
        :auto-close="true"
        transition-show="scale"
        transition-hide="scale">
        <q-list class="bg-white">
          <q-item v-for="option in computedOptions" :key="option.key" clickable @click="onClicked(option)">
            <q-item-section v-if="option.icon">
              <q-icon :name="option.icon" size="1.5rem" />
            </q-item-section>
            <q-item-section v-if="option.badge || option.label">
              {{ option.badge || option.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-popup-proxy>
  </KAction>
</template>

<script>
import _ from 'lodash'
import { uid } from 'quasar'
import KAction from '../action/KAction.vue'

export default {
  name: 'k-option-chooser',
  components: {
    KAction
  },
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
    hideSelected: {
      type: Boolean,
      default: true
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
  emits: ['option-chosen'],
  computed: {
    computedOptions () {
      const options = []
      _.forEach(this.options, option => {
        if (!this.hideSelected || !_.isEqual(option.value, this.option.value)) {
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
        if (this.option.badge) return { floating: true, color: 'accent', label: this.option.badge }
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
    }
  },
  created () {
    // Set the default option if needed
    if (this.options.length > 0) {
      const defaultOption = _.head(_.filter(this.options, 'default'))
      this.option = defaultOption || this.options[0]
    }
  }
}
</script>
