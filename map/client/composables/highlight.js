import _ from 'lodash'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import { uid, getCssVar } from 'quasar'
import { unref, onUnmounted } from 'vue'
import { getFeatureId } from '../utils.js'
import * as composables from '../../../core/client/composables/index.js'

export const HighlightsLayerName = uid()

export function useHighlight (name, options = {}) {
  // Set default options
  options = Object.assign({ updateDelay: 100 }, options)
  // retrieve activity
  const { kActivity } = composables.useCurrentActivity()
  // Avoid using .value everywhere
  let activity = unref(kActivity)

  // data
  // hightligh store for context
  const { store, clear, set, get, unset, has } = composables.useStore(`hightlighs.${name}`)
  // global highlight store
  const { forOwn } = composables.useStore('hightlighs')

  // functions
  function setCurrentActivity (newActivity) {
    // Avoid multiple updates
    if (activity === newActivity) return
    // Remove highlights on previous activity and set it on new one
    if (activity) {
      removeHighlightsLayer()
      activity.$engineEvents.off('layer-added', createHighlightsLayer)
      activity.$engineEvents.off('layer-disabled', onHighlightedLayerDisabled)
      activity.$engineEvents.off('layer-enabled', onHighlightedLayerEnabled)
    }
    activity = newActivity
    if (newActivity) {
      // When at least one layer is added we know the catalog has been loaded
      // so that we can add our highlight layer, before that it would be cleared by catalog loading
      newActivity.$engineEvents.on('layer-added', createHighlightsLayer)
      newActivity.$engineEvents.on('layer-disabled', onHighlightedLayerDisabled)
      newActivity.$engineEvents.on('layer-enabled', onHighlightedLayerEnabled)
    }
  }
  function getHighlightId (feature, layer) {
    // We might have the same feature highlighted different times with a different
    // highlight style so that we need to generate a unique but stable ID
    let id = `${name}`
    if (layer) id += `-${_.kebabCase(layer.name)}`
    if (feature) {
      const featureId = getFeatureId(feature, layer)
      if (featureId) id += `-${featureId}`
    }
    return id
  }
  function hasHighlight (feature, layer) {
    return has(getHighlightId(feature, layer))
  }
  function getHighlight (feature, layer) {
    return get(getHighlightId(feature, layer))
  }
  function convertColors (highlight) {
    // Convert from quasar color palette to actual color
    _.forOwn(highlight.properties, (value, key) => {
      if (key.endsWith('-color')) {
        const color = getCssVar(value)
        if (color) _.set(highlight, `properties.${key}`, color)
      }
    })
  }
  function highlight (feature, layer) {
    const highlightId = getHighlightId(feature, layer)
    // Default highlight feature with styling
    const highlight = {
      highlightId,
      type: 'Feature',
      isDisabled: (layer ? layer.isDisabled : false),
      properties: Object.assign({
        'marker-type': 'circleMarker',
        geodesic: !activity.is2D(), // In 3D we use a circle on ground
        radius: activity.is2D() ? 10 : 1000,
        'stroke-color': getCssVar('secondary'),
        'stroke-width': 3,
        'fill-color': getCssVar('secondary'),
        'fill-opacity': 0.5,
        zOrder: 0
      }, options)
    }
    // Use input feature/location to build highlight geometry
    Object.assign(highlight, feature.geometry
      ? { geometry: feature.geometry }
      : {
          geometry: { type: 'Point', coordinates: [_.get(feature, 'lng', 0), _.get(feature, 'lat', 0)] }
        })
    // Use bbox for line/polygons
    if (options.asBbox && (highlight.geometry.type !== 'Point')) {
      Object.assign(highlight, bboxPolygon(bbox(highlight)))
    }
    // Add additional information provided by feature, if any, for custom styling
    _.merge(highlight, _.omit(feature, ['geometry']))
    convertColors(highlight)
    set(highlightId, highlight)
    updateHighlightsLayer()
    return highlight
  }
  function unhighlight (feature, layer) {
    const highlightId = getHighlightId(feature, layer)
    unset(highlightId)
    updateHighlightsLayer()
  }
  function clearHighlights () {
    clear()
    updateHighlightsLayer()
  }
  function getHighlightedFeatures () {
    // Iterate over all highlights
    let features = []
    // For each highlight store
    forOwn((store, key) => {
      // Retrieve features in highlight store
      features = features.concat(_.flatten(_.values(store)))
    })
    return features
  }
  async function createHighlightsLayer () {
    // Get any previous layer or create it the first time
    const layer = activity.getLayerByName(HighlightsLayerName)
    if (!layer) {
      await activity.addLayer({
        name: HighlightsLayerName,
        type: 'OverlayLayer',
        scope: 'system',
        isSelectable: false,
        featureId: 'highlightId',
        leaflet: {
          type: 'geoJson',
          isVisible: true,
          realtime: true,
          interactive: false,
          cluster: false,
          removeMissing: true,
          popup: { pick: [] }
        },
        cesium: {
          type: 'geoJson',
          isVisible: true,
          realtime: true,
          cluster: false,
          popup: { pick: [] }
        }
      })
    }
    if (!activity.isLayerVisible(HighlightsLayerName)) await activity.showLayer(HighlightsLayerName)
  }
  let updateRequested
  function updateHighlightsLayer () {
    // In order to avoid updating the layer too much often we queue a request update every N ms
    if (updateRequested) return
    updateRequested = setTimeout(() => {
      // Get all highlights
      let features = getHighlightedFeatures()
      // Filter invisible ones
      features = features.filter(feature => !feature.isDisabled)
      // Order from back to front
      features = _.sortBy(features, feature => _.get(feature, 'properties.zOrder'))
      if (activity) {
        activity.updateLayer(HighlightsLayerName, {
          type: 'FeatureCollection',
          features
        })
      }
      updateRequested = false
    }, options.updateDelay)
  }
  function removeHighlightsLayer () {
    // Clear any running update
    if (updateRequested) clearTimeout(updateRequested)
    if (activity) activity.removeLayer(HighlightsLayerName)
  }
  function onHighlightedLayerDisabled (layer) {
    // Get all highlights
    const features = getHighlightedFeatures()
    // Tag layer' features as invisible
    features.forEach(feature => {
      const suffix = `-${_.kebabCase(layer.name)}-${getFeatureId(feature, layer)}`
      if (feature.highlightId.endsWith(suffix)) feature.isDisabled = true
    })
    updateHighlightsLayer()
  }
  function onHighlightedLayerEnabled (layer) {
    // Get all highlights
    const features = getHighlightedFeatures()
    // Tag layer' features as visible
    features.forEach(feature => {
      const suffix = `-${_.kebabCase(layer.name)}-${getFeatureId(feature, layer)}`
      if (feature.highlightId.endsWith(suffix)) feature.isDisabled = false
    })
    updateHighlightsLayer()
  }

  // Cleanup on destroy
  onUnmounted(() => {
    clearHighlights()
  })

  // expose
  return {
    setCurrentActivity,
    highlights: store,
    hasHighlight,
    getHighlight,
    highlight,
    unhighlight,
    clearHighlights
  }
}
