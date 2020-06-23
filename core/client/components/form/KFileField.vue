<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip v-if="model.name" icon="las la-cloud-upload-alt">
      {{ model.name }}
    </q-chip>
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :error-message="errorLabel"
    :error="hasError"
    :disabled="disabled"
    no-error-icon
    bottom-slots
  >
    <q-chip v-if="model.name">
      {{ model.name }}
    </q-chip>
    <k-file-input
      :id="properties.name + '-field'"
      v-bind="properties.field"
      :clearable="true"
      @cleared="onInputFileCleared"
      @rejected="onInputFileRejected"
      @failed="onInputFileFailed"
      @loaded="onInputFileLoaded" />
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-field>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'
import { KFileInput } from '../input'

export default {
  name: 'k-file-field',
  components: {
    KFileInput
  },
  mixins: [mixins.baseField],
  methods: {
    emptyModel () {
      return {}
    },
    onInputFileCleared () {
      this.error = ''
      this.model = this.emptyModel()
    },
    onInputFileRejected (file) {
      this.error = 'KFileField.INVALID_FILE_TYPE'
    },
    onInputFileFailed (file) {
      this.error = 'KFileField.ERROR_WHILE_LOADING_THE_FILE'
    },
    onInputFileLoaded (file, content) {
      this.error = ''
      // Provide JSON object directly in this case
      const mimeTypes = _.get(this, 'properties.field.mimeTypes', [])
      if (mimeTypes.includes('application/json')) content = JSON.parse(content)
      this.model = { name: file.name, size: file.size, content }
      this.onChanged()
    }
  }
}
</script>
