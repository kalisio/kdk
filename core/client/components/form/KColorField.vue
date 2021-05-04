<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <div :style="`width: 50px; height: 18px; border-radius: 3px; background-color: ${model};`" />
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :label="label"
    :value="model"
    :error-message="errorLabel"
    :error="hasError"
    :disabled="disabled"
    clearable
    bottom-slots
    @click.native="picker = true"
    @clear="model=''">
    <!-- control -->
    <template v-slot:control>
      <div :style="`width: 50px; height: 18px; border-radius: 3px; background-color: ${model};`" />
      <q-dialog v-model="picker">
        <q-color no-header format-model="hex" v-model="model" @changed="picker = false"/>
      </q-dialog>
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-field>
</template>

<script>
import { QDialog, QColor } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-datetime-field',
  components: {
    QDialog, QColor
  },
  mixins: [mixins.baseField],
  data () {
    return {
      picker: false
    }
  },
  methods: {
    emptyModel () {
      return ''
    }
  }
}
</script>
