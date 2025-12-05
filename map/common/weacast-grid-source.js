import _ from 'lodash'
import moment from 'moment'
import { unitConverters, SortOrder, GridSource, Grid1D, TiledGrid, SubGrid } from './grid.js'

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

    this.api = options.planetApi
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

    if (!this.api) return

    // find the model
    const model = this.api.models.find(model => model.name === config.model)
    if (!model) return

    this.converter = unitConverters[config.converter]
    this.time = moment(config.forecastTime).utc().format()
    this.service = config.model + '/' + config.element
    this.lonResolution = model.tileResolution[0]

    this.useCache = _.get(config, 'useCache', true)
    this.maxCacheSize = _.get(config, 'maxCacheSize', 0)
    if (this.useCache) {
      this.tileCache = new Map()
      this.tileCounter = 0

      this.tileOrigin = [model.origin[1], model.origin[0]]
      this.tileSize = [model.tileResolution[1], model.tileResolution[0]]
      this.wrapLon = model.bounds[2] > 180.0
      this.maxTileX = ((model.bounds[2] - model.bounds[0]) / model.tileResolution[0]) - 1
      this.maxTileY = ((model.bounds[3] - model.bounds[1]) / model.tileResolution[1]) - 1
    } else {
      this.tileCache = null
    }

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
    const minLon = this.wrapLon ? (bbox[1] < 0 ? bbox[1] + 360.0 : bbox[1]) : bbox[1]
    const maxLon = this.wrapLon ? (bbox[3] < 0 ? bbox[3] + 360.0 : bbox[3]) : bbox[3]

    const e = Math.min(Math.max(Math.floor((maxLon - this.tileOrigin[1]) / this.tileSize[1]), 0), this.maxTileX)
    const w = Math.min(Math.max(Math.floor((minLon - this.tileOrigin[1]) / this.tileSize[1]), 0), this.maxTileX)
    const n = Math.min(Math.max(Math.floor((this.tileOrigin[0] - bbox[2]) / this.tileSize[0]), 0), this.maxTileY)
    const s = Math.min(Math.max(Math.floor((this.tileOrigin[0] - bbox[0]) / this.tileSize[0]), 0), this.maxTileY)

    const hits = []
    for (let j = n; j <= s; ++j) {
      if (w > e) {
        for (let i = 0; i <= e; ++i) hits.push(tile2key(i, j))
        for (let i = w; i <= this.maxTileX; ++i) hits.push(tile2key(i, j))
      } else {
        for (let i = w; i <= e; ++i) hits.push(tile2key(i, j))
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

    const sourceKey = this.sourceKey

    // issue required request
    if (requests.length) {
      // generate a query with points intersecting required tiles
      const points = []
      const offset = [this.tileSize[1] * 0.5, this.tileSize[0] * 0.5]
      for (let i = 0; i < requests.length; ++i) {
        const [x, y] = key2tile(requests[i])
        let tilex = this.tileOrigin[1] + (this.tileSize[1] * x)
        const tiley = this.tileOrigin[0] - (this.tileSize[0] * y)

        if (tilex >= 180) tilex -= 360.0

        points.push([tilex + offset[0], tiley - offset[1]])
      }
      const query = {
        time: this.time,
        $select: ['forecastTime', 'data', 'geometry', 'size', 'x', 'y'],
        $paginate: false,
        geometry: {
          $geoIntersects: {
            $geometry: {
              type: 'MultiPoint',
              coordinates: points
            }
          }
        }
      }

      const request = new Promise((resolve, reject) => {
        this.api.getService(this.service).find({ query }).then(tiles => {
          const grids = []

          // only add to cache when there has been no setup() called since
          if (sourceKey === this.sourceKey) {
            for (const tile of tiles) {
              const tileBBox = tile.geometry.coordinates[0] // BBox as a polygon
              const tileBounds = [tileBBox[0][1], tileBBox[0][0], tileBBox[2][1], tileBBox[2][0]]
              // normalize bounds when crossing longitude 180/-180
              if (tileBounds[1] > tileBounds[3]) tileBounds[1] -= 360.0

              const key = tile2key(tile.x, tile.y)
              const cached = this.tileCache.get(key)
              cached.grid = new Grid1D(
                sourceKey,
                tileBounds, tile.size,
                tile.data, true, SortOrder.DESCENDING, SortOrder.ASCENDING,
                this.nodata, this.converter)
              cached.request = null

              // take maxCacheSize into account
              if (this.maxCacheSize !== undefined) {
                // store a kind of timestamp on tiles
                cached.tileCounter = this.tileCounter
                ++this.tileCounter

                // make sure we keep cache size under control
                if (this.tileCounter > this.maxCacheSize) {
                  let oldestKey = key
                  let oldestCounter = cached.tileCounter
                  for (const [key, tile] of this.tileCache) {
                    if (tile.tileCounter === undefined) continue
                    if (tile.tileCounter < oldestCounter) {
                      oldestCounter = tile.tileCounter
                      oldestKey = key
                    }
                  }

                  this.tileCache.delete(oldestKey)
                }
              }

              grids.push(cached.grid)
            }
          }

          resolve(grids)
        })
      })

      // record pending request
      for (let i = 0; i < requests.length; ++i) {
        this.tileCache.set(requests[i], { request })
      }

      waits.push(request)
    }

    // wait associated requests
    const newGrids = await Promise.all(waits)
    const allGrids = grids.concat(newGrids.flat())
    if (allGrids.length === 0) return null

    const grid = allGrids.length > 1 ? new TiledGrid(sourceKey, allGrids) : allGrids[0]
    return new SubGrid(sourceKey, grid, bbox)
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

    const sourceKey = this.sourceKey
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
        sourceKey,
        tileBounds, tile.size,
        tile.data, true, SortOrder.DESCENDING, SortOrder.ASCENDING,
        this.nodata, this.converter)
      tiles.push(grid)
    }

    return tiles.length > 1 ? new TiledGrid(sourceKey, tiles) : tiles[0]
  }
}
