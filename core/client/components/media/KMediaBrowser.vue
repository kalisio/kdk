<template>
  <q-carousel
    ref="carousel"
    v-show="opened"
    v-model="currentMediaName"
    :class="'bg-' + backgroundColor + ' text-' + controlColor"
    :control-color="controlColor"
    :navigation="hasMedia"
    :arrows="hasMedia"
    animated infinite
    @update:model-value="onCurrentMediaChanged"
  >
    <!--
      Slides
      -->
    <template v-for="(media) in medias" :key="media.key">
      <q-carousel-slide :name="media.name" class="row justify-center items-center">
        <k-image-viewer :ref="media.key" class="fit k-media-browser-slide" :source="media.uri" :interactive="media.isImage" @image-transformed="onImageTrasnformed" />
      </q-carousel-slide>
    </template>
    <!--
      Empty slide
     -->
    <q-carousel-slide name="no-media" class="flex-center row text-h3" :disable="hasMedia">
      {{ $t('KMediaBrowser.NO_MEDIA') }}
    </q-carousel-slide>
    <!--
      Actions
     -->
    <template v-slot:control>
      <q-carousel-control position="top-right" :offset="[0, 0]" style="font-size: 2em; cursor: pointer;">
        <k-panel id="media-browser-actions" :content="actions" :color="controlColor" />
      </q-carousel-control>
    </template>
  </q-carousel>
  <KModal
    ref="uploadModal"
    :title="uploadTitle"
    :buttons="uploadButtons"
  >
    <!-- Modal content -->
    <KForm
      ref="uploadForm"
      :schema="uploadSchema"
    />
  </KModal>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { Dialog } from 'quasar'
import mime from 'mime'
import KPanel from '../KPanel.vue'
import KImageViewer from '../media/KImageViewer.vue'
import { Storage } from '../../storage.js'
import { Events } from '../../events.js'
import { createThumbnail, downloadAsBlob, dataUriToBlob } from '../../utils.js'

export default {
  components: {
    KPanel,
    KImageViewer
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    hasMedia () {
      return (this.medias.length > 0)
    },
    backgroundColor () {
      return this.options.backgroundColor || 'black'
    },
    controlColor () {
      return this.options.controlColor || 'primary'
    },
    actions () {
      const actions = []
      if (this.currentMedia) {
        if (this.currentMedia.isImage && this.currentMediaTransformed) {
          actions.push({
            id: 'restore-image', icon: 'las la-compress-arrows-alt', tooltip: this.$t('KMediaBrowser.RESTORE_IMAGE_ACTION'), handler: this.onImageRestored
          })
        }
        actions.push({
          id: 'download-media', icon: 'las la-cloud-download-alt', tooltip: this.$t('KMediaBrowser.DOWNLOAD_MEDIA_ACTION'), handler: this.onDownloadMedia
        })
        actions.push({
          id: 'remove-media', icon: 'las la-trash', tooltip: this.$t('KMediaBrowser.REMOVE_MEDIA_ACTION'), handler: this.onRemoveMedia
        })
      }
      if (this.canCapturePhoto()) {
        actions.push({
          id: 'capture-photo',
          icon: 'las la-camera',
          tooltip: this.$t('KMediaBrowser.ADD_PHOTO_LABEL'),
          color: (this.hasMedia ? 'grey-9' : 'secondary'),
          handler: this.onCapturePhoto
        })
      }
      actions.push({
        id: 'add-media',
        icon: 'las la-paperclip',
        tooltip: this.$t('KMediaBrowser.ADD_MEDIA_LABEL'),
        color: (this.hasMedia ? 'grey-9' : 'secondary'),
        handler: () => this.$refs.uploadModal.open()
      })
      actions.push({
        id: 'close-browser', icon: 'las la-times', tooltip: this.$t('KMediaBrowser.CLOSE_ACTION'), handler: this.onClose
      })
      return { default: actions }
    },
    uploadTitle () {
      return this.$t('KMediaBrowser.UPLOAD_TITLE')
    },
    uploadSchema () {
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/upload-media',
        type: 'object',
        properties: {
          media: {
            field: {
              component: 'form/KFileField',
              label: 'KMediaBrowser.UPLOAD_FILE_FIELD_LABEL',
              mimeTypes: 'image/*,application/pdf',
              maxSize: 20485760,
              storage: {
                context: this.context,
                path: `${this.prefix}/<%= fileName %>`
              },
              readContent: false
            }
          }
        },
        required: ['media']
      }
    },
    uploadButtons () {
      return [
        {
          id: 'cancel-button',
          label: 'CANCEL',
          renderer: 'form-button',
          outline: true,
          handler: () => this.$refs.uploadModal.close()
        }, {
          id: 'import-button',
          label: 'KMediaBrowser.UPLOAD',
          renderer: 'form-button',
          handler: () => this.onUploadMedia()
        }
      ]
    }
  },
  data () {
    return {
      opened: false,
      medias: [],
      currentMedia: null,
      currentMediaName: '',
      currentMediaTransformed: false
    }
  },
  methods: {
    canCapturePhoto () {
      if (!this.$q.platform.is.cordova) return false
      return true
    },
    onImageTrasnformed () {
      this.currentMediaTransformed = true
    },
    onImageRestored () {
      if (this.$refs[this.currentMedia.key]) this.$refs[this.currentMedia.key][0].restore()
      this.currentMediaTransformed = false
    },
    async onDownloadMedia () {
      if (!this.currentMedia) return
      const data = await Storage.download({
        file: this.currentMedia.name,
        key: this.currentMedia.key,
        context: this.context
      })
      downloadAsBlob(data.buffer, this.currentMedia.name, data.type)
    },
    async onUploadMedia () {
      const result = this.$refs.uploadForm.validate()
      if (result.isValid) {
        // Trigger the file upload
        await this.$refs.uploadForm.apply()
        await this.$refs.uploadForm.submitted()
        this.$refs.uploadModal.close()
      }
    },
    async onMediaUploaded (file) {
      const { name, key } = file
      let index = _.findIndex(this.medias, media => media.name === this.currentMediaName)
      if (index < 0) index = 0
      this.medias.splice(index, 0, { name, key })
      this.currentMediaName = name
      this.$refs.carousel.goTo(this.currentMediaName)
    },
    async onCurrentMediaChanged () {
      const index = _.findIndex(this.medias, media => media.name === this.currentMediaName)
      if (index < 0) return
      const media = this.medias[index]
      const mimeType = mime.getType(media.name)
      this.currentMedia = media
      this.currentMedia.isImage = mimeType.startsWith('image/')
      this.currentMediaTransformed = false
      // Download image the first time
      if (!media.uri) {
        // We only download images
        if (mimeType === 'application/pdf') {
          Object.assign(media, { uri: 'icons/kdk/pdf.png' })
        } else {
          const uri = await Storage.getObjectUrl({ key: media.key, context: this.context })
          Object.assign(media, { uri })
        }
        this.medias[index] = media
      }
    },
    capturePhoto () {
      navigator.camera.getPicture(this.onPhotoCaptured, null, {
        correctOrientation: true,
        quality: 75,
        destinationType: navigator.camera.DestinationType.DATA_URL,
        sourceType: navigator.camera.PictureSourceType.CAMERA
      })
    },
    async onPhotoCaptured (photoDataUri) {
      const name = moment().format('YYYYMMDD_HHmmss.jpg')
      const key = this.prefix ? this.prefix + '/' + name : name
      photoDataUri = 'data:image/jpg;base64,' + photoDataUri
      createThumbnail(photoDataUri, 200, 200, 50, async thumbnailDataUri => {
        // Store once everything has been computed
        await Storage.upload({
          file: name,
          key,
          blob: dataUriToBlob(photoDataUri),
          context: this.context
        })
        await Storage.upload({
          file: name,
          key: key + '.thumbnail',
          blob: dataUriToBlob(thumbnailDataUri),
          context: this.context
        })
      })
    },
    onRemoveMedia () {
      Dialog.create({
        title: this.$t('KMediaBrowser.REMOVE_DIALOG_TITLE', { media: this.currentMediaName }),
        message: this.$t('KMediaBrowser.REMOVE_DIALOG_MESSAGE', { media: this.currentMediaName }),
        html: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(async () => {
        await this.storageService.remove(this.currentMedia.key)
        const index = _.findIndex(this.medias, media => media.name === this.currentMediaName)
        this.medias.splice(index, 1)
        // Switch current media to next one by looping if required
        if (this.medias.length > 0) {
          this.currentMediaName = this.medias[index < this.medias.length ? index : 0].name
          this.$refs.carousel.goTo(this.currentMediaName)
        } else {
          this.currentMedia = null
          this.currentMediaName = ''
          this.$refs.carousel.goTo('no-media')
        }
      })
    },
    onClose () {
      this.$refs.carousel.exitFullscreen()
      this.opened = false
    },
    async show (medias = []) {
      this.medias = medias
      this.currentMedia = null
      this.opened = true
      // Then open the modal
      this.$refs.carousel.setFullscreen()
      // Quasar does not send the silde event on first display
      if (this.medias.length > 0) {
        this.$refs.carousel.goTo(this.medias[0].name)
      } else {
        this.$refs.carousel.goTo('no-media')
      }
    }
  },
  created () {
    this.context = _.get(this.options, 'storage.context')
    this.prefix = _.get(this.options, 'storage.prefix')
    this.storageService = Storage.getService(this.context)
    Events.on('file-uploaded', this.onMediaUploaded)
  },
  mounted () {
    this.$emit('browser-ready')
  },
  beforeUnmount () {
    // Releases listeners
    Events.off('file-uploaded', this.onMediaUploaded)
  }
}
</script>

<style lang="scss">
  .k-media-browser-slide {
    background: transparent;
    max-width: 85%;
    max-height: 85%;
    overflow: hidden;
  }
</style>
