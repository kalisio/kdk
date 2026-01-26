import _ from 'lodash'
import config from 'config'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import { uid } from 'quasar'
import { unref, onBeforeMount, onBeforeUnmount } from 'vue'
import { getFeatureId } from '../utils/utils.js'
import * as features from '../utils/utils.features.js' // Named import to avoid conflict with similar function names
import { isLayerHighlightable } from '../utils/utils.layers.js'
import * as composables from '../../../core/client/composables/index.js'

export const HighlightsLayerName = uid()
// This ensure it is on top of everything else
export const HighlightsZIndex = 999
// This ensure highlight encompasses the target feature
export const HighlightMargin = 8

export function useHighlight (name, options = {}) {
  // Data
  let highlightMode = 'highlightable-layers'
  let layerServiceEventListeners = {}
  // Set default options
  options = Object.assign({ updateDelay: 250 }, options)
  // Retrieve activity
  const { kActivity } = composables.useCurrentActivity()
  // Avoid using .value everywhere
  let activity = unref(kActivity)
  // highlight store for context
  const { store, clear, set, get, unset, has } = composables.useStore(`highlights.${name}`)
  // global highlight store
  const { forOwn } = composables.useStore('highlights')

  // Functions
  function setCurrentActivity (newActivity) {
    // Avoid multiple updates
    if (activity === newActivity) return
    // Remove highlights on previous activity and set it on new one
    if (activity) {
      removeHighlightsLayer()
      activity.$engineEvents.off('layer-added', listenToFeaturesServiceEventsForLayer)
      activity.$engineEvents.off('layer-removed', unlistenToFeaturesServiceEventsForLayer)
      activity.$engineEvents.off('layer-added', createHighlightsLayer)
      activity.$engineEvents.off('layer-disabled', onHighlightedLayerDisabled)
      activity.$engineEvents.off('layer-enabled', onHighlightedLayerEnabled)
    }
    activity = newActivity
    if (activity) {
      activity.$engineEvents.on('layer-added', listenToFeaturesServiceEventsForLayer)
      activity.$engineEvents.on('layer-removed', unlistenToFeaturesServiceEventsForLayer)
      // When at least one layer is added we know the catalog has been loaded
      // so that we can add our highlight layer, before that it would be cleared by catalog loading
      activity.$engineEvents.on('layer-added', createHighlightsLayer)
      activity.$engineEvents.on('layer-disabled', onHighlightedLayerDisabled)
      activity.$engineEvents.on('layer-enabled', onHighlightedLayerEnabled)      
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
  function isHighlightFor (highlightId, layer, feature) {
    return feature ? highlightId.includes(`-${getFeatureId(feature, layer)}`) : highlightId.includes(`-${_.kebabCase(layer.name)}`)
  }
  function hasHighlight (feature, layer) {
    return has(getHighlightId(feature, layer))
  }
  function getHighlight (feature, layer) {
    return get(getHighlightId(feature, layer))
  }
  function setHighlightGeometry (feature, highlight) {
    // Assign geometry
    Object.assign(highlight, feature.geometry
      ? { geometry: feature.geometry }
      : { geometry: { type: 'Point', coordinates: [_.get(feature, 'lng', 0), _.get(feature, 'lat', 0)] } }
    )
    // Use bbox for line/polygons
    if (options.asBbox && (highlight.geometry.type !== 'Point')) {
      Object.assign(highlight, bboxPolygon(bbox(highlight)))
    }
    requestHighlightsLayerUpdate()
  }
  function setHighlightMode (mode = 'highlightable-layers') {
    highlightMode = mode
  }
  function highlight (feature, layer, selected = true) {
    if (layer && (highlightMode === 'highlightable-layers') && !isLayerHighlightable(layer)) return
    const highlightId = getHighlightId(feature, layer)
    // Define default highlight feature
    const highlight = {
      highlightId,
      type: 'Feature',
      properties: Object.assign({
        zOrder: 0,
      }, options)
    }
    setHighlightGeometry(feature, highlight)
    // Assign style
    if (selected) {
      // Do not alter config object
      const selectionStylePath = `engines.${activity.engine}.style.selection.${features.getFeatureStyleType(highlight)}`
      let highlightStyle = _.cloneDeep(_.get(config, selectionStylePath, {}))
      if (activity.is2D()) {
        // adapt the size to the marker using feature style
        let radius = _.get(feature, 'style.radius')
        let size = _.get(feature, 'style.size')
        if (size && !Array.isArray(size)) {
          size = [size, size]
        }
        // adapt the size to the marker using layer style
        if (!size && !radius) {
          size = _.get(layer, `${activity.engine}.style.point.size`)
          radius = _.get(layer, `${activity.engine}.style.point.radius`)
          if (size && !Array.isArray(size)) {
            size = [size, size]
          }
        }
        // If highlight size is based on a shape with a radius use it, otherwise go for size
        // FIXME: Take care to templating, in this case for now we don't take it into account
        if (_.isNumber(radius)) Object.assign(highlightStyle, { radius: radius + 0.5 * HighlightMargin }) 
        else if ((size.length > 1) && _.isNumber(size[0]) && _.isNumber(size[1])) Object.assign(highlightStyle, { size: [size[0] + HighlightMargin, size[1] + HighlightMargin] })
      
        Object.assign(highlight, { style: highlightStyle })
      } else {
        // In 3D, keep important style properties from feature, such as "altitudeMode"
        Object.assign(highlight, { style: _.defaults({}, highlightStyle, feature.style) })
      }
    } else {
      // Retrieve feature sytle
      Object.assign(highlight, { style: feature.style })
    }
    // Add additional information provided by feature, if any, for custom styling
    _.merge(highlight, _.omit(feature, ['geometry', 'style']))
    set(highlightId, highlight)
    setHighlightEnabled(feature, layer, layer ? !layer.isDisabled : true)
    return highlight
  }
  function unhighlight (feature, layer) {
    const highlightId = getHighlightId(feature, layer)
    unset(highlightId)
    requestHighlightsLayerUpdate()
  }
  function setHighlightEnabled (feature, layer, enabled = true) {
    const highlight = getHighlight(feature, layer)
    _.set(highlight, 'style.visibility', enabled)
    requestHighlightsLayerUpdate()
  }
  function setHighlightsEnabled (layer, enabled = true) {
    getHighlights(layer).forEach(highlight => setHighlightEnabled(highlight, layer, enabled))
  }
  function clearHighlights () {
    clear()
    requestHighlightsLayerUpdate()
  }
  function getHighlights (layer, feature) {
    // Iterate over all highlights
    let features = []
    // For each highlight store
    forOwn(store => {
      // Retrieve features in highlight store
      _.forOwn(store, (value, key) => {
        if (!layer || (layer && isHighlightFor(key, layer, feature))) {
          features.push(value)
        }
      })
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
          popup: { pick: [] },
          zIndex: HighlightsZIndex,
          interactive: false
        },
        cesium: {
          type: 'geoJson',
          isVisible: true,
          realtime: true,
          cluster: false,
          removeMissing: true,
          popup: { pick: [] }
        }
      })
    }
    if (!activity.isLayerVisible(HighlightsLayerName)) await activity.showLayer(HighlightsLayerName)
  }
  function updateHighlightsLayer () {
    // Get all highlights
    let features = getHighlights()
    // Filter invisible ones
    features = features.filter(feature => !feature.isDisabled)
    // Order from back to front
    features = _.sortBy(features, feature => _.get(feature, 'properties.zOrder'))
    if (activity) {
      activity.updateLayer(HighlightsLayerName, {
        type: 'FeatureCollection',
        features
      }, { replace: true }) // Always start from fresh data as we debounce the update and multiple operations might generate a wrong order otherwise
    }
  }
  // In order to avoid updating the layer too much often we queue a request update every N ms
  const requestHighlightsLayerUpdate = _.debounce(updateHighlightsLayer, options.updateDelay)
   
  function removeHighlightsLayer () {
    // Clear any running update
    if (activity) activity.removeLayer(HighlightsLayerName)
  }
  function onHighlightedLayerDisabled (layer) {
    // Tag all highlights as invisible
    getHighlights(layer).forEach(highlight => {
      setHighlightEnabled(highlight, layer, false)
    })
  }
  function onHighlightedLayerEnabled (layer) {
    // Tag all highlights as visible
    getHighlights(layer).forEach(highlight => {
      setHighlightEnabled(highlight, layer, true)
    })
  }
  function listenToFeaturesServiceEventsForLayer (layer) {
    const listeners = features.listenToFeaturesServiceEventsForLayer(layer, {
      all: onFeatureUpdated, removed: onFeatureRemoved
    }, layerServiceEventListeners[layer._id])
    if (listeners) layerServiceEventListeners[layer._id] = listeners
  }
  function unlistenToFeaturesServiceEventsForLayer (layer) {
    features.unlistenToFeaturesServiceEventsForLayer(layer, layerServiceEventListeners[layer._id])
    delete layerServiceEventListeners[layer._id]
  }
  function listenToFeaturesServiceEventsForLayers () {
    layerServiceEventListeners = {}
    _.forEach(activity.getLayers(), listenToFeaturesServiceEventsForLayer)
  }
  function unlistenToFeaturesServiceEventsForLayers () {
    _.forOwn(layerServiceEventListeners, unlistenToFeaturesServiceEventsForLayer)
    layerServiceEventListeners = {}
  }
  function onFeatureUpdated (feature, layer) {
    // Find related layer, either directly given in feature if coming from user-defined features service
    // otherwise bound to the listener for features services attached to a built-in layer
    if (!layer && feature.layer) layer = activity.getLayerById(feature.layer)
    if (!layer) return
    if (hasHighlight(feature, layer)) setHighlightGeometry(feature, getHighlight(feature, layer))
  }
  function onFeatureRemoved (feature, layer) {
    // Find related layer, either directly given in feature if coming from user-defined features service
    // otherwise bound to the listener for features services attached to a built-in layer
    if (!layer && feature.layer) layer = activity.getLayerById(feature.layer)
    if (!layer) return
    if (hasHighlight(feature, layer)) unhighlight(feature, layer)
  }

  // Hooks
  // Initialize on create
  onBeforeMount(() => {
    listenToFeaturesServiceEventsForLayers()
  })
  // Cleanup on destroy
  onBeforeUnmount(() => {
    unlistenToFeaturesServiceEventsForLayers()
    clearHighlights()
  })

  // Expose
  return {
    setCurrentActivity,
    highlights: store,
    setHighlightMode,
    hasHighlight,
    getHighlight,
    getHighlights,
    highlight,
    unhighlight,
    setHighlightEnabled,
    setHighlightsEnabled,
    clearHighlights
  }
}
