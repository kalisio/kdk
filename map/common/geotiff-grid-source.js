import * as GeoTIFF from 'geotiff'
import { unitConverters, SortOrder, GridSource, Grid1D } from './grid'

export class GeoTiffGridSource extends GridSource {
  static getKey () {
    return 'geotiff'
  }

  constructor (options) {
    super(options)

    this.usable = false
  }

  getBBox () {
    return [this.minMaxLat[0], this.minMaxLon[0], this.minMaxLat[1], this.minMaxLon[1]]
  }

  getDataBounds () {
    return this.minMaxVal
  }

  async setup (config) {
    this.usable = false

    this.minMaxLat = null
    this.minMaxLon = null
    this.minMaxVal = null

    this.nodata = config.nodata
    this.converter = unitConverters[config.converter]
    this.geotiff = await GeoTIFF.fromUrl(config.url)

    // for now only consider first image
    // const count = await this.geotiff.getImageCount()
    const image = await this.geotiff.getImage()
    if (this.nodata === undefined) {
      // try to get it from image metadata
      // const meta = image.getGDALMetadata()
      const meta = image.getFileDirectory()
      this.nodata = parseFloat(meta.GDAL_NODATA)
    }

    const tiffBbox = image.getBoundingBox()
    this.minMaxLat = [tiffBbox[1], tiffBbox[3]]
    this.minMaxLon = [tiffBbox[0], tiffBbox[2]]

    this.usable = true

    this.dataChanged()
  }

  async fetch (abort, bbox, resolution) {
    if (!this.usable) { return null }

    const reqMinLat = bbox[0]
    const reqMinLon = bbox[1]
    const reqMaxLat = bbox[2]
    const reqMaxLon = bbox[3]
    const width = 1 + Math.trunc((bbox[3] - bbox[1]) / resolution[1])
    const height = 1 + Math.trunc((bbox[2] - bbox[0]) / resolution[0])

    const fetchBbox = [reqMinLon, reqMinLat, reqMaxLon, reqMaxLat]
    const data = await this.geotiff.readRasters({
      bbox: fetchBbox,
      // interleave: true,
      width: width,
      height: height,
      fillValue: this.nodata
    })

    return new Grid1D(
      bbox, [height, width],
      data[0], true, SortOrder.DESCENDING, SortOrder.ASCENDING,
      this.nodata, this.converter)
  }
}
