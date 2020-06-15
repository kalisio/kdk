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
    @input="onCurrentMediaChanged">
    <!--
      Slides
      -->
    <template v-for="(media) in medias">
      <q-carousel-slide :name="media.name" :key="media._id" class="row justify-center items-center">
        <k-image-viewer :ref="media._id" class="fit k-media-browser-slide" :source="media.uri" :transform="mediaTransform(media)" />
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
        <k-tool-bar :actions="actions" :color="controlColor" :dense="$q.screen.lt.md" />
      </q-carousel-control>
    </template>
  </q-carousel>
</template>

<script>
import _ from 'lodash'
import { Platform, QCarousel, QCarouselSlide, QCarouselControl, exportFile } from 'quasar'
import 'mime-types-browser'
import mixins from '../../mixins'

export default {
  name: 'k-media-browser',
  mixins: [
    mixins.refsResolver(['carousel'])
  ],
  components: {
    QCarousel,
    QCarouselSlide,
    QCarouselControl
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
      let actions = []
      if (this.currentMedia) {
        if (this.currentMedia.isImage) actions.push({ 
          name: 'restoreImage', label: this.$t('KMediaBrowser.RESTORE_IMAGE_ACTION'), icon: 'las la-undo', handler: this.onImageRestored
        })
        actions.push({ 
          name: 'downloadMedia', label: this.$t('KMediaBrowser.DOWNLOAD_MEDIA_ACTION'), icon: 'las la-cloud-download-alt', handler: this.onMediaDownload 
          })
      }
      actions.push({ 
        name: 'close', label: this.$t('KMediaBrowser.CLOSE_ACTION'), icon: 'las la-times', handler: this.onClose 
      })
      return actions
    }
  },
  data () {
    return {
      opened: false,
      medias: [],
      currentMedia: null,
      currentMediaName: ''
    }
  },
  methods: {
    onImageRestored () {
      if (this.$refs[this.currentMedia._id]) {
        this.$refs[this.currentMedia._id][0].restore()
      }
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
      if (typeAndData.length <= 1) throw Error(this.$t('errors.CANNOT_PROCESS_DOWNLOAD_DATA'))
      const data = atob(typeAndData[1])
      const buffer = new Uint8Array(data.length)
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = data.charCodeAt(i)
      }
      const blob = new Blob([buffer], { type: mimeType })
      if (Platform.is.cordova) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
          fs.root.getFile(this.currentMedia.name, { create: true, exclusive: false }, (fileEntry) => {
            fileEntry.createWriter((fileWriter) => {
              fileWriter.write(blob)
              cordova.plugins.fileOpener2.open(fileEntry.nativeURL, mimeType)
            })
          })
        })
      } else {
        exportFile(this.currentMedia.name, blob)
      }
    },
    async onCurrentMediaChanged () {
      const index = _.findIndex(this.medias, media => media.name === this.currentMediaName)
      if (index < 0) return
      const media = this.medias[index]
      const mimeType = mime.lookup(media.name)
      this.currentMedia = media
      this.currentMedia.isImage = mimeType.startsWith('image/')
      // Download image the first time
      if (!media.uri) {
        // We only download images
        if (mimeType === 'application/pdf') {
          Object.assign(media, { uri: this.$load('pdf-icon.png', 'asset') })
        } else {
          const data = await this.storageService().get(media._id)
          Object.assign(media, { uri: data.uri })
        }
        // Required to use $set when modifying an object inside an array to make it reactive
        this.$set(this.medias, index, media)
      }
    },
    onClose () {
      this.opened = false
    },
    async show (medias = []) {
      this.medias = medias
      this.currentMedia = null
      this.opened = true
      await this.loadRefs()
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
    },
    mediaTransform (media) {
      if (media.isImage) return { scale: 1, translate: { x: 0, y: 0 }, rotate: 0 }
      else return { scale: 0.25, translate: { x: 0, y: 0 }, rotate: 0 }
    },  
  },
  created () {
    // laod the required components
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    this.$options.components['k-image-viewer'] = this.$load('media/KImageViewer')
    // Initialize
    this.touches = []
  },
  async mounted () {
    this.$emit('browser-ready')
  }
}
</script>

<style lang="stylus">
 .k-media-browser-slide {
    background: transparent
    max-width: 85%
    max-height: 85%
    overflow: hidden
  }
</style>