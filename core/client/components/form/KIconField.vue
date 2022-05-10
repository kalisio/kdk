<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-icon :name="model.name" :color="model.color" />
  </div>
  <div v-else>
    <q-field
      :for="properties.name + '-field'"
      :value="model"
      :label="label"
      clearable
      :error-message="errorLabel"
      :error="hasError"
      :disabled="disabled"
      bottom-slots
      @clear="onCleared">
      <!-- Icon chooser -->
      <template v-slot:prepend>
        <q-btn
          id="icon-chooser-button"
          round
          flat
          icon="las la-icons"
          @click="onIconClicked" />
        <k-icon-chooser
          id="icon-chooser"
          ref="iconChooser"
          :icon-set="iconSet"
          :palette="color"
          @icon-choosed="onIconChoosed" />
      </template>
      <!-- Content -->
      <template v-slot:default>
        <q-icon
          class="q-pt-xs"
          size="sm"
          id="choosed-icon"
          :name="iconName"
          :color="iconColor" />
      </template>
      <!-- Helper -->
      <template v-if="helper" v-slot:hint>
        <span v-html="helper"></span>
      </template>
    </q-field>
  </div>
</template>

<script>
import { KIconChooser } from '../input'
import { baseField } from '../../mixins'
import { getIconName } from '../../utils'
import _ from 'lodash'

export default {
  name: 'k-icon-field',
  components: {
    KIconChooser
  },
  mixins: [baseField],
  computed: {
    hasIcon () {
      return !this.isEmpty()
    },
    iconName () {
      return getIconName(this.model, 'name')
    },
    iconColor () {
      // We support icon without a color
      return _.get(this.model, 'color', 'dark')
    }
  },
  data () {
    return {
      iconSet: _.get(this.properties.field, 'iconSet', 'font-awesome'),
      color: _.get(this.properties.field, 'color', true),
      inverted: _.get(this.properties.field, 'inverted', false)
    }
  },
  methods: {
    emptyModel () {
      // We support icon without a color, in this case we have a string as model
      return (this.color ? { name: '', color: '' } : '')
    },
    onFocused () {
      if (this.isEmpty()) this.$refs.iconChooser.open(this.model)
    },
    onCleared () {
      this.model = this.emptyModel()
      this.onChanged()
    },
    onIconClicked () {
      this.$refs.iconChooser.open(this.model)
    },
    onIconChoosed (icon) {
      // We support icon without a color, in this case we have a string as model
      this.model = (this.color ? Object.assign({}, icon) : icon)
      this.onChanged()
    }
  }
}
</script>
