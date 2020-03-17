<template>
  <div v-if="isEnabled"
    id="mapillary-container"
    style="width:480px; height: 320px; z-index: 1;">
  </div>
</template>

<script>
// import logger from 'loglevel'
import _ from 'lodash'
import * as Mapillary from 'mapillary-js'
import 'mapillary-js/dist/mapillary.min.css'

export default {
  name: 'k-mapillary-viewer',
  inject: ['kActivity'],
  props: {
    clientID: {
      type: String,
      default: ''
    },
    key: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isEnabled: false
    }
  },
  mounted () {
    if (!_.isNil(this.clientID) && Mapillary.isSupported()) {
      this.isEnabled = true
      this.$nextTick(() => {
        this.mapillaryViewer = new Mapillary.Viewer('mapillary-container', this.clienID, this.imageID)
        this.mapillaryViewer.on(Mapillary.Viewer.nodechanged, (node) => {
          this.kActivity.center(node.latLon.lon, node.latLon.lat)
        })
      })
    }
  }
}
</script>
