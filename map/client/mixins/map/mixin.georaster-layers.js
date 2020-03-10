import _ from 'lodash'
import L from 'leaflet'
import parseGeoraster from 'georaster'
import chroma from 'chroma-js'
import moment from 'moment'
import { GridRenderer } from 'weacast-leaflet'
import { Grid } from 'weacast-core/client'

const GeorasterLayer = L.Layer.extend({

  initialize (options) {
    Object.assign(this, options)
    this.currentTime = moment().utc()
    this.colorMap = null
    this.gridRenderer = new GridRenderer()
    this.gridOverlay = this.gridRenderer.initialize(Object.assign(options, { mesh: true }))
    L.setOptions(this, options || {})
  },

  onAdd (map) {
    map.addLayer(this.gridOverlay)
  },

  onRemove (map) {
    map.removeLayer(this.gridOverlay)
  },

  setRaster (raster) {
    if (!raster) {
      this.clearRaster()
      return
    }
    // Setup the colormap
    const scale = this.scale ? this.scale : ''
    if (this.classes) {
      this.colorMap = chroma.scale(scale).classes(this.classes)
    } else if (this.domain) {
      this.colorMap = chroma.scale(scale).domain(this.domain)
    }

    // Setup the grid
    const grid = new Grid({
      bounds: [raster.xmin, raster.ymin, raster.xmax, raster.ymax],
      origin: [raster.xmin, raster.ymax],
      size: [raster.width, raster.height],
      resolution: [raster.pixelWidth, raster.pixelHeight],
      data: raster.values[this.band],
      matrix: true
    })
    this.gridRenderer.setColorMap(this.colorMap)
    this.gridRenderer.setGrid(grid)
    this.gridOverlay.redraw()
    this.fire('data', raster)
  },

  clearRaster () {
    this.gridRenderer.setGrid(null)
    this.gridRenderer.setColorMap(null)
    this.colorMap = null
  },

  async loadRaster (url) {
    const response = await fetch(url)
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      const georaster = await parseGeoraster(arrayBuffer)
      // Update the data
      this.setRaster(georaster)
    } else {
      this.clearRaster()
    }
  },

  async setCurrentTime (datetime) {
    if (!this.interval) return
    const timelag = this.timelag ? this.timelag : 0
    const timestamp = datetime.valueOf()
    const nearestTime = moment(Math.floor(timestamp / this.interval) * this.interval + timelag).utc()
    if (this.currentTime !== nearestTime) {
      // Store the time
      this.currentTime = nearestTime
      // Compute the url
      await this.loadRaster(this.currentTime.format(this.url))
    }
  }
})

export default {
  methods: {
    async createLeafletGeorasterLayer (options) {
      const leafletOptions = options.leaflet || options

      // Check for valid type
      if (leafletOptions.type !== 'georaster') return

      // Copy options
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap) Object.assign(leafletOptions, colorMap)
      const band = _.get(options, 'variables[0].band', 0)
      Object.assign(leafletOptions, { band })
      const nodata = _.get(options, 'variables[0].nodata', null)
      if (nodata) Object.assign(leafletOptions, { nodata })

      Object.assign(leafletOptions)
      this.georasterLayer = new GeorasterLayer(leafletOptions)
      return this.georasterLayer
    }
  },
  created () {
    this.registerLeafletConstructor(this.createLeafletGeorasterLayer)
  }
}
