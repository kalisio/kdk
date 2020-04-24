import moment from 'moment'
import { unitConverters, SortOrder, GridSource, Grid1D, TiledGrid } from './grid'

// computes how many equidistant points are required to generate
// points at most every 'precision' degrees
function additionalPointsNeeded (lat, lon1, lon2, precision) {
  /*
  const p0 = [lon1, lat]
  const p1 = [lon2, lat]
  const dist = distance(p0, p1, { units: 'kilometers' })
  */

  const dist = lon2 - lon1
  const num = Math.ceil(dist / precision) - 1
  return Math.max(0, num)
}

// compute a query polygon where we make sure that
// we'll have a point at most every 'precision' degrees
// on longitudinal segments
function makeMongoPolygon (bbox, precision) {
  const minLatPoints = additionalPointsNeeded(bbox[0], bbox[1], bbox[3], precision)
  const maxLatPoints = additionalPointsNeeded(bbox[2], bbox[1], bbox[3], precision)
  const deltaLon = bbox[3] - bbox[1]

  const polygon = []
  for (let i = 0; i < minLatPoints + 2; ++i) {
    const lon = bbox[1] + (i / (minLatPoints + 1)) * deltaLon
    polygon.push([lon, bbox[0]])
  }

  for (let i = 0; i < maxLatPoints + 2; ++i) {
    const lon = bbox[3] - (i / (maxLatPoints + 1)) * deltaLon
    polygon.push([lon, bbox[2]])
  }

  // closing point
  polygon.push([bbox[1], bbox[0]])

  return polygon
}

export class WeacastGridSource extends GridSource {
  static getKey () {
    return 'weacast'
  }

  constructor (options) {
    super(options)

    this.api = options.weacastApi
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

    if (!this.api) return

    // find the model
    const model = this.api.models.find(model => model.name === config.model)
    if (!model) return

    this.converter = unitConverters[config.converter]
    this.time = moment(config.forecastTime).utc().format()
    this.service = config.model + '/' + config.element
    this.lonResolution = model.tileResolution[0]

    this.minMaxLat = [model.bounds[1], model.bounds[3]]
    // Internal tile management requires longitude in [-180, 180]
    const wrapLongitude = (model.bounds[2] === 360)
    this.minMaxLon = [wrapLongitude ? -180 : model.bounds[0], wrapLongitude ? 180 : model.bounds[2]]
    this.minMaxVal = null

    const query = {
      time: this.time,
      $select: ['forecastTime', 'minValue', 'maxValue'],
      $paginate: false
    }

    const srv = this.api.getService(this.service)
    const results = srv.find({ query })
    // const results = await this.api.getService(this.service).find({ query })
    if (results.length > 0) this.minMaxVal = [results[0].minValue, results[0].maxValue]

    this.usable = true

    this.dataChanged()
  }

  async fetch (abort, bbox, resolution) {
    if (!this.usable) { return null }

    // build a polygon with points longitudaly spaced every lonResolution degrees
    // otherwise mongodb will connect points using shortest path on sphere
    // which is not going to be a square lat/lon box

    const polygon = makeMongoPolygon(bbox, this.lonResolution)

    const query = {
      time: this.time,
      $select: ['forecastTime', 'data', 'geometry', 'size'],
      $paginate: false,
      // This is to target tiles instead of raw data
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Polygon',
            coordinates: [polygon]
          }
        }
      }
      // This is to target raw data by resampling according to input parameters
      /*
            oLon: this.wrapLongitude(bbox[1], this.model.bounds),
            oLat: bbox[2],
            sLon: width,
            sLat: height,
            dLon: resolution[1],
            dLat: resolution[0]
            */
    }

    // const t0 = performance.now()
    const results = await this.api.getService(this.service).find({ query })
    // const t1 = performance.now()
    // console.log(`req took ${t1 - t0}ms`)
    if (results.length === 0) return null

    // This is to target raw data
    // return new Grid1D(
    //   bbox, [width, height],
    //   results[0].data, true, SortOrder.DESCENDING, SortOrder.ASCENDING,
    //   this.nodata, this.converter)
    // This is to target tiles instead of raw data
    const tiles = []
    for (const tile of results) {
      const tileBBox = tile.geometry.coordinates[0] // BBox as a polygon
      const tileBounds = [tileBBox[0][1], tileBBox[0][0], tileBBox[2][1], tileBBox[2][0]]
      // normalize bounds when crossing longitude 180/-180
      if (tileBounds[1] > tileBounds[3]) {
        tileBounds[1] -= 360.0
      }
      tiles.push(new Grid1D(
        tileBounds, tile.size,
        tile.data, true, SortOrder.DESCENDING, SortOrder.ASCENDING,
        this.nodata, this.converter))
    }

    return tiles.length > 1 ? new TiledGrid(tiles) : tiles[0]
  }
}
