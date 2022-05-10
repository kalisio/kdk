<template>
  <span>TODDO replace dropzone</span>
  <!--drop-zone v-if="dropZoneOptions"
    ref="dropZone"
    id="dropZone"
    @vdropzone-file-added="onFileAdded"
    @vdropzone-success="onFileUploaded"
    @vdropzone-removed-file="onFileRemoved"
    @vdropzone-sending="onFileSending"
    @vdropzone-thumbnail="onThumbnailGenerated"
    @vdropzone-error="onError"
    :options="dropZoneOptions"
    :destroyDropzone="false" /-->
</template>

<script>
import _ from 'lodash'
// import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import mime from 'mime'
// import DropZone from 'vue2-dropzone'
// import { refsResolver } from '../../mixins'

export default {
  name: 'k-uploader',
  // mixins: [refsResolver(['dropZone'])],
  /* components: {
    DropZone
  }, */
  props: {
    resource: {
      type: String,
      default: ''
    },
    baseQuery: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dropZoneOptions: null,
      files: []
    }
  },
  methods: {
    isMultiple () {
      return _.get(this.options, 'multiple', false)
    },
    autoProcessQueue () {
      return _.get(this.options, 'autoProcessQueue', true)
    },
    resourcesService () {
      return _.get(this.options, 'resourcesService', '')
    },
    resourceField () {
      return _.get(this.options, 'resourceField', 'attachments')
    },
    checkFile (fileToAdd, done) {
      const duplicatedFiles = _.filter(this.files, file => file.name === fileToAdd.name)
      if (duplicatedFiles.length > 1) done(this.$t('errors.DUPLICATED_FILE', { file: fileToAdd.name }))
      else done()
    },
    addFile (addedFile) {
      this.files.push(addedFile)
      this.$emit('file-selection-changed', this.files)
    },
    updateFile (updatedFile) {
      const index = _.findIndex(this.files, file => file.name === updatedFile.name)
      if (index >= 0) {
        this.files[index] = updatedFile
        this.$emit('file-selection-changed', this.files)
      }
    },
    removeFile (removedFile) {
      const index = _.findIndex(this.files, file => file.name === removedFile.name)
      if (index >= 0) {
        // When processing uploads on-the-fly we need to remove from server
        if (this.autoProcessQueue()) {
          // Possible on max files exceeded
          if (removedFile.status !== 'error') {
            this.storageService().remove(this.files[index]._id, {
              query: Object.assign({ resource: this.resource, resourcesService: this.resourcesService() }, this.baseQuery)
            })
            // Thumbnail as well
            const mimeType = mime.lookup(removedFile.name)
            // We only store thumbnails for images
            if (mimeType.startsWith('image/')) this.storageService().remove(this.files[index]._id + '.thumbnail')
          }
        }
        // Clean preview as well
        const preview = this.previews[index]
        if (preview) {
          this.clearPreview(preview)
          _.pullAt(this.previews, index)
        }
        _.pullAt(this.files, index)

        this.$emit('file-selection-changed', this.files)
      }
    },
    onThumbnailGenerated (sourceFile, dataUrl) {
      const mimeType = mime.lookup(sourceFile.name)
      // We only store thumbnails for images
      if (!mimeType.startsWith('image/')) return
      const index = _.findIndex(this.files, file => file.name === sourceFile.name)
      if (index >= 0) {
        // Check if thumbnail has already been generated
        if (sourceFile.thumbnail) return
        const id = this.generateFileId(sourceFile)
        // When processing uploads on-the-fly send thumbnail to the server once computed
        if (this.autoProcessQueue()) {
          this.storageService().create({ id: id + '.thumbnail', uri: dataUrl })
        } else {
          // Check if the file has already been uploaded because it is an asynchronous process
          // that might happen before the thumbnail has been generated
          if (sourceFile._id) {
            this.storageService().create({ id: id + '.thumbnail', uri: dataUrl })
          } else {
            // Otherwise store it temporarily until the file is uploaded
            sourceFile.thumbnail = dataUrl
          }
        }
      }
    },
    generateFileId (file) {
      const idTemplate = _.get(this.options, 'storagePath')
      // If a template is given for the storage path use it,
      // otherwise it will be stored at the root level with a generated hash
      if (idTemplate) {
        // Inject useful properties such as current object ID, file, etc.
        const environment = { id: this.resource, file }
        // The template generates the final ID for the file in storage
        return _.template(idTemplate)(environment)
      } else {
        return this.resource
      }
    },
    onFileSending (file, xhr, formData) {
      const id = this.generateFileId(file)
      formData.set('id', id)
      // If we attach file to an existing resource add required parameters
      const resourcesService = this.resourcesService()
      if (resourcesService && this.resource) {
        formData.set('resource', this.resource)
        formData.set('resourcesService', resourcesService)
        formData.set('field', this.resourceField())
      }
      _.forOwn(this.baseQuery, (value, key) => {
        formData.set(key, value)
      })
      // When not processing uploads on-the-fly send thumbnail to the server along with the file
      const mimeType = mime.lookup(file.name)
      // We only store thumbnails for images
      if (!mimeType.startsWith('image/')) return
      // Check if it does exist however because it is processed asynchronously
      if (file.thumbnail) {
        this.storageService().create({ id: id + '.thumbnail', uri: file.thumbnail })
      }
    },
    onFileAdded (addedFile) {
      // Filter all internal properties used by drop zone
      this.addFile(_.pick(addedFile, ['name', 'size', '_id']))
      // Keep track of previews for cleanup
      this.previews.push(addedFile.previewElement)
      const mimeType = mime.lookup(addedFile.name)
      if (mimeType === 'application/pdf') {
        // This is not an image, so Dropzone doesn't create a thumbnail.
        // TODO : this.dropZoneInstance().emit('thumbnail', addedFile, 'icons/kdk/pdf.png')
      }
    },
    onFileUploaded (addedFile, response) {
      // We update file list on successful upload
      this.updateFile(response)
    },
    onFileRemoved (removedFile, error, xhr) {
      // the file can be removed if not accepted
      const accepted = removedFile.accepted || true
      if (accepted) this.removeFile(removedFile)
    },
    onError (file, error, xhr) {
      // This is required if we don't want the file to be viewed
      this.dropZone().removeFile(file)
      // The error message is already translated using the DropZone dictionary
      this.$events.$emit('error', { message: error })
    },
    storageService () {
      let service = _.get(this.options, 'service', 'storage')
      // Inject useful properties such as current object ID, etc.
      const environment = { id: this.resource }
      // The template generates the final storage service path
      service = _.template(service)(environment)

      return this.$api.getService(service)
    },
    dropZone () {
      // Access vue drop zone
      return this.$refs.dropZone
    },
    dropZoneInstance () {
      // Access underlying dropzone object
      return this.$refs.dropZone.dropzone
    },
    async updateDropZoneOptions () {
      const accessToken = await this.$api.passport.getJWT()
      const options = _.omit(this.options, ['service', 'storagePath'])
      // We change interpolation tags to avoid interpolation by i18n next since drop zone will do it
      const dictionary = this.$t('KUploader.dropZone', { returnObjects: true, interpolation: { prefix: '[[', suffix: '[[' } })
      // Setup upload URL, credentials, etc. from input options
      this.dropZoneOptions = Object.assign({
        accept: this.checkFile,
        addRemoveLinks: true,
        // FIXME: for now we send files sequentially
        // Indeed when we attach files to a resource as a post process of form submission
        // our backend does not handle multiple files at once
        uploadMultiple: false,
        // Similarly it does not support attaching multiple files to the same resource simultaneously
        parallelUploads: 1,
        params: {
          isArray: this.isMultiple()
        },
        // Uploading can require a long time
        timeout: 60 * 60 * 1000 // 1h should be sufficient since we also have size limits
      }, options, dictionary)
      // We use a function as the service path might be templated by the underlying resource
      this.dropZoneOptions.url = () => {
        // Depending on the transport the path starts or not with '/'
        let servicePath = this.storageService().path
        if (!servicePath.startsWith('/')) servicePath = '/' + servicePath
        return this.$api.getBaseUrl() + servicePath
      }
      // This is used to ensure the request will be authenticated by Feathers
      this.dropZoneOptions.headers = { Authorization: accessToken }
    },
    processQueue () {
      if (this.dropZone().getQueuedFiles().length === 0) {
        return Promise.resolve()
      } else {
        return new Promise((resolve, reject) => {
          // Register to upload complete event
          this.dropZone().$on('vdropzone-queue-complete', () => {
            this.dropZone().$off('vdropzone-queue-complete')
            resolve()
          })
          // Then launch upload
          this.dropZone().processQueue()
        })
      }
    },
    clearPreview (preview) {
      // Code taken from removedfile method of DropZone.js
      if (preview.parentNode) {
        preview.parentNode.removeChild(preview)
      }
    },
    clearPreviews () {
      this.previews.forEach(preview => this.clearPreview(preview))
      this.previews = []
    },
    clearFiles () {
      this.files = []
      // Reset drop zone
      if (this.dropZone()) this.dropZone().removeAllFiles(true)
    },
    clear () {
      // FIXME: for now we need to remove previous preview elements manually
      // Indeed the previous method does not seem to work for this
      this.clearPreviews()
      this.clearFiles()
    },
    async initialize (defaultFiles = []) {
      this.clear()
      // Then setup existing files on server
      defaultFiles.forEach(async file => {
        this.dropZoneInstance().emit('addedfile', file)
        // Make sure that there is no progress bar, etc...
        this.dropZoneInstance().emit('complete', file)
        const mimeType = mime.lookup(file.name)
        // We only generate thumbnails for images
        if (file._id && mimeType.startsWith('image/')) {
          // Download thumbnail
          const image = await this.storageService().get(file._id + '.thumbnail')
          // Indicate that the thumbnail does not need to be stored
          file.thumbnail = image.uri
          this.dropZoneInstance().emit('thumbnail', file, image.uri)
        }
      })
      // Because this is dynamic we need to modify the instance as the vue drop zone is not updated automatically
      this.dropZoneInstance().options.maxFiles = 1
      if (this.isMultiple()) {
        // Adjust maxFiles with files already uploaded to get the correct amount
        this.dropZoneInstance().options.maxFiles = _.get(this.options, 'maxFiles', 5) - defaultFiles.length
      }
    },
    openFileInput () {
      this.dropZoneInstance().hiddenFileInput.click()
    }
  },
  created () {
    // Initialize private properties
    this.previews = []
    this.updateDropZoneOptions()
  },
  async mounted () {
    await this.loadRefs()
    this.$emit('uploader-ready')
  }
}
</script>
