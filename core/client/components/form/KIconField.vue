<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-icon :name="model.name" :color="model.color" />
  </div>
  <div v-else>
    <q-field
      :for="properties.name + '-field'"
      :value="model"
      :label="label"
      :error-message="errorLabel"
      :error="hasError"
      :disabled="disabled"
      bottom-slots
    >
      <!-- Content -->
      <template v-slot:default>
        <q-chip 
          id="choosed-icon" 
          clickable  
          v-ripple 
          :text-color="inverted ? iconColor : 'white'" 
          :icon="iconName" 
          :color="inverted ? 'white' : iconColor" 
          @click="onIconClicked" />
      </template>
      <!-- Helper -->
      <template v-if="helper" v-slot:hint>
        <span v-html="helper"></span>
      </template>
    </q-field>

    <k-icon-chooser
      id="icon-chooser"
      ref="iconChooser"
      :icon-set="iconSet"
      :palette="color"
      @icon-choosed="onIconChoosed" />
  </div>
</template>

<script>
import { QField, QChip, QInput, QIcon } from 'quasar'
import { KIconChooser } from '../input'
import mixins from '../../mixins'
import { getIconName } from '../../utils'
import _ from 'lodash'

export default {
  name: 'k-icon-field',
  components: {
    QField,
    QChip,
    QInput,
    QIcon,
    KIconChooser
  },
  mixins: [mixins.baseField],
  computed: {
    closable () {
      return !this.properties.required
    },
    iconName () {
      return getIconName(this.model, 'name')
    },
    iconColor () {
      // We support icon without a color
      return _.get(this.model, 'color', 'primary')
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
    onCloseClicked () {
      // We support icon without a color, in this case we have a string as model
      this.model = (this.color ? { name: '', color: '' } : '')
    },
    onIconClicked () {
      this.$refs.iconChooser.open(this.model)
    },
    onIconChoosed (icon) {
      // We support icon without a color, in this case we have a string as model
      this.model = (this.color ? Object.assign({}, icon) : icon)
    }
  }
}
</script>
