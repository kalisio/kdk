import L from 'leaflet'

function tile2bounds (map, coords, tileSize) {
  const pixelCoords0 = L.point(coords.x * tileSize.x, coords.y * tileSize.y)
  const pixelCoords1 = L.point(pixelCoords0.x + tileSize.x, pixelCoords0.y + tileSize.y)
  const latLonCoords0 = map.wrapLatLng(map.unproject(pixelCoords0, coords.z))
  const latLonCoords1 = map.wrapLatLng(map.unproject(pixelCoords1, coords.z))
  return L.latLngBounds(latLonCoords0, latLonCoords1)
}

function tile2key (coords) {
  // JS Number.MAX_SAFE_INTEGER = 2^53 - 1, so 53 bits available
  // put z value on  5 bits (0 - 32)
  // put y value on 24 bits (0 - 16777216)
  // put x value on 24 bits (0 - 16777216)
  // shift y by 5 bits (* 32)
  // shift x by 5+24 bits (* 536870912)
  return (coords.x * 536870912) + (coords.y * 32) + coords.z
}

const TiledFeatureLayer = L.GridLayer.extend({
  async initialize (options) {
    L.setOptions(this, options)
    // register event callbacks
    this.on('tileload', (event) => { this.onTileLoad(event) })
    this.on('tileunload', (event) => { this.onTileUnload(event) })

    this.loadedTiles = new Set()
  },

  onAdd (map) {
    this.map = map
    // be notified when zoom starts
    // keep a ref on bound objects to be able to remove them later
    // this.zoomStartCallback = this.onZoomStart.bind(this)
    // this.zoomEndCallback = this.onZoomEnd.bind(this)
    // map.on('zoomstart', this.zoomStartCallback)
    // map.on('zoomend', this.zoomEndCallback)
    L.GridLayer.prototype.onAdd.call(this, map)
  },

  onRemove (map) {
    L.GridLayer.prototype.onRemove.call(this, map)
    this.map = null
  },

  createTile (coords, done) {
    const tile = document.createElement('div')

    let skipTile = false

    // check we need to load the tile
    // we don't have to load it
    //  - when a tile at an upper zoom levelencompassing the tile is already loaded
    //  - or when all sub tiles have already been loaded
    // TODO: we may also check if we have all the sub tiles loaded too ...
    const triplet = {
      x: coords.x,
      y: coords.y,
      z: coords.z
    }

    while (triplet.z > 1) {
      const tilekey = tile2key(triplet)
      if (this.loadedTiles.has(tilekey)) {
        skipTile = true
        break
      }

      triplet.x = Math.ceil(triplet.x / 2)
      triplet.y = Math.ceil(triplet.y / 2)
      triplet.z -= 1
    }

    if (!skipTile) {
      // tile.style.outline = '1px solid red'

      const tileSize = this.getTileSize()
      const pixelCoords0 = L.point(coords.x * tileSize.x, coords.y * tileSize.y)
      const pixelCoords1 = L.point(pixelCoords0.x + tileSize.x, pixelCoords0.y + tileSize.y)
      const latLonCoords0 = this.map.wrapLatLng(this.map.unproject(pixelCoords0, coords.z))
      const latLonCoords1 = this.map.wrapLatLng(this.map.unproject(pixelCoords1, coords.z))

      const reqBBox = [
        Math.min(latLonCoords0.lat, latLonCoords1.lat), Math.min(latLonCoords0.lng, latLonCoords1.lng),
        Math.max(latLonCoords0.lat, latLonCoords1.lat), Math.max(latLonCoords0.lng, latLonCoords1.lng)
      ]
      const reqCenter = [
        0.5 * (reqBBox[0] + reqBBox[2]),
        0.5 * (reqBBox[1] + reqBBox[3])
      ]
      // Convert distance from degrees to meters
      const earthRadius = 6356752.31424518
      const maxDistance = (reqBBox[3] - reqBBox[1]) * (Math.PI * earthRadius) / 180

      const baseQuery = {
        geometry: {
          $geoIntersects: {
            $geometry: {
              type: 'Polygon',
              coordinates: [ // BBox as a polygon
                [[reqBBox[1], reqBBox[0]], [reqBBox[3], reqBBox[0]],
                 [reqBBox[3], reqBBox[2]], [reqBBox[1], reqBBox[2]], [reqBBox[1], reqBBox[0]]] // Closing point
              ]
            }
          }
        }
      }
      const leafletOptions = this.options.leaflet || this.options
      // Using async/await seems to cause problems in Leaflet, we use promises instead
      let promises = []
      // Request probes first if any
      if (this.options.probeService) {
        promises.push(this.options.activity.getProbeFeatures(Object.assign({ baseQuery }, this.options)))
      }
      // Then features
      let queryInterval
      if (leafletOptions.queryInterval) queryInterval = leafletOptions.queryInterval
      // If query interval not given use 2 x refresh interval as default value
      // this ensures we cover last interval if server/client update processes are not in sync
      if (!queryInterval && leafletOptions.interval) queryInterval = 2 * leafletOptions.interval
      // As we use MongoDB aggregation here we need to use the $geoNear stage
      promises.push(this.options.activity.getFeatures(Object.assign({
        baseQuery: {
          $geoNear: {
            near: { type: 'Point', coordinates: [ reqCenter[1] , reqCenter[0] ] },
            maxDistance,
            distanceField: 'distance',
            spherical: true,
            query: baseQuery
          }
        }
      }, this.options), queryInterval))
      Promise.all(promises).then(data => {
        if (this.options.probeService) {
          tile.probes = data[0]
          tile.features = data[1]
        } else {
          tile.features = data[0]
        }
        done(null, tile)
      })
      .catch (error => {
        done(error, tile)
        throw error
      })
    } else {
      setTimeout(() => { done(null, tile) }, 100)
    }

    return tile
  },

  async onTileLoad (event) {
    const probes = event.tile.probes
    const features = event.tile.features
    if (!probes && !features) return

    // add tile to loaded tiles set
    const tilekey = tile2key(event.coords)
    this.loadedTiles.add(tilekey)

    // Update realtime layer with probe first then (measure) features
    if (probes) this.options.activity.updateLayer(this.options.name, probes)
    if (features) this.options.activity.updateLayer(this.options.name, features)
  },

  onTileUnload (event) {
    const probes = event.tile.probes
    const features = event.tile.features
    if (!probes && !features) return

    // check if we can unload the associated geojson bits
    // we only unload when the unloaded tile is completely outside
    // the visible bounds
    const visible = this.map.getBounds()
    const bounds = tile2bounds(this.map, event.coords, this.getTileSize())
    if (visible.intersects(bounds)) return

    // ok, we can unload geosjon, and remove tile from loaded tile set
    const tilekey = tile2key(event.coords)
    this.loadedTiles.delete(tilekey)

    if (probes) this.options.activity.updateLayer(this.options.name, probes, true)
    else this.options.activity.updateLayer(this.options.name, features, true)
  },

  onZoomStart (event) {
  },

  onZoomEnd (event) {
  }
})

export { TiledFeatureLayer }
