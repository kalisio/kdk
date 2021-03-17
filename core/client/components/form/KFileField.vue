<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip v-if="model.name" icon="las la-cloud-upload-alt">
      {{ model.name }}
    </q-chip>
  </div>
  <q-file v-else
    :for="properties.name + '-field'"
    :error="hasError"
    v-model="file"
    :label="helper"
    clearable
    counter
    :accept="getAcceptedTypes()"
    @clear="onFileCleared"
    @input="onFileChanged"
    @rejected="onFileRejected" />
</template>

<script>
import _ from 'lodash'
import { QFile } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-file-field',
  components: {
    QFile
  },
  mixins: [mixins.baseField],
  data () {
    return {
      file: null
    }
  },
  methods: {
    emptyModel () {
      return {}
    },
    getAcceptedTypes () {
      return _.get(this.properties.field, 'mimeTypes', '')
    },
    onFileCleared () {
      this.error = ''
      this.model = this.emptyModel()
    },
    onFileChanged () {
      const reader = new FileReader()
      reader.addEventListener('loadend', () => {
        this.error = ''
        let content = reader.result
        // Provide JSON object directly in this case
        if (this.getAcceptedTypes().includes('application/json')) content = JSON.parse(content)
        this.model = { name: this.file.name, content }
        this.onChanged()
      })
      reader.addEventListener('error', () => {
        this.error = 'KFileField.ERROR_WHILE_LOADING_THE_FILE'
        this.model = this.emptyModel()
      })
      reader.readAsText(this.file)
    },
    onFileRejected (file) {
      this.error = 'KFileField.INVALID_FILE_TYPE'
    }
  }
}
</script>
