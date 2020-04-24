import moment from 'moment'
import { unitConverters, SortOrder, GridSource, Grid1D, TiledGrid, SubGrid } from './grid'

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

function tile2key (x, y) {
  return x * 4294967296 + y
}

function key2tile (k) {
  const x = Math.floor(k / 4294967296)
  return [x, k - (x * 4294967296)]
}

export class WeacastGridSource extends GridSource {
  static getKey () {
    return 'weacast'
  }

  constructor (options) {
    super(options)

    this.api = options.weacastApi
    this.usable = false

    this.useCache = true
    this.setupKey = 0
  }

  getBBox () {
    return [this.minMaxLat[0], this.minMaxLon[0], this.minMaxLat[1], this.minMaxLon[1]]
  }

  getDataBounds () {
    return this.minMaxVal
  }

  async setup (config) {
    this.usable = false

    ++this.setupKey
    this.tileCache = new Map()

    if (!this.api) return

    // find the model
    const model = this.api.models.find(model => model.name === config.model)
    if (!model) return

    this.converter = unitConverters[config.converter]
    this.time = moment(config.forecastTime).utc().format()
    this.service = config.model + '/' + config.element
    this.lonResolution = model.tileResolution[0]

    /**/
    this.modelOrigin = [model.origin[1], model.origin[0]]
    this.tileRes = [model.tileResolution[1], model.tileResolution[0]]
    this.wrapLon = model.bounds[2] > 180.0
    /**/

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

    const results = await this.api.getService(this.service).find({ query })
    if (results.length > 0) this.minMaxVal = [results[0].minValue, results[0].maxValue]

    this.usable = true

    this.dataChanged()
  }

  fetch (abort, bbox, resolution) {
    if (!this.usable) { return null }

    return this.useCache
      ? this.fetchWithCache(abort, bbox, resolution)
      : this.fetchWithoutCache(abort, bbox, resolution)
  }

  async fetchWithCache (abort, bbox, resolution) {
    // compute which weacast tile(s) we're going to hit
    const lon0 = this.wrapLon ? (bbox[1] < 0 ? bbox[1] + 360.0 : bbox[1]) : bbox[1]
    const lon1 = this.wrapLon ? (bbox[3] < 0 ? bbox[3] + 360.0 : bbox[3]) : bbox[3]

    const minLon = Math.min(lon0, lon1)
    const maxLon = Math.max(lon0, lon1)

    const e = Math.floor((minLon - this.modelOrigin[1]) / this.tileRes[1])
    const w = Math.floor((maxLon - this.modelOrigin[1]) / this.tileRes[1])
    const n = Math.floor((this.modelOrigin[0] - bbox[2]) / this.tileRes[0])
    const s = Math.floor((this.modelOrigin[0] - bbox[0]) / this.tileRes[0])

    const hits = []
    for (let i = e; i <= w; ++i) {
      for (let j = n; j <= s; ++j) {
        hits.push(tile2key(i, j))
      }
    }

    const waits = []
    const grids = []
    const requests = []

    // lookup in cache for stuff we know about those tiles
    const entries = hits.map(key => this.tileCache.get(key))
    for (let i = 0; i < hits.length; ++i) {
      if (!entries[i]) {
        // nothing in cache so far, request must be made
        requests.push(hits[i])
      } else {
        // cache entry for tile
        if (entries[i].grid) {
          // grid data available
          grids.push(entries[i].grid)
        } else {
          // request in progress
          waits.push(entries[i].request)
        }
      }
    }

    const setupKey = this.setupKey

    // issue required request
    if (requests.length) {
      /*
      const x = new Set()
      const y = new Set()
      for (let i = 0; i < requests.length; ++i) {
        const [ix, iy] = key2tile(requests[i])
        x.add(ix)
        y.add(iy)
      }
      const query = this.makeQuery({ x: Array.from(x.values()), y: Array.from(y.values()) })
      */

      for (let i = 0; i < requests.length; ++i) {
        const [x, y] = key2tile(requests[i])
        const query = {
          time: this.time,
          $select: ['forecastTime', 'data', 'geometry', 'size', 'x', 'y'],
          $paginate: false,
          geometry: { $exists: true },
          x: x,
          y: y
        }
        const request = new Promise((resolve, reject) => {
          this.api.getService(this.service).find({ query }).then(tiles => {
            const grids = []

            // only add to cache when there has been no setup() called since
            if (setupKey === this.setupKey) {
              for (const tile of tiles) {
                const tileBBox = tile.geometry.coordinates[0] // BBox as a polygon
                const tileBounds = [tileBBox[0][1], tileBBox[0][0], tileBBox[2][1], tileBBox[2][0]]
                // normalize bounds when crossing longitude 180/-180
                if (tileBounds[1] > tileBounds[3]) tileBounds[1] -= 360.0

                const key = tile2key(tile.x, tile.y)
                const cached = this.tileCache.get(key)
                cached.grid = new Grid1D(
                  tileBounds, tile.size,
                  tile.data, true, SortOrder.DESCENDING, SortOrder.ASCENDING,
                  this.nodata, this.converter)
                cached.request = null
                grids.push(cached.grid)
              }
            }

            resolve(grids)
          })
        })

        this.tileCache.set(requests[i], { request })
        waits.push(request)
      }

      /*
      for (let i = 0; i < requests.length; ++i) {
        this.tileCache.set(requests[i], { request })
      }

      waits.push(request)
      */
    }

    // wait associated requests
    const newGrids = await Promise.all(waits)
    const allGrids = grids.concat(newGrids.flat())
    if (allGrids.length === 0) return null

    return allGrids.length > 1 ? new TiledGrid(allGrids) : new SubGrid(allGrids[0], bbox)
  }

  async fetchWithoutCache (abort, bbox, resolution) {
    const query = {
      time: this.time,
      $select: ['forecastTime', 'data', 'geometry', 'size'],
      $paginate: false,
      // build a polygon with points longitudaly spaced every lonResolution degrees
      // otherwise mongodb will connect points using shortest path on sphere
      // which is not going to be a square lat/lon box
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Polygon',
            coordinates: [makeMongoPolygon(bbox, this.lonResolution)]
          }
        }
      }
    }

    const results = await this.api.getService(this.service).find({ query })
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
      if (tileBounds[1] > tileBounds[3]) tileBounds[1] -= 360.0

      const grid = new Grid1D(
        tileBounds, tile.size,
        tile.data, true, SortOrder.DESCENDING, SortOrder.ASCENDING,
        this.nodata, this.converter)
      tiles.push(grid)
    }

    return tiles.length > 1 ? new TiledGrid(tiles) : tiles[0]
  }
}
