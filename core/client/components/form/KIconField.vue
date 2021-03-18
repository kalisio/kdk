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
          dense 
          v-ripple 
          text-color="white" 
          :icon="iconName" 
          :color="model.color" 
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
    }
  },
  data () {
    return {
      iconSet: _.get(this.properties.field, 'iconSet', undefined)
    }
  },
  methods: {
    emptyModel () {
      return { name: '', color: '' }
    },
    onCloseClicked () {
      this.model = { name: '', color: '' }
    },
    onIconClicked () {
      this.$refs.iconChooser.open(this.model)
    },
    onIconChoosed (icon) {
      this.model = Object.assign({}, icon)
    }
  }
}
</script>
