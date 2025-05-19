<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip v-if="model.name" icon="las la-cloud-upload-alt">
      {{ model.name }}
    </q-chip>
  </div>
  <!-- -->
  <q-field v-else-if="model"
    :for="properties.name + '-field'"
    v-model="model"
    :label="label"
    clearable
    @clear="onFileCleared"
    :disable="disabled"
  >
    <template v-slot:control>
      {{ model.name }}
    </template>
  </q-field>
  <q-file v-else
    :for="properties.name + '-field'"
    v-model="file"
    :label="label"
    :accept="acceptedTypes"
    :filter="filterSelectedFiles"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
    :disable="disabled"
    @update:model-value="onFileChanged"
    @rejected="onFileRejected">
    <!-- Helper -->
    <template v-if="hasHelper" v-slot:append>
      <KAction
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
  </q-file>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { markRaw } from 'vue'
import { baseField } from '../../mixins'
import { i18n } from '../../i18n.js'
import { Reader } from '../../reader.js'
import { Storage } from '../../storage.js'

export default {
  mixins: [baseField],
  data () {
    return {
      file: null,
      changed: false
    }
  },
  computed: {
    acceptedTypes () {
      return _.get(this.properties, 'field.mimeTypes', '')
    },
    maxFileSize () {
      return _.get(this.properties, 'field.maxSize', 1024 * 1024)
    }
  },
  methods: {
    emptyModel () {
      return null
    },
    filterSelectedFiles (files) {
      const filter = _.get(this.properties, 'field.filter')
      if (!filter) return files
      return _.filter(files, file => { return file.name.includes(filter) })
    },
    onFileCleared () {
      this.file = null
      this.error = ''
      this.onChanged()
    },
    async onFileChanged () {
      if (this.file) {
        // Check the size to display an explicit message
        if (this.file.size < this.maxFileSize) {
          // Check whether the file will be uploaded without being read
          if (!_.get(this.properties, 'field.readContent', true)) {
            this.model = { name: this.file.name, type: this.file.type }
            this.onChanged()
            this.changed = true
            return
          }
          // Check whether the file type is registered to be read by a reader
          const acceptedFiles = Reader.filter([this.file])
          if (acceptedFiles.length === 1) {
            const file = acceptedFiles[0]
            try {
              const content = await Reader.read(file)
              // Avoid making file content reactive as it might be large and it is not used in UI
              this.model = { name: this.file.name, type: this.file.type, content: markRaw(content) }
              this.onChanged()
              this.changed = true
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
    async apply (object, field) {
      // A template generates the final path for the file in storage based on object context so that we can only do it here
      // Check wether we need to upload file content
      if (this.model && _.get(this.properties, 'field.storage')) {
        let path = _.get(this.properties, 'field.storage.path')
        // The template generates the final path for the file in storage
        if (path) path = _.template(path)(Object.assign({}, { fileName: this.model.name }, object))
        this.model.key = path || this.model.name
      }
      baseField.methods.apply.call(this, object, field)
    },
    async upload (object, field) {
      if (_.get(this.model, 'key')) {
        // The template generates the final context for storage service
        let context = _.get(this.properties, 'field.storage.context')
        if (context) context = _.template(context)(Object.assign({}, { fileName: this.model.name }, object))
        const query = _.get(this.properties, 'field.storage.uploadQuery')
        logger.debug(`[KDK] Uploading file ${this.model.name} with key ${this.model.key}`)
        return Storage.upload({
          file: this.model.name,
          type: this.model.type,
          key: this.model.key,
          blob: this.file,
          context
        }, { query })
      }
    },
    async submitted (object, field) {
      // Check wether we need to upload file content
      if (this.changed) {
        // The template generates the final context for storage service
        this.upload(object, field)
          .then(() => {
            this.$notify({
              type: 'positive',
              message: i18n.t('KFileField.UPLOAD_FILE_SUCCEEDED',
                { file: this.model.name })
            })
          })
          .catch(error => {
            this.$notify({
              type: 'negative',
              message: i18n.t('KFileField.UPLOAD_FILE_ERRORED',
                { file: this.model.name })
            })
            logger.error(error)
          })
      }
    }
  }
}
</script>
