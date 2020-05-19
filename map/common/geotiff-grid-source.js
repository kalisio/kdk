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
    return this.usable ? [this.minMaxLat[0], this.minMaxLon[0], this.minMaxLat[1], this.minMaxLon[1]] : null
  }

  getDataBounds () {
    return this.usable ? this.minMaxVal : null
  }

  async setup (config) {
    this.usable = false
    ++this.sourceKey

    this.minMaxLat = null
    this.minMaxLon = null
    this.minMaxVal = null

    this.nodata = config.nodata
    this.converter = unitConverters[config.converter]
    this.geotiff = await GeoTIFF.fromUrl(config.url)

    // for now only consider first image
    this.imageCount = await this.geotiff.getImageCount()
    const image = await this.geotiff.getImage()
    if (this.nodata === undefined) {
      // try to get it from image metadata
      // this.nodata = image.getGDALNoData()
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

    const sourceKey = this.sourceKey

    // select the image with the closest resolution
    let usedImage = await this.geotiff.getImage(0)
    for (let i = 1; i < this.imageCount; ++i) {
      const img = await this.geotiff.getImage(i)
      const [rx, ry, rz] = img.getResolution()
      if (Math.abs(rx) >= resolution[1] || Math.abs(ry) >= resolution[0]) break
      usedImage = img
    }

    const [rx, ry, rz] = usedImage.getResolution()
    const [ox, oy, oz] = usedImage.getOrigin()
    const [sx, sy] = [usedImage.getWidth(), usedImage.getHeight()]

    let left = (bbox[1] - ox) / rx
    let right = (bbox[3] - ox) / rx
    let bottom = (bbox[0] - oy) / ry
    let top = (bbox[2] - oy) / ry

    if (rx < 0) [left, right] = [right, left]
    if (ry < 0) [bottom, top] = [top, bottom]

    left = Math.min(sx - 1, Math.max(0, Math.floor(left)))
    right = Math.min(sx - 1, Math.max(0, Math.ceil(right)))
    bottom = Math.min(sy - 1, Math.max(0, Math.floor(bottom)))
    top = Math.min(sy - 1, Math.max(0, Math.ceil(top)))

    // readRasters will fetch [left, right[ and [bottom, top[ hence the + 1
    const window = [left, bottom, right + 1, top + 1]
    const data = await usedImage.readRasters({
      window: window,
      fillValue: this.nodata
    })

    if (rx < 0) [left, right] = [right, left]
    if (ry < 0) [bottom, top] = [top, bottom]

    const dataBbox = [
      oy + (bottom * ry),
      ox + (left * rx),
      oy + (top * ry),
      ox + (right * rx)
    ]

    return new Grid1D(
      sourceKey,
      dataBbox, [data.height, data.width],
      data[0], true, SortOrder.DESCENDING, SortOrder.ASCENDING,
      this.nodata, this.converter)
  }
}
