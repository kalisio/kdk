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
    <template v-for="(media) in medias" :key="media._id">
      <q-carousel-slide :name="media.name" class="row justify-center items-center">
        <k-image-viewer :ref="media._id" class="fit k-media-browser-slide" :source="media.uri" :interactive="media.isImage" @image-transformed="onImageTrasnformed" />
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
</template>

<script>
import _ from 'lodash'
import mime from 'mime'
import KPanel from '../frame/KPanel.vue'
import KImageViewer from '../media/KImageViewer.vue'
import { downloadAsBlob } from '../../utils'

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
          id: 'download-media', icon: 'las la-cloud-download-alt', tooltip: this.$t('KMediaBrowser.DOWNLOAD_MEDIA_ACTION'), handler: this.onMediaDownload
        })
      }
      actions.push({
        id: 'close-browser', icon: 'las la-times', tooltip: this.$t('KMediaBrowser.CLOSE_ACTION'), handler: this.onClose
      })
      return { default: actions }
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
    onImageTrasnformed () {
      this.currentMediaTransformed = true
    },
    onImageRestored () {
      if (this.$refs[this.currentMedia._id]) this.$refs[this.currentMedia._id][0].restore()
      this.currentMediaTransformed = false
    },
    async onMediaDownload () {
      if (!this.currentMedia) return
      const mimeType = mime.lookup(this.currentMedia.name)
      let uri
      // We already download images for visualization, simply reused data
      if (mimeType.startsWith('image/')) {
        uri = this.currentMedia.uri
      } else {
        // For files we need to download data first
        const data = await this.storageService().get(this.currentMedia._id)
        uri = data.uri
      }
      // Need to convert to blob otherwise some browsers complains when the data uri is too long
      const typeAndData = uri.split(',')
      if (typeAndData.length <= 1) throw new Error(this.$t('errors.CANNOT_PROCESS_DOWNLOAD_DATA'))
      const data = atob(typeAndData[1])
      const buffer = new Uint8Array(data.length)
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = data.charCodeAt(i)
      }
      downloadAsBlob(buffer, this.currentMedia.name, mimeType)
    },
    async onCurrentMediaChanged () {
      const index = _.findIndex(this.medias, media => media.name === this.currentMediaName)
      if (index < 0) return
      const media = this.medias[index]
      const mimeType = mime.lookup(media.name)
      this.currentMedia = media
      this.currentMedia.isImage = mimeType.startsWith('image/')
      this.currentMediaTransformed = false
      // Download image the first time
      if (!media.uri) {
        // We only download images
        if (mimeType === 'application/pdf') {
          Object.assign(media, { uri: 'icons/kdk/pdf.png' })
        } else {
          const data = await this.storageService().get(media._id)
          Object.assign(media, { uri: data.uri })
        }
        this.medias[index] = media
      }
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
    },
    storageService () {
      return this.$api.getService(this.options.service || 'storage')
    }
  },
  async mounted () {
    this.$emit('browser-ready')
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
