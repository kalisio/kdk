import * as GeoTIFF from 'geotiff'
import { unitConverters, SortOrder, GridSource, Grid1D } from './grid'
import * as wcs from './wcs-utils'

export class WcsGridSource extends GridSource {
  static getKey () {
    return 'wcs'
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

    this.queryFormat = null

    this.config = config
    this.converter = unitConverters[config.converter]

    // const caps = await wcs.GetCapabilities(this.config.url)

    // check image/tiff is supported
    // const formats = wcs.GetSupportedFormats(caps)
    // make sure coverage is available
    // const coverages = wcs.GetOfferedCoverages(caps)

    // use DescribeCoverage to find out bbox
    const coverage = await wcs.DescribeCoverage(this.config.url, this.config.coverage)
    const bounds = wcs.GetCoverageSpatialBounds(coverage)
    const formats = wcs.GetSupportedFormats(coverage)

    this.queryFormat = formats[0]
    this.minMaxLat = [bounds[0], bounds[2]]
    this.minMaxLon = [bounds[1], bounds[3]]

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

    const wcsbbox = [reqMinLon, reqMinLat, reqMaxLon, reqMaxLat]

    const image = await wcs.GetCoverage(abort, this.config.url, this.config.coverage, this.queryFormat, wcsbbox, width, height)
    // geotiff.js will try to use a FileReader to read from the blob
    // this class doesn't exist in node.js so we use fromArrayBuffer
      .then(blob => blob.arrayBuffer())
      .then(buffer => GeoTIFF.fromArrayBuffer(buffer))
      .then(tiff => tiff.getImage())
    const data = image.readRasters()
    const databbox = image.getBoundingBox()
    const gridbbox = [databbox[1], databbox[0], databbox[3], databbox[2]]
    const dimensions = [image.getHeight(), image.getWidth()]
    return new Grid1D(
      gridbbox, dimensions,
      (await data)[0], true, SortOrder.DESCENDING, SortOrder.ASCENDING,
      this.nodata, this.converter)
  }
}
