import _ from 'lodash'
import path from 'path'
import { Reader } from '../../../../core/client'

export default {
  methods: {
    async importFiles (files) {
      for (let i = 0; i < files.length; ++i) {
        const file = files.item(i)
        try {
          const content = await Reader.read(file)
          const name = path.basename(file.name, path.extname(file.name))
          await this.addGeoJsonLayer({ name, description: file.name }, content)
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
