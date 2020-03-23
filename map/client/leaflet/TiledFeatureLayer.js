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
    // this.geojsonLayer = options.geojsonLayer
    this.activity = options.activity
    this.layerName = options.layerName
    this.service = options.service

    // register event callbacks
    this.on('tileload', (event) => { this.onTileLoad(event) })
    this.on('tileunload', (event) => { this.onTileUnload(event) })

    this.loadedTiles = new Set()
    // this.scheduledForUnload =
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

      const query = {
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

      this.service.find({ query }).then(result => {
        tile.geojson = result
        // tile.innerHTML = `coords: ${coords.x} ${coords.y} ${coords.z} ${result.features.length} features in tile ${tileSize.y} x ${tileSize.x}`
        done(null, tile)
      }).catch(err => {
        done(err, tile)
        throw err
      })
    } else {
      // tile.style.outline = '1px solid green'
      // tile.innerHTML = 'skipped!'
      setTimeout(() => { done(null, tile) }, 100)
    }

    return tile
  },

  onTileLoad (event) {
    const geojson = event.tile.geojson
    if (!geojson) return

    // add tile to loaded tiles set
    const tilekey = tile2key(event.coords)
    this.loadedTiles.add(tilekey)

    // update geojson layer with new bits
    this.activity.updateLayer(this.layerName, geojson)
  },

  onTileUnload (event) {
    const geojson = event.tile.geojson
    if (!geojson) return

    // check if we can unload the associated geojson bits
    // we only unload when the unloaded tile is completely outside
    // the visible bounds
    const visible = this.map.getBounds()
    const bounds = tile2bounds(this.map, event.coords, this.getTileSize())
    if (visible.intersects(bounds)) return

    // ok, we can unload geosjon, and remove tile from loaded tile set
    const tilekey = tile2key(event.coords)
    this.loadedTiles.delete(tilekey)

    this.activity.updateLayer(this.layerName, geojson, true)
  },

  onZoomStart (event) {
  },

  onZoomEnd (event) {
  }
})

export { TiledFeatureLayer }
