import { SortOrder, Grid1D, TiledGrid, SubGrid } from './grid.js'

export async function fetcher (weacastApi, meteoModel, element, time, useCache) {
  const model = weacastApi.models.find(model => model.name === meteoModel)

  // Internal tile management requires longitude in [-180, 180]
  const wrapLongitude = (model.bounds[2] === 360)
  const fetcher = {
    weacastApi,
    time: time.utc().format(),
    service: meteoModel + '/' + element,
    spatialBounds: {
      minLon: wrapLongitude ? -180 : model.bounds[0],
      minLat: model.bounds[1],
      maxLon: wrapLongitude ? 180 : model.bounds[2],
      maxLat: model.bounds[3]
    }
  }

  const query = {
    time,
    $select: ['forecastTime', 'minValue', 'maxValue'],
    $paginate: false
  }

  const results = await weacastApi.getService(fetcher.service).find({ query })
  if (results.length > 0) {
    fetcher.dataBounds = { minVal: results[0].minValue, maxVal: results[0].maxValue }
  }

  if (useCache) {
    fetcher.tileCache = new Map()
    fetcher.numTiles = 0
    fetcher.tileOrigin = { lon: model.origin[0], lat: model.origin[1] }
    fetcher.tileSize = { lon: model.tileResolution[0], lat: model.tileResolution[1] }
    fetcher.wrapLon = model.bounds[2] > 180.0
    fetcher.maxTileX = ((model.bounds[2] - model.bounds[0]) / model.tileResolution[0]) - 1
    fetcher.maxTileY = ((model.bounds[3] - model.bounds[1]) / model.tileResolution[1]) - 1
  } else {
    fetcher.lonResolution = model.tileResolution[0]
  }

  return fetcher
}

function tile2key (x, y) {
  return x * 4294967296 + y
}

function key2tile (k) {
  const x = Math.floor(k / 4294967296)
  return [x, k - (x * 4294967296)]
}

async function fetchWithCache (fetcher, { minLon, minLat, maxLon, maxLat }, { resLon, resLat }, abort) {
  // compute which weacast tile(s) we're going to hit
  const minWrapLon = fetcher.wrapLon ? (minLon < 0 ? minLon + 360.0 : minLon) : minLon
  const maxWrapLon = fetcher.wrapLon ? (maxLon < 0 ? maxLon + 360.0 : maxLon) : maxLon

  const e = Math.min(Math.max(Math.floor((maxWrapLon - fetcher.tileOrigin.lon) / fetcher.tileSize.lon), 0), fetcher.maxTileX)
  const w = Math.min(Math.max(Math.floor((minWrapLon - fetcher.tileOrigin.lon) / fetcher.tileSize.lon), 0), fetcher.maxTileX)
  const n = Math.min(Math.max(Math.floor((fetcher.tileOrigin.lat - maxLat) / fetcher.tileSize.lat), 0), fetcher.maxTileY)
  const s = Math.min(Math.max(Math.floor((fetcher.tileOrigin.lat - minLat) / fetcher.tileSize.lat), 0), fetcher.maxTileY)

  const hits = []
  for (let j = n; j <= s; ++j) {
    if (w > e) {
      for (let i = 0; i <= e; ++i) hits.push(tile2key(i, j))
      for (let i = w; i <= fetcher.maxTileX; ++i) hits.push(tile2key(i, j))
    } else {
      for (let i = w; i <= e; ++i) hits.push(tile2key(i, j))
    }
  }

  const waits = []
  const grids = []
  const requests = []

  // lookup in cache for stuff we know about those tiles
  const entries = hits.map(key => fetcher.tileCache.get(key))
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

  // issue required request
  if (requests.length) {
    // generate a query with points intersecting required tiles
    const points = []
    const offset = [fetcher.tileSize.lon * 0.5, fetcher.tileSize.lat * 0.5]
    for (let i = 0; i < requests.length; ++i) {
      const [x, y] = key2tile(requests[i])
      let tilex = fetcher.tileOrigin.lon + (fetcher.tileSize.lon * x)
      const tiley = fetcher.tileOrigin.lat - (fetcher.tileSize.lat * y)

      if (tilex >= 180) tilex -= 360.0

      points.push([tilex + offset[0], tiley - offset[1]])
    }
    const query = {
      time: fetcher.time,
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
      fetcher.weacastApi.getService(fetcher.service).find({ query }).then(tiles => {
        const grids = []

        // only add to cache when there has been no setup() called since
        for (const tile of tiles) {
          const tileBBox = tile.geometry.coordinates[0] // BBox as a polygon
          const tileBounds = [tileBBox[0][1], tileBBox[0][0], tileBBox[2][1], tileBBox[2][0]]
          // normalize bounds when crossing longitude 180/-180
          if (tileBounds[1] > tileBounds[3]) tileBounds[1] -= 360.0

          const key = tile2key(tile.x, tile.y)
          const cached = fetcher.tileCache.get(key)
          cached.grid = new Grid1D(
            0,
            tileBounds, tile.size,
            tile.data, true, SortOrder.DESCENDING, SortOrder.ASCENDING,
            fetcher.nodata)
          cached.request = null

          // take maxCacheSize into account
          if (fetcher.maxCacheSize !== undefined) {
            // store a kind of timestamp on tiles
            cached.tileCounter = fetcher.tileCounter
            ++fetcher.tileCounter

            // make sure we keep cache size under control
            if (fetcher.tileCounter > fetcher.maxCacheSize) {
              let oldestKey = key
              let oldestCounter = cached.tileCounter
              for (const [key, tile] of fetcher.tileCache) {
                if (tile.tileCounter === undefined) continue
                if (tile.tileCounter < oldestCounter) {
                  oldestCounter = tile.tileCounter
                  oldestKey = key
                }
              }

              fetcher.tileCache.delete(oldestKey)
            }
          }

          grids.push(cached.grid)
        }

        resolve(grids)
      })
    })

    // record pending request
    for (let i = 0; i < requests.length; ++i) {
      fetcher.tileCache.set(requests[i], { request })
    }

    waits.push(request)
  }

  // wait associated requests
  const newGrids = await Promise.all(waits)
  const allGrids = grids.concat(newGrids.flat())
  if (allGrids.length === 0) return null

  const grid = allGrids.length > 1 ? new TiledGrid(0, allGrids) : allGrids[0]
  return new SubGrid(0, grid, [ minLat, minLon, maxLat, maxLon ])
}

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

async function fetchWithoutCache (fetcher, { minLon, minLat, maxLon, maxLat }, { resLon, resLat }, abort) {
  const query = {
    time: fetcher.time,
    $select: ['forecastTime', 'data', 'geometry', 'size'],
    $paginate: false,
    // build a polygon with points longitudaly spaced every lonResolution degrees
    // otherwise mongodb will connect points using shortest path on sphere
    // which is not going to be a square lat/lon box
    geometry: {
      $geoIntersects: {
        $geometry: {
          type: 'Polygon',
          coordinates: [makeMongoPolygon(bbox, fetcher.lonResolution)]
        }
      }
    }
  }

  const results = await fetcher.api.getService(fetcher.service).find({ query })
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
      0,
      tileBounds, tile.size,
      tile.data, true, SortOrder.DESCENDING, SortOrder.ASCENDING,
      fetcher.nodata)
    tiles.push(grid)
  }

  return tiles.length > 1 ? new TiledGrid(0, tiles) : tiles[0]
}

export async function fetchTile (meta, { minLon, minLat, maxLon, maxLat }, { resLon, resLat }, abort) {
  return meta.tileCache
    ? fetchWithCache(meta, { minLon, minLat, maxLon, maxLat }, { resLat, resLon }, abort)
    : fetchWithoutCache(meta, { minLon, minLat, maxLon, maxLat }, { resLat, resLon }, abort)
}

export async function probeTimeRange (weacastApi, meteoModel, elements, { lon, lat }, { t0, t1 }) {
  const query = {
    forecastTime: {
      $gte: t0.format(),
      $lte: t1.format()
    },
    geometry: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        }
      }
    }
  }
  const response = await weacastApi
        .getService('probes')
        .create({
          forecast: meteoModel,
          elements: elements
        }, { query })
  return response.features.length > 0 ? response.features[0] : null
}
