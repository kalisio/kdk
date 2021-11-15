import _ from 'lodash'
import L from 'leaflet'
import path from 'path'
import { Reader } from '../../../../core/client'
import { uid } from 'quasar'
import { generatePropertiesSchema } from '../../utils'

export default {
  methods: {
    async importFiles (files) {
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
          console.log(content)
          if (content.bbox) this.zoomToBBox(content.bbox)
          else this.zoomToLayer(name)
        } catch (error) {
          // nothing to do
        }
      }
    }
  },
  mounted () {
    this.$on('map-ready', () => { 
      // Create a dummy dropFileInput element to enable puppeteer
      const container = document.getElementById('q-app')
      const dropFileInput = document.createElement('input')
      dropFileInput.setAttribute('id', 'dropFileInput')
      dropFileInput.type = 'file'
      dropFileInput.style.display = 'none'
      dropFileInput.addEventListener('change', async (event) => {
        await this.importFiles(event.target.files)
      })
      container.appendChild(dropFileInput)
      // Setup drag & drop     
      this.map._container.addEventListener('dragenter', () => this.map.scrollWheelZoom.disable(), false)
      this.map._container.addEventListener('dragleave', () => this.map.scrollWheelZoom.enable(), false)
      this.map._container.addEventListener('dragover', event => {
        event.stopPropagation()
        event.preventDefault()
      }, false)
      this.map._container.addEventListener('drop', async (event) =>{
        event.stopPropagation()
        event.preventDefault()
        await this.importFiles(event.dataTransfer.files)
        this.map.scrollWheelZoom.enable()
      }, false)
    })
  }
}


