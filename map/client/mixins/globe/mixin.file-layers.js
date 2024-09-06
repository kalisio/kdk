import _ from 'lodash'
import { viewerDragDropMixin } from 'cesium'
import logger from 'loglevel'

export const fileLayers = {
  mounted () {
    this.$engineEvents.on('globe-ready', () => {
      this.viewer.extend(viewerDragDropMixin,
        // For activities
        _.get(this, 'activityOptions.engine.fileLayers', {
          clearOnDrop: false,
          flyToOnDrop: true,
          clampToGround: true
        })
      )
      this.viewer.dropError.addEventListener((viewerArg, source, error) => {
        logger.error(error)
      })
      // Required to be aware of the newly added object
      this.viewer.dataSources.dataSourceAdded.addEventListener((collection, source) => {
        // Check if source has not been dropped, otherwise add it as layer
        if (source.notFromDrop) return
        if (!source.name) source.name = this.$t('mixins.fileLayers.IMPORTED_DATA_NAME')
        // Create an empty layer used as a container
        this.addLayer({
          name: source.name,
          label: source.name,
          type: 'OverlayLayer',
          icon: 'insert_drive_file',
          cesium: {
            type: 'geoJson',
            isVisible: true,
            cluster: { pixelRange: 50 },
            source: source.name // Set the data source name instead of URL in this case
          }
        })
      })
    })
  }
}
