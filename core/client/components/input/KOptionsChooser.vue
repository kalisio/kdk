<template>
  <k-action
    v-if="hasOptions"
    :id="id"
    :label="label"
    :tooltip="tooltip"
    :icon="icon"
    :color="color"
    :size="size"
    :badge="badge"
    :disabled="disabled">
    <template v-slot:content>
      <q-menu :id="`${id}-menu`"  transition-show="scale" transition-hide="scale" auto-close>
        <q-list>
          <q-item v-for="option in options" :key="option.value" clickable @click="onClicked(option)">
            <q-item-section>{{ option.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </template>
  </k-action>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-option-chooser',
  props: {
    id: {
      type: String,
      required: true
    },
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
      default: 'sm'
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
    badge () {
      return Object.assign({ floating: true, color: 'secondary' }, this.option)
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
