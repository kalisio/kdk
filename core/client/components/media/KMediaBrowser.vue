<template>
  <div>
    <q-carousel ref="carousel" v-show="fullscreen" :style="{ 'background-color': backgroundColor }" :class="'text-' + controlColor" :control-color="controlColor"
      animated :navigation="hasMedia && !zoomedMedia" :arrows="hasMedia && !zoomedMedia" infinite v-model="currentMediaName" @input="onCurrentMediaChanged">
      <q-carousel-slide v-for="media in medias" :name="media.name" :key="media._id" class="flex-center row">
        <img v-show="media.uri" style="max-width: 100%; max-height: 100%; object-fit: content;" :src="media.uri" />
        <div v-if="currentMediaIsFile" class="text-h5">{{currentMediaName}}</div>
        <div v-show="!media.uri" class="text-h3">
          <q-spinner-cube/>
          {{ $t('KMediaBrowser.LOADING') }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="no-media" class="flex-center row text-h3" :disable="hasMedia">
        {{ $t('KMediaBrowser.NO_MEDIA') }}
      </q-carousel-slide>
      <q-carousel-slide name="zoomed-media" :disable="!zoomedMedia" >
        <img v-if="zoomedMedia" :src="zoomedMedia.uri" />
      </q-carousel-slide>
      <template v-slot:control>
        <q-carousel-control position="top-right" :offset="[0, 0]" style="font-size: 2em; cursor: pointer;">
          <q-icon v-show="hasMedia && !zoomedMedia" v-if="!currentMediaIsFile" @click="doZoomIn" :color="controlColor" name="zoom_in" />
          <q-icon v-show="hasMedia && !zoomedMedia" @click="doDownload" :color="controlColor" name="cloud_download" />
          <q-icon v-show="!zoomedMedia" @click="doHide" :color="controlColor" name="close" />
          <a ref="downloadLink" v-show="false" :href="currentDownloadLink" :download="currentMediaName"></a>
          <q-icon v-show="zoomedMedia" @click="doZoomOut" :color="controlColor" style="right: 18px" name="zoom_out" />
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
</template>

<script>
import _ from 'lodash'
import { Platform, QCarousel, QCarouselSlide, QCarouselControl } from 'quasar'
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
      return this.options.backgroundColor || 'white'
    },
    controlColor () {
      return this.options.controlColor || 'primary'
    }
  },
  data () {
    return {
      medias: [],
      currentMedia: null,
      currentMediaName: '',
      currentMediaIsFile: false,
      currentDownloadLink: null,
      zoomedMedia: null,
      fullscreen: false
    }
  },
  methods: {
    doHide () {
      this.fullscreen = false
    },
    doZoomIn () {
      this.zoomedMedia = this.currentMedia
      this.$refs.carousel.goTo('zoomed-media')
    },
    doZoomOut () {
      this.zoomedMedia = null
      this.$refs.carousel.goTo(this.currentMedia.name)
    },
    async doDownload () {
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
      this.currentDownloadLink = URL.createObjectURL(blob)
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
        // We call Vue.nextTick() to let Vue update its DOM to get the download link ready
        this.$nextTick(() => this.$refs.downloadLink.click())
      }
    },
    async onCurrentMediaChanged () {
      const index = _.findIndex(this.medias, media => media.name === this.currentMediaName)
      if (index < 0) return
      const media = this.medias[index]
      const mimeType = mime.lookup(media.name)
      this.currentMedia = media
      this.currentMediaIsFile = !mimeType.startsWith('image/')
      this.currentDownloadLink = null
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
    async show (medias = []) {
      this.medias = medias
      this.currentMedia = null
      this.zoomedMedia = null
      this.fullscreen = true
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
    }
  },
  async mounted () {
    this.$emit('browser-ready')
  }
}
</script>
