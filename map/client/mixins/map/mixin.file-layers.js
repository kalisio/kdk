import _ from 'lodash'
import { Reader } from '../../../../core/client'

export default {
  methods: {
    async importFiles (filelist) {
      const acceptedFiles = await Reader.filter(filelist)
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        try {
          const content = await Reader.read(file)
          const name = file.name
          const description = _.join(_.map(file.files, subfile => subfile.name), ',')
          await this.addGeoJsonLayer({ name, description }, content)
        } catch (error) {
          // nothing to do
        }
      }
    }
  },
  mounted () {
    this.$on('map-ready', () => {
      // Create a dummy dropFileInput element to enable puppeteer
      const container = document.getElementById('map')
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
      this.map._container.addEventListener('drop', async (event) => {
        event.stopPropagation()
        event.preventDefault()
        await this.importFiles(event.dataTransfer.files)
        this.map.scrollWheelZoom.enable()
      }, false)
    })
  }
}
