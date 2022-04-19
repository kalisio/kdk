import L from 'leaflet'
import _ from 'lodash'
import logger from 'loglevel'
import bbox from '@turf/bbox'
import { featureEach } from '@turf/meta'
import { featureCollection } from '@turf/helpers'
import { tile2key, key2tile, tileSetContainsParent, getParentTileInTileSet } from './utils'

const TiledFeatureLayer = L.GridLayer.extend({
  initialize (options) {
    this.enableDebug = _.get(options, 'enableDebug', false)
    this.enableDebug = false
    L.GridLayer.prototype.initialize.call(this, options)

    this.on('tileunload', (event) => { this.onTileUnload(event) })

    this.userIsDragging = false
    this.getFeatureKey = (feature) => {
      const id = _.get(this.layer, 'featureId', '_id')
      return _.get(feature, 'properties.' + id, _.get(feature, id))
    }

    this.featureSource = options.featureSource

    this.flyingTiles = new Map()
    this.modifiedTiles = new Set()
    this.allFeatures = new Map()
  },

  setup (activity, layer) {
    this.activity = activity
    this.layer = layer
  },

  onAdd (map) {
    this.flyingTiles.clear()
    this.modifiedTiles.clear()
    this.allFeatures.clear()

    L.GridLayer.prototype.onAdd.call(this, map)
  },

  onRemove (map) {
    this.flyingTiles.clear()
    this.modifiedTiles.clear()
    this.allFeatures.clear()

    L.GridLayer.prototype.onRemove.call(this, map)
  },

  getEvents () {
    const events = L.GridLayer.prototype.getEvents.call(this)

    // listen to 'dragstart' and 'dragend' to know when user is dragging the map

    const onDragStart = events.dragstart
    events.dragstart = (event) => {
      this.userIsDragging = true
      if (onDragStart) onDragStart.call(this, event)
    }

    const onDragEnd = events.dragend
    events.dragend = (event) => {
      this.userIsDragging = false
      if (onDragEnd) onDragEnd.call(this, event)
    }

    return events
  },

  createTile (coords) {
    const key = tile2key(coords)
    let tile = this.flyingTiles.get(key)
    if (tile === undefined) {
      tile = {
        div: document.createElement('div'),
        coords: coords,
        bbox: this._tileCoordsToBounds(coords),
        featuresRequest: null,
        featuresChildren: [],
        features: [],
        measuresRequest: null,
        measuresChildren: [],
        unload: false
      }

      this.flyingTiles.set(key, tile)

      if (this.enableDebug) {
        tile.div.style.outline = '1px solid orange'
        tile.div.innerHTML = ''
      }
    } else {
      tile.unload = false
      if (this.enableDebug) tile.div.innerHTML += '</br>createTile: found in flying tiles'
    }

    this.modifiedTiles.add(key)

    return tile.div
  },

  onTileUnload (event) {
    const key = tile2key(event.coords)
    const tile = this.flyingTiles.get(key)
    if (tile) tile.unload = true
    this.modifiedTiles.add(key)

    if (this.enableDebug && tile) tile.div.innerHTML += `</br>unload scheduled`
  },

  mergeRequests (tiles) {
    const requests = []

    // Try to merge tiles vertically, then horizontally
    const sortedTiles = tiles.sort((a, b) => {
      if (a.coords.x === b.coords.x) {
        return a.coords.y < b.coords.y ? -1 : a.coords.y !== b.coords.y ? 1 : 0
      }
      return a.coords.x < b.coords.x ? -1 : 1
    })

    if (sortedTiles.length) {
      let z = sortedTiles[0].coords.z
      const vrequests = []
      sortedTiles.forEach((tile) => {
        let newRequest = true
        if (vrequests.length) {
          const r = vrequests[vrequests.length - 1]
          if (tile.coords.x === r.x) {
            if (tile.coords.y === r.maxy + 1) {
              r.tiles.push(tile)
              r.maxy = tile.coords.y
              newRequest = false
            }
          }
        }
        if (newRequest) {
          vrequests.push({
            x: tile.coords.x,
            miny: tile.coords.y,
            maxy: tile.coords.y,
            tiles: [tile]
          })
        }
      })

      // Now try to merge horizontally adjacent vertical requests
      vrequests.forEach((v) => {
        let newRequest = true
        if (requests.length) {
          const h = requests[requests.length - 1]
          if (v.miny === h.miny && v.maxy === h.maxy && v.x === h.maxx + 1) {
            h.tiles.push(...v.tiles)
            h.maxx = v.x
            newRequest = false
          }
        }
        if (newRequest) {
          requests.push({
            minx: v.x,
            maxx: v.x,
            miny: v.miny,
            maxy: v.maxy,
            tiles: [].concat(v.tiles)
          })
        }
      })

      // Compute final query
      requests.forEach((r) => {
        const minp = L.point(r.minx, r.miny), maxp = L.point(r.maxx, r.maxy)
        minp.z = maxp.z = z
        const bounds = this._tileCoordsToBounds(minp)
        bounds.extend(this._tileCoordsToBounds(maxp))
        r.query = {
          south: bounds.getSouth(),
          north: bounds.getNorth(),
          west: bounds.getWest(),
          east: bounds.getEast()
        }
      })

      if (this.enableDebug) {
        let numTilesR = 0
        requests.forEach((r) => { numTilesR += r.tiles.length })
        if (numTilesR != tiles.length) {
          logger.debug('TiledFeatureLayer: less requested tiles than expected !')
        }
      }
    }

    /* One request per tile
    tiles.forEach((tile) => {
      const r = {
        tiles: [ tile ],
        query: {
          south: tile.bbox.getSouth(),
          north: tile.bbox.getNorth(),
          west: tile.bbox.getWest(),
          east: tile.bbox.getEast()
        }
      }
      requests.push(r)
    })
    */

    if (this.enableDebug && tiles.length) {
      logger.debug(`TiledFeatureLayer: ${tiles.length} requests reduced to ${requests.length}`)
    }

    return requests
  },

  _update (center) {
    L.GridLayer.prototype._update.call(this)

    // No update while dragging
    if (this.userIsDragging) return

    const tilesToRemove = []
    const tilesWithFeaturesRequest = []
    const tilesWithMeasuresRequest = []

    const minFeatureZoom = _.get(this.options, 'minFeatureZoom', this._map.getMinZoom())
    const maxFeatureZoom = _.get(this.options, 'maxFeatureZoom', this._map.getMaxZoom())

    // Loop through tiles to consider
    // - either tile is flagged for unload => work on its feature once the pending request is over
    // - either tile is flagged for load
    //   in this case, we check if there's a parent tile from which we can read data
    //   if not, we'll have to issue a request to the featureSource
    this.modifiedTiles.forEach((key) => {
      const tile = this.flyingTiles.get(key)

      // This can happen when a tile has been removed from flyingTiles
      // because the associated request failed
      if (tile === undefined) return

      if (tile.unload) {
        // Wait for request to end before removing associated tile data since
        // a child tile may wait on that request
        if (tile.featuresRequest === null && tile.measuresRequest === null) tilesToRemove.push(tile)
      } else {
        const tileWithMeasures = this.layer.probeService && (tile.coords.z >= minFeatureZoom) && (tile.coords.z <= maxFeatureZoom)

        if (this.enableDebug) {
          tile.div.innerHTML += '</br>features'
          if (tileWithMeasures) tile.div.innerHTML += ' + measures'
        }

        const parentTileCoords = getParentTileInTileSet(this.flyingTiles, tile.coords)
        if (parentTileCoords === undefined) {
          // No known parent tile, we'll have to request data
          tilesWithFeaturesRequest.push(tile)
          if (tileWithMeasures) tilesWithMeasuresRequest.push(tile)
          if (this.enableDebug) tile.div.innerHTML += '</br>need request(s)'
        } else {
          const parentTile = this.flyingTiles.get(tile2key(parentTileCoords))

          if (parentTile.featuresRequest === null) {
            // Parent tile has already loaded the features, fetch from there
            parentTile.features.forEach((featureId) => {
              const feature = this.allFeatures.get(featureId)
              if (tile.bbox.intersects(feature.bbox)) {
                feature.refCount += 1
                tile.features.push(featureId)
              }
            })

            if (this.enableDebug) {
              tile.div.style.outline = '1px solid green'
              tile.div.innerHTML += `</br>found ${tile.features.length} features in parent tile`
            }
          } else {
            // Otherwise, link to pending parent tile request
            parentTile.featuresChildren.push(tile)
            tile.featuresRequest = parentTile.featuresRequest

            if (this.enableDebug) tile.div.innerHTML += '</br>pending parent features request'
          }

          // Special case for probes: the parent tile may be at the level where only probes are loaded
          // and it's still missing the measures
          if (tileWithMeasures) {
            if (parentTile.measuresRequest !== null) {
              parentTile.measuresChildren.push(tile)
              tile.measuresRequest = parentTile.measuresRequest

              if (this.enableDebug) tile.div.innerHTML += '</br>pending parent measures request'
            } else if (parentTileCoords.z < minFeatureZoom) {
              tilesWithMeasuresRequest.push(tile)

              if (this.enableDebug) tile.div.innerHTML += '</br>need measures request'
            }
          }
        }
      }
    })

    this.modifiedTiles.clear()

    // We have to issue request(s) for tiles with no features. Requests can span over
    // multiple tiles due to merge step
    // Once requests are done, dispatch loaded features amongst associated tiles. A top level tile
    // may have children tiles too, these will get updated also.
    const featureRequests = this.mergeRequests(tilesWithFeaturesRequest)
    featureRequests.forEach((r) => {
      const promise = this.layer.probeService
            ? this.activity.getProbeFeatures(_.merge({ baseQuery: r.query }, this.layer))
            : this.featureSource(r.query)
      r.tiles.forEach((tile) => {
        tile.featuresRequest = promise

        if (this.enableDebug) tile.div.innerHTML += '</br>features request issued'
      })

      promise.then((data) => {
        // Gather all associated tiles, taking children tiles into account
        const allTiles = [r.tiles]
        r.tiles.forEach((tile) => { if (tile.featuresChildren.length) allTiles.push(tile.featuresChildren) })
        const tiles = allTiles.flat()

        const features = data.features
        const addCollection = []
        features.forEach((feature) => {
          const featureId = this.getFeatureKey(feature)
          let knownFeature = this.allFeatures.get(featureId)
          if (knownFeature === undefined) {
            const turfBbox = bbox(feature)
            const corner1 = L.latLng(turfBbox[1], turfBbox[0])
            const corner2 = L.latLng(turfBbox[3], turfBbox[2])
            knownFeature = { geojson: feature, refCount: 0, bbox: L.latLngBounds(corner1, corner2) }
            this.allFeatures.set(featureId, knownFeature)
            addCollection.push(feature)
          }
          tiles.forEach((tile) => {
            if (tile.bbox.intersects(knownFeature.bbox)) {
              knownFeature.refCount += 1
              tile.features.push(featureId)
            }
          })
        })
        // Add to underlying geojson layer
        if (addCollection.length)
          this.activity.updateLayer(this.layer.name, featureCollection(addCollection))

        // Notify tiles their request is done
        tiles.forEach((tile) => {
          tile.featuresRequest = null
          tile.featuresChildren = []
          // When a tile was scheduled for removal, add it to the list of tiles to consider
          if (tile.unload) this.modifiedTiles.add(tile2key(tile.coords))

          if (this.enableDebug) {
            tile.div.style.outline = '1px solid green'
            tile.div.innerHTML += `</br>features request success: ${features.length} total, ${tile.features.length} for tile`
          }
        })


        if (this.enableDebug) logger.debug(`TiledFeatureLayer: allFeatures is ${this.allFeatures.size} long`)
      }).catch((err) => {
        // Gather all associated tiles, taking children tiles into account
        const allTiles = [r.tiles]
        r.tiles.forEach((tile) => { if (tile.featuresChildren.length) allTiles.push(tile.featuresChildren) })
        const tiles = allTiles.flat()

        // Failed tiles are removed from flyingTiles
        tiles.forEach((tile) => {
          this.flyingTiles.delete(tile2key(tile.coords))

          if (this.enableDebug) {
            tile.div.style.outline = '1px solid red'
            tile.div.innerHTML += `</br>features request failed: ${err}`
          }
        })

        if (this.enableDebug) logger.debug(`TiledFeatureLayer: allFeatures is ${this.allFeatures.size} long`)
      })
    })

    // Handle tiles where we need to fetch measures
    const measureRequests = this.mergeRequests(tilesWithMeasuresRequest)
    measureRequests.forEach((r) => {
      const promise = this.featureSource(r.query)
      r.tiles.forEach((tile) => {
        if (this.enableDebug) tile.div.innerHTML += '</br>measures request issued'
      })

      promise.then((data) => {
        // Gather all associated tiles, taking children tiles into account
        const allTiles = [r.tiles]
        r.tiles.forEach((tile) => { if (tile.measuresChildren.length) allTiles.push(tile.measuresChildren) })
        const tiles = allTiles.flat()

        tiles.forEach((tile) => {
          if (this.enableDebug) tile.div.innerHTML += `</br>measures request success: ${data.features.length} total`
        })

        // Here we know we already have the stations
        if (data.features.length) {
          this.activity.updateLayer(this.layer.name, data)
        }
      }).catch((err) => {
        const allTiles = [r.tiles]
        r.tiles.forEach((tile) => { if (tile.measuresChildren.length) allTiles.push(tile.measuresChildren) })
        const tiles = allTiles.flat()

        tiles.forEach((tile) => {
          if (this.enableDebug) {
            tile.div.style.outline = '1px solid red'
            tile.div.innerHTML += `</br>measures request failed: ${err}`
          }
        })
      })
    })

    // Now handle tiles to remove
    const removeCollection = []
    tilesToRemove.forEach((tile) => {
      tile.features.forEach((featureId) => {
        const feature = this.allFeatures.get(featureId)
        if (feature === undefined) debugger
        if (feature.refCount === 1) {
          removeCollection.push(feature.geojson)
          this.allFeatures.delete(featureId)
        } else {
          feature.refCount -= 1
        }
      })
      this.flyingTiles.delete(tile2key(tile.coords))
    })
    if (removeCollection.length)
      this.activity.updateLayer(this.layer.name, featureCollection(removeCollection), true)

    if (this.enableDebug) {
      logger.debug(`TiledFeatureLayer: flyingTiles is ${this.flyingTiles.size} long`)
      logger.debug(`TiledFeatureLayer: allFeatures is ${this.allFeatures.size} long`)
    }
  },

  redraw () {
    // remove tiles manually first
    if (this._map) this._removeAllTiles()

    this.flyingTiles.clear()
    this.modifiedTiles.clear()
    this.allFeatures.clear()

    // request grid layer redraw
    L.GridLayer.prototype.redraw.call(this)
  }
})

export { TiledFeatureLayer }
