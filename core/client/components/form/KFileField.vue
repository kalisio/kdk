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
    :accept="acceptedTypes"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
    @clear="onFileCleared"
    @update:model-value="onFileChanged"
    @rejected="onFileRejected">
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-file>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { baseField } from '../../mixins'
import { i18n } from '../../i18n.js'
import { Reader } from '../../reader.js'
import { Storage } from '../../storage.js'

export default {
  mixins: [baseField],
  data () {
    return {
      file: null
    }
  },
  computed: {
    acceptedTypes () {
      return _.get(this.properties.field, 'mimeTypes', '')
    },
    maxFileSize () {
      return _.get(this.properties.field, 'maxSize', 1024 * 1024)
    }
  },
  methods: {
    emptyModel () {
      return null
    },
    onFileCleared () {
      this.model = this.emptyModel()
      this.error = ''
    },
    async onFileChanged () {
      if (this.file) {
        // Check the size to display an explicit message
        if (this.file.size < this.maxFileSize) {
          // Check whether the file type is registered to be read by a reader
          const acceptedFiles = Reader.filter([this.file])
          if (acceptedFiles.length === 1) {
            const file = acceptedFiles[0]
            try {
              const content = await Reader.read(file)
              this.model = { name: this.file.name, type: this.file.type, content }
              this.onChanged()
            } catch (error) {
              this.error = error
              this.model = this.emptyModel()
            }
          } else {
            this.error = 'KFileField.INVALID_FILE_TYPE'
            this.model = this.emptyModel()
          }
        } else {
          this.error = 'KFileField.INVALID_FILE_SIZE'
          this.model = this.emptyModel()
        }
      }
    },
    onFileRejected (file) {
      this.error = 'KFileField.INVALID_FILE_TYPE'
    },
    async submitted (object, field) {
      if (this.model && this.properties.field.storage) {
        const context = this.properties.field.storage.context
        const path = this.properties.field.storage.path
        const key = path ? path + '/' + this.model.name : this.model.name
        logger.debug(`upload fle ${this.model.name} with key ${key}`)
        const response = await Storage.upload({
          file: this.model.name,
          type: this.model.type,
          key,
          buffer: this.model.content,
          context
        })
        if (response.ok) {
          this.$notify({
            type: 'positive',
            message: i18n.t('KFileField.UPLOAD_FILE_SUCCEEDED',
              { file: this.model.name })
          })
        } else {
          this.$notify({
            type: 'negative',
            message: i18n.t('KFileField.UPLOAD_FILE_ERRORED',
              { file: this.model.name })
          })
        }
      }
    }
  }
}
</script>
