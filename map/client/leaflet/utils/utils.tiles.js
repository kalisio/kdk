export function tile2key (coords) {
  // JS Number.MAX_SAFE_INTEGER = 2^53 - 1, so 53 bits available
  // put z value on  5 bits (0 - 32)
  // put y value on 24 bits (0 - 16777216)
  // put x value on 24 bits (0 - 16777216)
  // shift y by 5 bits (* 32)
  // shift x by 5+24 bits (* 536870912)
  return (coords.x * 536870912) + (coords.y * 32) + coords.z
}

export function key2tile (key) {
  // JS Number.MAX_SAFE_INTEGER = 2^53 - 1, so 53 bits available
  // put z value on  5 bits (0 - 32)
  // put y value on 24 bits (0 - 16777216)
  // put x value on 24 bits (0 - 16777216)
  // shift y by 5 bits (* 32)
  // shift x by 5+24 bits (* 536870912)
  const x = Math.floor(key / 536870912)
  const y = Math.floor((key - (x * 536870912)) / 32)
  const p = L.point(x, y)
  p.z = key - ((x * 536870912) + (y * 32))
  return p
}

export function tileSetContainsParent (tileset, coords) {
  const triplet = {
    x: coords.x,
    y: coords.y,
    z: coords.z
  }
  while (triplet.z > 1) {
    const tilekey = tile2key(triplet)
    if (tileset.has(tilekey)) return true
    triplet.x = Math.floor(triplet.x / 2)
    triplet.y = Math.floor(triplet.y / 2)
    triplet.z -= 1
  }
  return false
}

export function getParentTileInTileSet (tileset, coords) {
  const triplet = { 
    x: coords.x, 
    y: coords.y, 
    z: coords.z 
  }

  triplet.x = Math.floor(triplet.x / 2)
  triplet.y = Math.floor(triplet.y / 2)
  triplet.z -= 1

  while (triplet.z > 1) {
    const tilekey = tile2key(triplet)
    if (tileset.has(tilekey)) return triplet

    triplet.x = Math.floor(triplet.x / 2)
    triplet.y = Math.floor(triplet.y / 2)
    triplet.z -= 1
  }

  return undefined
}

export function computeIdealMaxNativeZoom (gridLayer, dataSetBounds, dataSetTileSize) {
  // compute optimal maxNativeZoom value to ensure
  // the smallest leaflet tile will approximately match a dataset tile

  // compute tile size farthest from equator
  const nw = dataSetBounds.getNorthWest()
  let z = 1
  while (true) {
    const nwPoint = gridLayer._map.project(nw, z)
    const coords = nwPoint.unscaleBy(gridLayer.getTileSize())
    coords.x = Math.floor(coords.x)
    coords.y = Math.floor(coords.y)
    coords.z = z

    const tileBounds = gridLayer._tileCoordsToBounds(coords)
    const tileWidth = tileBounds.getEast() - tileBounds.getWest()
    const tileHeight = tileBounds.getNorth() - tileBounds.getSouth()
    if (tileWidth < dataSetTileSize.lng || tileHeight < dataSetTileSize.lat) break

    z += 1
  }

  return Math.max(1, z - 1)
}
