import L from 'leaflet'
// Using ES module import here seems to break things in Leaflet, we cannot probably mix both until v2
// import { Map, Handler, Util, DomUtil, DomEvent, LatLngBounds, Bounds } from 'Leaflet'

// BoxSelection is used to add shift-drag selection interaction to the map
// Inspired by default BoxZoom Leaflet handler adding shift-drag zoom interaction to the map

L.Map.mergeOptions({
  // Deactivate by default
  boxSelection: false,
  // If active deactivate default box zoom as it will conflict
  // boxZoom: false,
  boxSelectionKey: 'shiftKey'
})

export const BoxSelection = L.Handler.extend({
  initialize: function (map) {
    this._map = map
    this._boxSelectionKey = map.options.boxSelectionKey
    this._container = map._container
    this._pane = map._panes.overlayPane
    this._resetStateTimeout = 0
    map.on('unload', this._destroy, this)
  },

  addHooks: function () {
    L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this)
  },

  removeHooks: function () {
    L.DomEvent.off(this._container, 'mousedown', this._onMouseDown, this)
  },

  moved: function () {
    return this._moved
  },

  _destroy: function () {
    L.DomUtil.remove(this._pane)
    delete this._pane
  },

  _resetState: function () {
    this._resetStateTimeout = 0
    this._moved = false
  },

  _clearDeferredResetState: function () {
    if (this._resetStateTimeout !== 0) {
      clearTimeout(this._resetStateTimeout)
      this._resetStateTimeout = 0
    }
  },

  _onMouseDown: function (e) {
    if (!e[this._boxSelectionKey] || ((e.which !== 1) && (e.button !== 1))) { return false }

    // Clear the deferred resetState if it hasn't executed yet, otherwise it
    // will interrupt the interaction and orphan a box element in the container.
    this._clearDeferredResetState()
    this._resetState()

    L.DomUtil.disableTextSelection()
    L.DomUtil.disableImageDrag()

    this._startPoint = this._map.mouseEventToContainerPoint(e)

    L.DomEvent.on(document, {
      contextmenu: L.DomEvent.stop,
      mousemove: this._onMouseMove,
      mouseup: this._onMouseUp,
      keydown: this._onKeyDown
    }, this)
  },

  _onMouseMove: function (e) {
    if (!this._moved) {
      this._moved = true

      this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._container)
      L.DomUtil.addClass(this._container, 'leaflet-crosshair')

      this._map.fire('boxselectionstart', Object.assign(e, { containerPoint: this._startPoint }))
    }

    this._point = this._map.mouseEventToContainerPoint(e)

    const bounds = new L.Bounds(this._point, this._startPoint)
    const size = bounds.getSize()

    L.DomUtil.setPosition(this._box, bounds.min)

    this._box.style.width = size.x + 'px'
    this._box.style.height = size.y + 'px'
  },

  _finish: function () {
    if (this._moved) {
      L.DomUtil.remove(this._box)
      L.DomUtil.removeClass(this._container, 'leaflet-crosshair')
    }

    L.DomUtil.enableTextSelection()
    L.DomUtil.enableImageDrag()

    L.DomEvent.off(document, {
      contextmenu: L.DomEvent.stop,
      mousemove: this._onMouseMove,
      mouseup: this._onMouseUp,
      keydown: this._onKeyDown
    }, this)
  },

  _onMouseUp: function (e) {
    if ((e.which !== 1) && (e.button !== 1)) { return }

    this._finish()

    if (!this._moved) { return }
    // Postpone to next JS tick so internal click event handling
    // still see it as "moved".
    this._clearDeferredResetState()
    this._resetStateTimeout = setTimeout(L.Util.bind(this._resetState, this), 0)

    const bounds = new L.LatLngBounds(
      this._map.containerPointToLatLng(this._startPoint),
      this._map.containerPointToLatLng(this._point))

    this._map
      .fire('boxselectionend', Object.assign(e, { bounds, containerPoint: this._map.mouseEventToContainerPoint(e) }))
  },

  _onKeyDown: function (e) {
    if (e.keyCode === 27) {
      this._finish()
      this._clearDeferredResetState()
      this._resetState()
    }
  }
})

L.Map.addInitHook('addHandler', 'boxSelection', BoxSelection)
