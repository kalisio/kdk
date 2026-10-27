import L from 'leaflet'

// Base class for tiled layers displaying data from one or more grid sources (eg. mesh, wind, wind barbs).
// Adding the layer to leaflet is deferred until all grid sources have data, otherwise leaflet will start
// loading meaningless tiles against grid sources that haven't been configured yet (see onAdd/onPendingAdd).
// Derived classes are expected to:
// - call TiledGridSourceLayer.prototype.initialize with their grid sources instead of L.GridLayer.prototype.initialize,
// - override refresh() if data changes require more than reloading tiles,
// - call base onPendingAdd/onRemove when overriding them to setup/cleanup their own resources.
const TiledGridSourceLayer = L.GridLayer.extend({
  initialize (options, ...gridSources) {
    L.GridLayer.prototype.initialize.call(this, options)

    this.gridSources = gridSources
    // keep ref on callback to be able to remove it
    this.onDataChangedCallback = this.onDataChanged.bind(this)
    this.gridSources.forEach(gridSource => gridSource.on('data-changed', this.onDataChangedCallback))
    // when listening to multiple sources (eg. u and v), wait for all of them to have fired before reacting
    this.numDataChanged = 0
  },

  setTime (time) {
    // no need to force a tile refresh here as the real invalidation happens later,
    // once the grid source actually changes its data
    this.gridSources.forEach(gridSource => {
      if (typeof gridSource.setTime === 'function') gridSource.setTime(time)
    })
  },

  setLevel (level) {
    // no need to force a tile refresh here as the real invalidation happens later,
    // once the grid source actually changes its data
    this.gridSources.forEach(gridSource => {
      if (typeof gridSource.setLevel === 'function') gridSource.setLevel(level)
    })
  },

  setModel (model) {
    // no need to force a tile refresh here as the real invalidation happens later,
    // once the grid source actually changes its data
    this.gridSources.forEach(gridSource => {
      if (typeof gridSource.setModel === 'function') gridSource.setModel(model)
    })
  },

  onDataChanged () {
    ++this.numDataChanged
    if (this.numDataChanged < this.gridSources.length) return
    this.numDataChanged = 0

    // allow grid layer to only request tiles located in those bounds
    const points = []
    this.gridSources.forEach(gridSource => {
      const bbox = gridSource.getBBox()
      if (bbox) {
        points.push(L.latLng(bbox[0], bbox[1]))
        points.push(L.latLng(bbox[2], bbox[3]))
      }
    })
    this.options.bounds = points.length ? L.latLngBounds(points) : null

    // we now have data to display, it may be time to add the layer to the map
    if (this.pendingAdd) {
      this.onPendingAdd()
    } else {
      // the underlying data actually changed (new dataset/model/time/...), a reload is required
      this.refresh()
    }

    // notify others we have data (for example color legend component)
    this.fire('data')
    this.hasData = true
  },

  refresh () {
    this.redraw()
  },

  onAdd (map) {
    // defer actual addLayer call to the point where we have data ready to be displayed
    this.pendingAdd = map
  },

  onPendingAdd () {
    const map = this.pendingAdd
    L.GridLayer.prototype.onAdd.call(this, map)
    this.pendingAdd = null
  },

  onRemove (map) {
    if (this.pendingAdd) {
      // never actually got added to leaflet (see onAdd/onPendingAdd), nothing to clean up
      this.pendingAdd = null
    } else {
      L.GridLayer.prototype.onRemove.call(this, map)
    }

    // only dynamic grid sources can be invalidated, ensure next update can't be skipped
    this.gridSources.forEach(gridSource => {
      if (typeof gridSource.invalidate === 'function') gridSource.invalidate()
    })
  },

  bringToFront () {
    // the container only exists once actually added to leaflet (see onAdd/onPendingAdd)
    if (this.pendingAdd) return this
    return L.GridLayer.prototype.bringToFront.call(this)
  },

  bringToBack () {
    // the container only exists once actually added to leaflet (see onAdd/onPendingAdd)
    if (this.pendingAdd) return this
    return L.GridLayer.prototype.bringToBack.call(this)
  },

  getBounds () {
    const bounds = this.options.bounds ? this.options.bounds : L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180))
    return this._map ? this._map.wrapLatLngBounds(bounds) : bounds
  }
})

export { TiledGridSourceLayer }
