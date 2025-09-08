import _ from 'lodash'
import logger from 'loglevel'
import path from 'path-browserify'
import { Reader } from '../../../../core/client/reader.js'

export const fileLayers = {
  methods: {
    async importFiles (filelist) {
      const acceptedFiles = await Reader.filter(filelist)
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        try {
          const content = await Reader.read(file)
          const name = path.basename(file.name, path.extname(file.name))
          const description = _.join(_.map(file.files, subfile => subfile.name), ',')
          await this.addGeoJsonLayer({ name, description }, content)
          if (typeof this.refreshOrphanLayers === 'function') await this.refreshOrphanLayers()
        } catch (error) {
          // nothing to do
        }
      }
    }
  },
  mounted () {
    this.$engineEvents.on('map-ready', () => {
      // Create a dummy dropFileInput element to enable puppeteer
      const container = this.map.getContainer()
      const dropFileInput = document.createElement('input')
      dropFileInput.setAttribute('id', 'dropFileInput')
      dropFileInput.type = 'file'
      dropFileInput.style.display = 'none'
      dropFileInput.addEventListener('change', async (event) => {
        logger.debug('[KDK] processing dropped files: ', event.target.files)
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
      this.map._container.addEventListener('drop', async (event) => {
        logger.debug('[KDK] processing dropped files: ', event.dataTransfer.files)
        event.stopPropagation()
        event.preventDefault()
        await this.importFiles(event.dataTransfer.files)
        this.map.scrollWheelZoom.enable()
      }, false)
    })
  }
}
