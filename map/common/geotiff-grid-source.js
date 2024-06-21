import * as GeoTIFF from 'geotiff'
import _ from 'lodash'
import { unitConverters, SortOrder, GridSource, Grid1D } from './grid.js'

// pack r,g,b in an uint32
function packRgb (r, g, b) {
  return r | (g << 8) | (b << 16) | (0xFF << 24)
}

// return packed rgb as a float value
function encodeRgb (packed) {
  const asuint = new Uint32Array(1)
  const asfloat = new Float32Array(asuint.buffer)
  asuint[0] = packed
  return asfloat[0]
}

function mergeRgb (bands) {
  // scale is used when source data is uint16 for example
  const scale = 8 * (bands.BYTES_PER_ELEMENT - 1)
  const merged = new Float32Array(bands.length / 3)
  const uint32View = new Uint32Array(merged.buffer)
  for (let i = 0; i < merged.length; i++) { uint32View[i] = packRgb(bands[i * 3] >> scale, bands[i * 3 + 1] >> scale, bands[i * 3 + 2] >> scale) }

  return merged
}

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
    this.rgb = config.rgb

    try {
      // forceXHR is useful for tests because nock doesn't know how to intercept fetch
      this.geotiff = await GeoTIFF.fromUrl(config.url, { forceXHR: _.get(config, 'forceXHR', false) })
    } catch (error) {
      // fetching may fail, in this case the source
      // will remain in unusable state
      this.geotiff = null
      console.error(`Failed fetching geotiff from ${config.url}`)
    }

    if (this.geotiff) {
      // for now only consider first image
      this.imageCount = await this.geotiff.getImageCount()
      this.refImage = await this.geotiff.getImage()
      if (this.nodata === undefined) {
        // try to get it from image metadata
        const meta = this.refImage.getFileDirectory()
        const nodata = parseFloat(meta.GDAL_NODATA)
        // const nodata =image.getGDALNoData()
        if (nodata && !isNaN(nodata)) this.nodata = nodata
      }
      // try to guess if rgb image
      if (this.rgb === undefined) {
        this.rgb = this.refImage.getSamplesPerPixel() > 1
      }
      // generates nodata usable by tiled mesh layer (expects a float value)
      if (this.rgb && this.nodata && this.nodata.length === 3) {
        this.nodata = encodeRgb(packRgb(this.nodata[0], this.nodata[1], this.nodata[2]))
      }

      const tiffBbox = this.refImage.getBoundingBox()
      this.minMaxLat = [tiffBbox[1], tiffBbox[3]]
      this.minMaxLon = [tiffBbox[0], tiffBbox[2]]
      this.usable = true
    }

    this.dataChanged()
  }

  async fetch (abort, bbox, resolution) {
    if (!this.usable) { return null }

    const sourceKey = this.sourceKey

    // select the image with the closest resolution
    let usedImage = await this.geotiff.getImage(0)
    for (let i = 1; i < this.imageCount; ++i) {
      const img = await this.geotiff.getImage(i)
      const [rx, ry] = img.getResolution(this.refImage)
      if (Math.abs(rx) > resolution[1] || Math.abs(ry) > resolution[0]) break
      usedImage = img
    }

    const [rx, ry] = usedImage.getResolution(this.refImage)
    const [ox, oy] = this.refImage.getOrigin()
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
    const bands = this.rgb
      ? await usedImage.readRGB({ window })
      : await usedImage.readRasters({ window, fillValue: this.nodata })
    const data = this.rgb ? mergeRgb(bands) : bands[0]

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
      dataBbox, [bands.height, bands.width],
      data, true, SortOrder.DESCENDING, SortOrder.ASCENDING,
      this.nodata, this.converter)
  }
}
