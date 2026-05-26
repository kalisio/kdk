import _ from 'lodash'
import * as GeoTIFF from 'geotiff'
import SphericalMercator from '@mapbox/sphericalmercator'
import { unitConverters, SortOrder, GridSource, Grid1D } from './grid.js'

const WEB_MERCATOR_EPSG_CODES = new Set([3857, 900913])
const sm = new SphericalMercator()

// Fields actually read by geotiff decoders. Everything else (TileOffsets, TileByteCounts,
// ColorMap, geo keys, GDAL metadata...) can be several MB for COG files and is not needed
// for decoding — stripping it eliminates the dominant structured-clone cost per postMessage.
// Note: in V3 this has been optimized and should not be requested anymore, a standard pool should work
const DECODER_FIELDS = new Set([
  'Compression', 'BitsPerSample', 'SamplesPerPixel', 'SampleFormat',
  'PlanarConfiguration', 'Predictor', 'JPEGTables', 'LercParameters',
  'ImageWidth', 'ImageLength', 'TileWidth', 'TileLength', 'RowsPerStrip',
  'StripOffsets' // basedecoder uses !StripOffsets to distinguish tiled vs strip layout
])

class GeoTiffDecodingPool {
  constructor () {
    this.pool = new GeoTIFF.Pool(typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 2 : 0)
    this.cache = new WeakMap()
  }

  decode (fileDirectory, buffer) {
    let stripped = this.cache.get(fileDirectory)
    if (!stripped) {
      stripped = _.pick(fileDirectory, [...DECODER_FIELDS])
      // Preserve only the truthiness of StripOffsets, not its (potentially large) content
      if (stripped.StripOffsets) stripped.StripOffsets = true
      this.cache.set(fileDirectory, stripped)
    }
    return this.pool.decode(stripped, buffer)
  }
}

const geotiffPool = new GeoTiffDecodingPool()

// pack r,g,b in an uint32
function packRgb (r, g, b) {
  // Using 0x3E as high bits to make float interpretation (IEEE-754) of values between [0.125, 0.5]
  return r | (g << 8) | (b << 16) | (0x3E << 24)
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
      this.geotiff = await GeoTIFF.fromUrl(config.url)
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

      // detect CRS: ProjectedCSTypeGeoKey (3072) holds the EPSG code for projected CRS
      const geoKeys = this.refImage.getGeoKeys()
      const projCS = geoKeys && geoKeys.ProjectedCSTypeGeoKey
      this.isWebMercator = WEB_MERCATOR_EPSG_CODES.has(projCS)

      const tiffBbox = this.refImage.getBoundingBox()
      if (this.isWebMercator) {
        const [lon0, lat0, lon1, lat1] = sm.convert(tiffBbox, 'WGS84')
        this.minMaxLat = [lat0, lat1]
        this.minMaxLon = [lon0, lon1]
      } else {
        this.minMaxLat = [tiffBbox[1], tiffBbox[3]]
        this.minMaxLon = [tiffBbox[0], tiffBbox[2]]
      }
      this.usable = true
    }

    this.dataChanged()
  }

  async fetch (abort, bbox, resolution) {
    if (!this.usable) { return null }

    const sourceKey = this.sourceKey

    // resolution is given as degrees/pixel, convert to meters/pixel for Web Mercator sources
    let nativeResolution = resolution
    if (this.isWebMercator) {
      const centerLon = (bbox[1] + bbox[3]) / 2
      const centerLat = (bbox[0] + bbox[2]) / 2
      const [cx] = sm.forward([centerLon, centerLat])
      const [cx1] = sm.forward([centerLon + 1, centerLat])
      const [, cy] = sm.forward([centerLon, centerLat])
      const [, cy1] = sm.forward([centerLon, centerLat + 1])
      nativeResolution = [
        resolution[0] * Math.abs(cy1 - cy),
        resolution[1] * Math.abs(cx1 - cx)
      ]
    }

    // select the image with the closest resolution
    let usedImage = await this.geotiff.getImage(0)
    for (let i = 1; i < this.imageCount; ++i) {
      const img = await this.geotiff.getImage(i)
      const [rx, ry] = img.getResolution(this.refImage)
      if (Math.abs(rx) > nativeResolution[1] || Math.abs(ry) > nativeResolution[0]) break
      usedImage = img
    }

    const [rx, ry] = usedImage.getResolution(this.refImage)
    const [ox, oy] = this.refImage.getOrigin()
    const [sx, sy] = [usedImage.getWidth(), usedImage.getHeight()]

    // bbox is given as [minLat, minLon, maxLat, maxLon] in WGS84 degrees,
    // convert to native CRS units when the source is in Web Mercator
    const [bboxMinX, bboxMinY] = this.isWebMercator ? sm.forward([bbox[1], bbox[0]]) : [bbox[1], bbox[0]]
    const [bboxMaxX, bboxMaxY] = this.isWebMercator ? sm.forward([bbox[3], bbox[2]]) : [bbox[3], bbox[2]]

    let left = (bboxMinX - ox) / rx
    let right = (bboxMaxX - ox) / rx
    let bottom = (bboxMinY - oy) / ry
    let top = (bboxMaxY - oy) / ry

    if (rx < 0) [left, right] = [right, left]
    if (ry < 0) [bottom, top] = [top, bottom]

    left = Math.min(sx - 1, Math.max(0, Math.floor(left)))
    right = Math.min(sx - 1, Math.max(0, Math.ceil(right)))
    bottom = Math.min(sy - 1, Math.max(0, Math.floor(bottom)))
    top = Math.min(sy - 1, Math.max(0, Math.ceil(top)))

    // readRasters will fetch [left, right[ and [bottom, top[ hence the + 1
    const window = [left, bottom, right + 1, top + 1]
    const bands = this.rgb
      ? await usedImage.readRGB({ window, pool: geotiffPool, signal: abort })
      : await usedImage.readRasters({ window, fillValue: this.nodata, pool: geotiffPool, signal: abort })
    const data = this.rgb ? mergeRgb(bands) : bands[0]

    if (rx < 0) [left, right] = [right, left]
    if (ry < 0) [bottom, top] = [top, bottom]

    let dataBbox = [
      oy + (bottom * ry),
      ox + (left * rx),
      oy + (top * ry),
      ox + (right * rx)
    ]

    // convert dataBbox back from Web Mercator meters to WGS84 degrees if required
    if (this.isWebMercator) {
      const [lon0, lat0] = sm.inverse([dataBbox[1], dataBbox[0]])
      const [lon1, lat1] = sm.inverse([dataBbox[3], dataBbox[2]])
      dataBbox = [lat0, lon0, lat1, lon1]
    }

    return new Grid1D(
      sourceKey,
      dataBbox, [bands.height, bands.width],
      data, true, SortOrder.DESCENDING, SortOrder.ASCENDING,
      this.nodata, this.converter)
  }
}
