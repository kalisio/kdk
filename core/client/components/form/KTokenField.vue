<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <div v-html="text" />
  </div>
  <div  v-else class="q-pa-md">
    <p :class="labelClass">{{ label }}</p>
    <div class="row q-gutter-x-sm justify-center" id="token-field">
      <q-input
        v-for="i in tokenLength"
        :for="properties.name + '-field' + i"
        :id="properties.name + '-field'  + i"
        type="text"
        mask="#"
        v-model="fieldValues[i - 1]"
        style="width: 5ch"
        :disable="disabled"
        :autofocus="hasFocus"
        outlined
        :ref="el => updateFieldRef(el, i - 1)"
        @update:model-value='updateModel(i)'
        @blur="onChanged"
        @keyup="onKeyUp($event, i - 1)"
      >
        <!-- Helper -->
        <template v-if="hasHelper" v-slot:append>
          <k-action
            :id="properties.name + '-helper'"
            :label="helperLabel"
            :icon="helperIcon"
            :tooltip="helperTooltip"
            :url="helperUrl"
            :dialog="helperDialog"
            :context="helperContext"
            @dialog-confirmed="onHelperDialogConfirmed"
            color="primary"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { baseField } from '../../mixins'

export default {
  mixins: [baseField],
  data () {
    return {
      fieldValues: [],
      fields: []
    }
  },
  computed: {
    tokenLength () {
      return _.get(this.properties, 'tokenLength')
    },
    labelClass () {
      const classObject = {}
      classObject['row justify-center'] = true
      if (this.errorLabel) classObject['text-red'] = true
      return classObject
    }
  },
  methods: {
    updateModel (index) {
      this.model = _.join(this.fieldValues, '')
      this.onChanged()
      this.focusNextInput(index)
    },
    updateFieldRef (element, index) {
      if (element) this.fields[index] = element
    },
    focusNextInput (index) {
      if (_.inRange(index, 0, this.tokenLength)) this.fields[index].select()
    },
    clearInput (index) {
      this.fieldValues[index] = ''
    },
    onKeyUp (event, index) {
      const key = event.key
      if (key === 'ArrowLeft' || key === 'Backspace') {
        this.focusNextInput(index - 1)
        this.clearInput(index - 1)
      }
      if (key === 'ArrowRight') this.focusNextInput(index + 1)
    }
  }
}
</script>
