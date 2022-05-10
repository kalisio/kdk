<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip v-for="file in files" :key="file.name" square icon="las la-cloud-upload-alt">
      {{ file.name }}
    </q-chip>
  </div>
  <div v-else>
    <!--
      The field
    -->
    <q-field
      :for="properties.name + '-field'"
      :value="files"
      :label="label"
      :error-message="errorLabel"
      :error="hasError"
      :disabled="disabled"
      bottom-slots
    >
      <!-- Upload icon -->
      <template v-slot:prepend>
        <q-btn
          :id="properties.name + '-field'"
          dense
          round
          flat
          icon="las la-cloud-upload-alt"
          @click="onUpload" />
      </template>
      <!-- Content -->
      <template v-slot:default>
        <div class="full-width row">
          <template class="col-12" v-for="file in files" :key="file.name">
            <q-chip
              square
              dense
              color="primary"
              text-color="white"
              :label="fileName(file)"
              @remove="onFileRemoved(file)"
              removable />
          </template>
          <k-uploader class="col-12" v-show="isUploaderVisible"
            ref="uploader"
            :resource="resource"
            @file-selection-changed="updateFiles"
            :options="properties.field" />
        </div>
      </template>
      <!-- Helper -->
      <template v-if="helper" v-slot:hint>
        <span v-html="helper"></span>
      </template>
    </q-field>
  </div>
</template>

<script>
import _ from 'lodash'
import { KUploader } from '../input'
import { baseField } from '../../mixins'

export default {
  name: 'k-attachment-field',
  components: {
    KUploader
  },
  mixins: [baseField],
  data () {
    return {
      isUploaderVisible: false,
      files: [],
      resource: ''
    }
  },
  computed: {
    maxFiles () {
      return (this.isMultiple() ? _.get(this.properties, 'maxFiles', 5) : 1)
    }
  },
  methods: {
    isMultiple () {
      return _.get(this.properties, 'field.multiple', false)
    },
    autoProcessQueue () {
      return _.get(this.properties, 'field.autoProcessQueue', true)
    },
    isObject () {
      return (this.properties.type === 'object')
    },
    emptyModel () {
      if (this.isMultiple()) return []
      return (this.isObject() ? {} : '')
    },
    async fill (value, object) {
      // Keep trak of object ID if any because it might be required to build the storage path
      if (object) {
        this.resource = object._id
      }
      this.model = value
      if (this.isMultiple()) {
        this.files = this.model
      } else {
        this.files = (!_.isEmpty(this.model) ? [this.model] : [])
      }
      if (!this.readOnly) {
        // We need to force a refresh so that the prop is correctly updated by Vuejs in child component
        await this.$nextTick()
        this.$refs.uploader.initialize(this.files)
      }
    },
    async apply (object, field) {
      // If not processing uploads on-the-fly upload when the form is being submitted on update
      // because we already have the object ID that might be required to build the storage path
      this.createAttachmentOnSubmit = false // Reset state

      if (!this.autoProcessQueue()) {
        // On create we don't send the attachment field because it will be
        // updated as a postprocess when attaching files on the newly created object
        if (object._id) {
          this.resource = object._id
          // We need to force a refresh so that the prop is correctly updated by Vuejs in child component
          await this.$nextTick()
          await this.$refs.uploader.processQueue()
          _.set(object, field, this.value())
        } else {
          this.createAttachmentOnSubmit = true
        }
      } else {
        _.set(object, field, this.value())
      }
    },
    async submitted (object, field) {
      // If not processing uploads on-the-fly upload when the form has being submitted on create
      // so that we have the object ID available that might be required to build the storage path
      if (!this.autoProcessQueue()) {
        // On update the files are created before updating the object
        if (this.createAttachmentOnSubmit) {
          this.resource = object._id
          // We need to force a refresh so that the prop is correctly updated by Vuejs in child component
          await this.$nextTick()
          await this.$refs.uploader.processQueue()
        }
      }
    },
    updateFiles (files) {
      this.files = []
      files.forEach(file => this.files.push(file))
      this.updateModel()
      // Hide uploader if full
      if (this.isMultiple() && (this.files.length >= this.maxFiles)) this.isUploaderVisible = false
    },
    updateModel () {
      // filter rendering properties only
      if (this.isMultiple()) {
        this.model = this.files
      } else {
        this.model = (this.files.length > 0 ? this.files[0] : {})
      }
      this.onChanged()
    },
    fileName (file) {
      return (file.name
        ? file.name
        : (file._id ? file._id : file))
    },
    onUpload () {
      // Simply open file dialog for single selection mode
      if (!this.isMultiple()) {
        this.$refs.uploader.initialize([])
        this.$refs.uploader.openFileInput()
      } else {
        // Otherwise display drop zone
        this.isUploaderVisible = !this.isUploaderVisible
        // And open file dialog the first time
        if (this.isUploaderVisible && (this.files.length === 0)) this.$refs.uploader.openFileInput()
      }
    },
    onFileRemoved (oldFile) {
      this.$refs.uploader.removeFile(oldFile)
    }
  }
}
</script>
