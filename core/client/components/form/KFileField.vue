<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip v-if="!multiple && model?.name">
      {{ model.name }}
    </q-chip>
    <q-chip v-else
      v-for="file in [].concat(model)"
      :key="file.name"
      icon="las la-cloud-upload-alt"
    >
      {{ file.name }}
    </q-chip>
  </div>

  <q-field v-else-if="model && !multiple"
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
    v-model="files"
    :label="label"
    :accept="acceptedTypes"
    :filter="filterSelectedFiles"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
    :disable="disabled"
    :multiple="true"
    :append="multiple"
    :clearable="multiple"
    :use-chips="multiple"
    :max-files="maxFiles"
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
import { Notify } from 'quasar'
import { baseField } from '../../mixins'
import { i18n } from '../../i18n.js'
import { Reader } from '../../reader.js'
import { Storage } from '../../storage.js'

export default {
  mixins: [baseField],
  data () {
    return {
      files: null,
      changed: false
    }
  },
  computed: {
    acceptedTypes () {
      return _.get(this.properties, 'field.mimeTypes', '')
    },
    maxFileSize () {
      return _.get(this.properties, 'field.maxSize', 1024 * 1024)
    },
    maxFiles () {
      return _.get(this.properties, 'field.maxFiles', 1)
    },
    multiple () {
      return _.get(this.properties, 'field.multiple', false)
    }
  },
  methods: {
    emptyModel () {
      return this.multiple ? [] : null
    },
    filterSelectedFiles (files) {
      const filter = _.get(this.properties, 'field.filter')
      if (!filter) return files
      return _.filter(files, file => file.name.includes(filter))
    },
    onFileCleared () {
      this.files = null
      this.error = ''
      this.onChanged()
    },
    async onFileChanged () {
      const selectedFiles = [].concat(this.files || [])
      const result = []
      for (const file of selectedFiles) {
        if (file.size > this.maxFileSize) {
          this.error = 'KFileField.INVALID_FILE_SIZE'
          continue
        }

        // Check whether the file will be uploaded without being read
        if (!_.get(this.properties, 'field.readContent', true)) {
          result.push({ name: file.name, type: file.type })
          continue
        }

        // Check whether the file type is registered to be read by a reader
        const accepted = Reader.filter([file])
        if (accepted.length === 1) {
          try {
            const content = await Reader.read(accepted[0])
            // Avoid making file content reactive as it might be large and it is not used in UI
            result.push({ name: file.name, type: file.type, content: markRaw(content) })
          } catch (err) {
            this.error = err
          }
        } else {
          this.error = 'KFileField.INVALID_FILE_TYPE'
        }
      }

      this.model = this.multiple ? result : result[0] || this.emptyModel()
      this.changed = true
      this.onChanged()
    },
    onFileRejected (errs) {
      const errors = [].concat(errs)
      for (const error of errors) {
        if (error?.failedPropValidation === 'max-files') this.error = i18n.tc('directives.MAX_FILES_REACHED', this.maxFiles)
        else this.error = 'KFileField.INVALID_FILE_TYPE'
      }
    },
    async apply (object, field) {
      // A template generates the final path for the file in storage based on object context so that we can only do it here
      // Check wether we need to upload file content
      const files = this.multiple ? this.model || [] : [this.model]
      for (const file of files) {
        if (file && _.get(this.properties, 'field.storage')) {
          let path = _.get(this.properties, 'field.storage.path')
          // The template generates the final path for the file in storage
          if (path) path = _.template(path)({ ...object, fileName: file.name })
          file.key = this.multiple ? path + '/' + file.name : path || file.name
        }
      }
      baseField.methods.apply.call(this, object, field)
    },
    async upload (object, field) {
      const files = this.multiple ? this.model || [] : [this.model]
      const promises = files.map(async file => {
        if (file && file.key) {
          // The template generates the final context for storage service
          let context = _.get(this.properties, 'field.storage.context')
          if (context) context = _.template(context)({ ...object, fileName: file.name })
          const query = _.get(this.properties, 'field.storage.uploadQuery')
          logger.debug(`[KDK] Uploading file ${file.name} with key ${file.key}`)
          return Storage.upload({
            file: file.name,
            type: file.type,
            key: file.key,
            blob: (this.files || []).find(f => f.name === file.name),
            context
          }, { query })
        }
      })
      return Promise.all(promises)
    },
    async submitted (object, field) {
      // Check whether we need to upload file content
      if (this.changed) {
        // The template generates the final context for storage service
        this.upload(object, field)
          .then(() => {
            const files = this.multiple ? this.model : [this.model]
            Notify.create({
              type: 'positive',
              message: i18n.t('KFileField.UPLOAD_FILE_SUCCEEDED', {
                file: files.map(f => f.name).join(', ')
              })
            })
          })
          .catch(error => {
            Notify.create({
              type: 'negative',
              message: i18n.t('KFileField.UPLOAD_FILE_ERRORED')
            })
            logger.error(error)
          })
      }
    }
  }
}
</script>
