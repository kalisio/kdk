import _ from 'lodash'
import L from 'leaflet'
import path from 'path'
import { Reader } from '../../../../core/client'
import { uid } from 'quasar'
import { generatePropertiesSchema } from '../../utils'

export default {
  async mounted () {
    this.$on('map-ready', () => {
      // Required to support drag'n'drop when not using built-in control
      this.map._container.addEventListener('dragenter', () => this.map.scrollWheelZoom.disable(), false)
      this.map._container.addEventListener('dragleave', () => this.map.scrollWheelZoom.enable(), false)
      this.map._container.addEventListener('dragover', event => {
         event.stopPropagation()
         event.preventDefault()
       }, false)
       this.map._container.addEventListener('drop', async (event) =>{
         event.stopPropagation()
         event.preventDefault()
         const files = event.dataTransfer.files
         for (let i = 0; i < files.length; ++i) {
          const file = files.item(i)
          try {
            const content = await Reader.read(file)
            const name = path.basename(file.name, path.extname(file.name))
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
            // Generate schema for properties
            const schema = generatePropertiesSchema(content, name)
            _.set(layer, 'schema', { name, content: schema })
            // Generate temporary IDs for features
            const features = (content.type === 'FeatureCollection' ? content.features : [content])
            features.forEach(feature => { feature._id = uid().toString() })
            // Create an empty layer used as a container
            await this.addLayer(layer)
            // Set data
            await this.updateLayer(name, content)
            // Zoom to it
            this.zoomToLayer(name)
          } catch (error) {
            // nothing to do
          }
        }
         this.map.scrollWheelZoom.enable()
       }, false)
    })
  }
}











/*


      // Instanciate the control to enable the access to the input element. 
      // This is required to let Puppeteer upload a file
      // See https://github.com/kalisio/kdk/issues/472
      this.loaderControl = L.Control.fileLayerLoad(Object.assign({
        // Allows you to use a customized version of L.content.
        // For example if you are using the Proj4Leaflet leaflet plugin,
        // you can pass L.Proj.content and load the files into the
        // L.Proj.content instead of the L.content.
        layer: L.content,
        // See http://leafletjs.com/reference.html#content-options
        layerOptions: this.getGeoJsonOptions(),
        // Add to map after loading
        addToMap: false,
        // File size limit in kb
        fileSizeLimit: 1024 * 1024,
        // Restrict accepted file formats (default: .content, .kml, and .gpx)
        formats: [
          '.content',
          '.json',
          '.kml',
          '.gpx'
        ]
      }, this.activityOptions.engine.fileLayers))
      this.loaderControl.addTo(this.map)
      // Hide the contoler
     // const loaderControlElements = document.getElementsByClassName('leaflet-control-filelayer')
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
  /*    this.loaderControl.loader.on('data:loaded', async event => {
        const name = (event.filename
          ? path.basename(event.filename, path.extname(event.filename))
          : this.$t('mixins.fileLayers.IMPORTED_DATA_NAME'))
        const engine = {
          type: 'content',
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
        const content = event.layer.toGeoJSON()
        // Generate schema for properties
        const schema = generatePropertiesSchema(content, name)
        _.set(layer, 'schema', { name, content: schema })
        // Generate temporary IDs for features
        const features = (content.type === 'FeatureCollection' ? content.features : [content])
        features.forEach(feature => { feature._id = uid().toString() })
        // Create an empty layer used as a container
        await this.addLayer(layer)
        // Set data
        await this.updateLayer(name, content)
        // Zoom to it
        this.zoomToLayer(name)
      })
      this.loaderControl.loader.on('data:error', event => {
        logger.error(event.error)
        this.$events.$emit('error', {
          message: this.$t('errors.FILE_IMPORT_ERROR')
        })
      })
    })*/
