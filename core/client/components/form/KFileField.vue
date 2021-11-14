<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip v-if="model.name" icon="las la-cloud-upload-alt">
      {{ model.name }}
    </q-chip>
  </div>
  <q-file v-else
    :for="properties.name + '-field'"
    v-model="file"
    :label="label"
    clearable
    counter
    :accept="getAcceptedTypes()"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
    @clear="onFileCleared"
    @input="onFileChanged"
    @rejected="onFileRejected">
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-file>
</template>

<script>
import _ from 'lodash'
import { QFile } from 'quasar'
import mixins from '../../mixins'
import { Reader } from '../../reader'

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
    async onFileChanged () {
      if (this.file) {
        try {
          const content = await Reader.read(this.file)
          this.model = { name: this.file.name, content }
          this.onChanged()
        } catch (error) {
          this.error = error
          this.model = this.emptyModel()
        }
      }
    },
    onFileRejected (file) {
      this.error = 'KFileField.INVALID_FILE_TYPE'
    }
  }
}
</script>
