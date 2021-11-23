import _ from 'lodash'
import L from 'leaflet'
import path from 'path'
import logger from 'loglevel'
import togeojson from 'togeojson'
import fileLayer from 'leaflet-filelayer'
import { uid } from 'quasar'
import { generatePropertiesSchema } from '../../utils'

fileLayer(null, L, togeojson)

export default {
  mounted () {
    this.$on('map-ready', () => {
      // Instanciate the control to enable the access to the input element.
      // This is required to let Puppeteer upload a file
      // See https://github.com/kalisio/kdk/issues/472
      this.loaderControl = L.Control.fileLayerLoad(Object.assign({
        // Allows you to use a customized version of L.geoJson.
        // For example if you are using the Proj4Leaflet leaflet plugin,
        // you can pass L.Proj.geoJson and load the files into the
        // L.Proj.GeoJson instead of the L.geoJson.
        layer: L.geoJson,
        // See http://leafletjs.com/reference.html#geojson-options
        layerOptions: this.getGeoJsonOptions(),
        // Add to map after loading
        addToMap: false,
        // File size limit in kb
        fileSizeLimit: 1024 * 1024,
        // Restrict accepted file formats (default: .geojson, .kml, and .gpx)
        formats: [
          '.geojson',
          '.json',
          '.kml',
          '.gpx'
        ]
      }, this.activityOptions.engine.fileLayers))
      this.loaderControl.addTo(this.map)
      // Hide the contoler
      const loaderControlElements = document.getElementsByClassName('leaflet-control-filelayer')
      if (loaderControlElements.length > 0) loaderControlElements[0].style.visibility = 'hidden'
      /*
      // Required to support drag'n'drop when not using built-in control
      this.map._container.addEventListener('dragenter', () => this.map.scrollWheelZoom.disable(), false)
      this.map._container.addEventListener('dragleave', () => this.map.scrollWheelZoom.enable(), false)
      this.map._container.addEventListener('dragover', (event) => {
        event.stopPropagation()
        event.preventDefault()
      }, false)
      this.map._container.addEventListener('drop', (event) => {
        event.stopPropagation()
        event.preventDefault()
        this.loaderControl.loader.loadMultiple(event.dataTransfer.files)
        this.map.scrollWheelZoom.enable()
      }, false)
      */
      this.loaderControl.loader.on('data:loaded', async event => {
        const name = (event.filename
          ? path.basename(event.filename, path.extname(event.filename))
          : this.$t('mixins.fileLayers.IMPORTED_DATA_NAME'))
        const engine = {
          type: 'geoJson',
          isVisible: true,
          realtime: true
        }
        const layer = {
          name,
          type: 'OverlayLayer',
          icon: 'insert_drive_file',
          scope: 'user',
          featureId: '_id',
          leaflet: engine,
          // Avoid sharing reference to the same object although options are similar
          // otherwise updating one will automatically update the other one
          cesium: Object.assign({}, engine)
        }
        const geoJson = event.layer.toGeoJSON()
        // Generate schema for properties
        const schema = generatePropertiesSchema(geoJson, name)
        _.set(layer, 'schema', { name, content: schema })
        // Generate temporary IDs for features
        const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
        features.forEach(feature => { feature._id = uid().toString() })
        // Create an empty layer used as a container
        await this.addLayer(layer)
        // Set data
        await this.updateLayer(name, geoJson)
        // Zoom to it
        this.zoomToLayer(name)
      })
      this.loaderControl.loader.on('data:error', event => {
        logger.error(event.error)
        this.$events.$emit('error', {
          message: this.$t('errors.FILE_IMPORT_ERROR')
        })
      })
    })
  }
}
