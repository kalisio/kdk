import _ from 'lodash'
import L from 'leaflet'
import 'abort-controller/polyfill.js'
import { utils as kdkCoreUtils } from '../../../core.client.js'
import { getDefaultLineStyle, getDefaultPointStyle, createMarkerFromPointStyle } from './utils/utils.style.js'

// Default label placement options
const DefaultLabels = {
  // distance between two consecutive labels along an isoline, in screen pixels,
  // 0 means a single label in the middle of each isoline
  spacing: 250
}

// Returns the point located at the given distance along a polyline,
// distances being the cumulated distance of each point from the start of the polyline.
// Difference with turfjs along is that it works in screen space as we'd like to separate labels by a distance in pixels.
function pointAlong (points, distances, distance) {
  distance = _.clamp(distance, 0, distances[distances.length - 1])
  const index = Math.max(1, _.sortedIndex(distances, distance))
  if (index >= points.length) return points[points.length - 1]
  const start = distances[index - 1]
  const length = distances[index] - start
  const ratio = length > 0 ? (distance - start) / length : 0
  const p0 = points[index - 1]
  const p1 = points[index]
  return L.point(p0.x + ratio * (p1.x - p0.x), p0.y + ratio * (p1.y - p0.y))
}

function angleBetween (p0, p1) {
  return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI
}

// Displays the isolines of a grid source variable computed by the source itself (eg. kazarr) over the current view.
// Unlike tiled layers, the whole view is requested at once so that each isoline comes in one piece instead of being cut at every tile boundary.
// Isolines are styled using the line style of the layer and labelled using its point style, a label being a shape marker
// repeated along each isoline according to its orientation. Labels are used as a tooltip and displayed on map according to the point style
// (usually through a template using the isoline 'threshold' property).
const IsolineLayer = L.GeoJSON.extend({
  initialize (options, gridSource) {
    // thresholds to compute isolines for, forwarded as is to the grid source (see eg. KazarrGridSource.isolines)
    this.thresholds = _.get(options, 'thresholds', [])
    this.labelOptions = _.defaults({}, _.get(options, 'labels'), DefaultLabels)

    // Take care that 'style' is also used as the kdk style of the layer in options,
    // which has already been processed as layerLineStyle/layerPointStyle (see processGeoJsonStyleOptions)
    L.GeoJSON.prototype.initialize.call(this, null, Object.assign({}, options, {
      style: (feature) => this.getLineStyle(feature),
      onEachFeature: (feature, layer) => this.setupFeature(feature, layer)
    }))

    // Setup the colormap to color each isoline according to the underlying variable's chromajs config, unless overridden by the layer style
    const chromajs = _.get(options, 'chromajs')
    this.colorMap = chromajs ? kdkCoreUtils.buildColorScale(chromajs) : null

    // Labels are markers managed apart from isolines
    this.labels = L.layerGroup()

    this.gridSource = gridSource
    this.onDataChangedCallback = this.onDataChanged.bind(this)
    this.gridSource.on('data-changed', this.onDataChangedCallback)
  },

  setTime (time) {
    // no need to refresh here as the real invalidation happens later, once the grid source actually changes its data
    if (typeof this.gridSource.setTime === 'function') this.gridSource.setTime(time)
  },

  setLevel (level) {
    // the level is used by the grid source when templating its configuration, eg. as a kazarr query parameter,
    // if config allow it (eg a layer might want to force not using the level at all)
    if (_.get(this.options, 'useLevel', true) && (typeof this.gridSource.setLevel === 'function')) this.gridSource.setLevel(level)
  },

  setModel (model) {
    if (typeof this.gridSource.setModel === 'function') this.gridSource.setModel(model)
  },

  onDataChanged () {
    // we now have data to display, it may be time to add the layer to the map
    if (this.pendingAdd) {
      this.onPendingAdd()
    } else {
      this.refresh()
    }

    // notify others we have data (for example color legend component)
    this.fire('data')
    this.hasData = true
  },

  onAdd (map) {
    // defer actual addLayer call to the point where we have data ready to be displayed
    // otherwise, we will request isolines against a grid source that hasn't been configured yet
    this.pendingAdd = map
  },

  onPendingAdd () {
    const map = this.pendingAdd
    this.pendingAdd = null
    L.GeoJSON.prototype.onAdd.call(this, map)
    map.addLayer(this.labels)
    map.on('moveend', this.refresh, this)
    this.refresh()
  },

  onRemove (map) {
    if (this.pendingAdd) {
      this.pendingAdd = null
    } else {
      map.off('moveend', this.refresh, this)
      this.abort()
      this.setData(null)
      map.removeLayer(this.labels)
      L.GeoJSON.prototype.onRemove.call(this, map)
    }

    this.gridSource.invalidate()
  },

  isLoading () {
    return !_.isNil(this.fetchController)
  },

  abort () {
    if (this.fetchController) {
      this.fetchController.abort()
      this.fetchController = null
      this.fire('load')
    }
  },

  // Returns the bbox to request isolines for, ie. the current view restricted to the data bounds, or null if nothing to display
  getRequestBBox () {
    const map = this._map
    const zoom = map.getZoom()
    if (zoom < _.get(this.options, 'minZoom', -Infinity) || zoom > _.get(this.options, 'maxZoom', Infinity)) return null

    const view = map.getBounds()
    let bbox = [
      Math.max(view.getSouth(), -90), Math.max(view.getWest(), -180),
      Math.min(view.getNorth(), 90), Math.min(view.getEast(), 180)
    ]
    const dataBBox = this.gridSource.getBBox()
    if (dataBBox) {
      bbox = [
        Math.max(bbox[0], dataBBox[0]), Math.max(bbox[1], dataBBox[1]),
        Math.min(bbox[2], dataBBox[2]), Math.min(bbox[3], dataBBox[3])
      ]
    }
    return (bbox[0] < bbox[2]) && (bbox[1] < bbox[3]) ? bbox : null
  },

  // Replaces displayed isolines and their labels
  setData (geojson) {
    this.clearLayers()
    if (geojson) this.addData(geojson)
    this.updateLabels()
  },

  refresh () {
    if (!this._map) return

    // a new request supersedes any in-flight one
    this.abort()
    const bbox = this.getRequestBBox()
    if (!bbox) {
      this.setData(null)
      return
    }

    const fetchController = new AbortController()
    this.fetchController = fetchController
    this.fire('loading')
    this.gridSource.isolines(fetchController.signal, bbox, { thresholds: this.thresholds }).then((result) => {
      // superseded by another request meanwhile
      if (this.fetchController !== fetchController) return
      this.fetchController = null
      this.setData(result && result.sourceKey === this.gridSource.sourceKey ? result.geojson : null)
      this.fire('load')
    }).catch((error) => {
      if (this.fetchController !== fetchController) return
      this.fetchController = null
      this.setData(null)
      this.fire('load')
      console.error(error)
    })
  },

  getZoom () {
    return this._map ? this._map.getZoom() : undefined
  },

  getLineStyle (feature) {
    const threshold = _.get(feature, 'properties.threshold')
    const color = this.colorMap ? this.colorMap(threshold).hex() : 'black'
    const style = getDefaultLineStyle(feature, this.options, { color, width: 2, opacity: 1 }, this.getZoom())
    // isolines are requested for the current view, no need to clip them to it
    return Object.assign(style, { noClip: true })
  },

  setupFeature (feature, layer) {
    // Tooltip relies on the tooltip style of the layer (see mixin)
    const tooltip = (typeof this.options.generateTooltip === 'function' ? this.options.generateTooltip(feature, layer) : null)
    if (tooltip) layer.bindTooltip(tooltip)
    // Resolve the label style once per isoline as it is the same for all its labels
    const labelStyle = getDefaultPointStyle(feature, this.options, {
      shape: 'none',
      text: {
        color: _.get(layer, 'options.color'),
        size: 11,
        // white rounded background so that labels remain readable over the isoline and the map
        extraStyle: 'background-color: #fff; border-radius: 8px; padding: 0 4px; line-height: 1.4'
      }
    }, this.getZoom())
    const label = _.toString(_.get(labelStyle, 'text.label'))
    if (_.isEmpty(label)) return
    _.set(labelStyle, 'text.label', label)
    layer.labelStyle = labelStyle
  },

  // Creates the labels repeated along each isoline according to its orientation
  updateLabels () {
    this.labels.clearLayers()
    const map = this._map
    if (!map) return

    const { spacing } = this.labelOptions
    const view = map.getBounds()
    this.eachLayer((layer) => {
      const labelStyle = layer.labelStyle
      if (!labelStyle) return
      // Rough estimate of the label length in pixels so that the isoline orientation is computed under the whole label
      const halfLength = 0.5 * labelStyle.text.label.length * 0.6 * _.get(labelStyle, 'text.size', 11)
      // LineString or MultiLineString
      const latLngs = layer.getLatLngs()
      const parts = L.LineUtil.isFlat(latLngs) ? [latLngs] : latLngs
      for (const part of parts) {
        if (part.length < 2) continue
        // Work in screen space, computing cumulated distances once so that locating a point along the isoline is a simple lookup
        const points = part.map(latLng => map.latLngToLayerPoint(latLng))
        const distances = [0]
        for (let i = 1; i < points.length; i++) distances.push(distances[i - 1] + points[i].distanceTo(points[i - 1]))
        const length = distances[distances.length - 1]
        // Isolines shorter than spacing (or no spacing) get a single label in their middle
        const single = (spacing <= 0) || (length < spacing)
        for (let distance = (single ? 0.5 * length : 0.5 * spacing); distance < length; distance += (single ? length : spacing)) {
          const center = pointAlong(points, distances, distance)
          const latLng = map.layerPointToLatLng(center)
          if (!view.contains(latLng)) continue
          // Orient the label along the isoline, keeping text upright
          let rotation = angleBetween(pointAlong(points, distances, distance - halfLength), pointAlong(points, distances, distance + halfLength))
          if (rotation > 90) rotation -= 180
          else if (rotation < -90) rotation += 180
          const marker = createMarkerFromPointStyle(latLng, Object.assign({}, labelStyle, {
            interactive: false,
            text: Object.assign({}, labelStyle.text, { rotation })
          }))
          if (marker) this.labels.addLayer(marker)
        }
      }
    })
  },

  getBounds () {
    const bbox = this.gridSource.getBBox()
    const bounds = bbox ? L.latLngBounds(L.latLng(bbox[0], bbox[1]), L.latLng(bbox[2], bbox[3])) : L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180))
    return this._map ? this._map.wrapLatLngBounds(bounds) : bounds
  }
})

export { IsolineLayer }
