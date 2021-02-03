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
      <q-menu id="menu" auto-close>
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
    },
    handler: {
      type: [Function],
      default: null
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
      option: this.options.length > 0 ? this.options[0] : undefined
    }
  },
  methods: {
    onClicked (option) {
      this.option = option
      if (this.handler) this.handler(option.value)
      this.$emit('triggered', option.value)
    }
  },
  created () {
    // load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
  }
}
</script>
