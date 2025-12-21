import _ from 'lodash'
import config from 'config'
import L from 'leaflet'
import sift from 'sift'
import centroid from '@turf/centroid'
import circle from '@turf/circle'
import bboxPolygon from '@turf/bbox-polygon'
import intersects from '@turf/boolean-intersects'
import { featureEach } from '@turf/meta'
import { unref } from 'vue'
import * as composables from '../../../core/client/composables/index.js'
import { getFeatureId } from '../utils/utils.js'
import * as features from '../utils/utils.features.js' // Named import to avoid conflict with similar function names
import { convertPolygonStyleToLeafletPath } from '../leaflet/utils/index.js'

export function useSelection (name, options = {}) {
  // Data
  let layerServiceEventListeners = {}
  // Retrieve core selection
  const selection = composables.useSelection(name, options)
  // Selection store, as we store options inside check if already initialized
  const { get, has, set } = composables.useStore(`selections.${name}`)

  // Set default options
  options = get('options', Object.assign({
    // Specific selection item comparator
    matches: (item1) => (item2) => {
      const layer1 = _.get(item1, 'layer.name')
      const layer2 = _.get(item2, 'layer.name')
      if (layer1 && layer2) {
        // If both come from a layer compare layers first
        if (layer1 !== layer2) return false
        // Then compare features
        if (item1.feature && item2.feature) {
          const id1 = getFeatureId(item1.feature, item1.layer)
          const id2 = getFeatureId(item2.feature, item2.layer)
          return id1 === id2
        } else {
          // If only one has a feature then it cannot be the same
          return false
        }
      } else {
        // If only one comes from a layer then it cannot be the same
        if (layer1 || layer2) return false
        // Otherwise it could be a similar position only selection
        const location1 = _.get(item1, 'location')
        const location2 = _.get(item2, 'location')
        return (location1.lat === location2.lat) && (location1.lon === location2.lon)
      }
    },
    // Multiple selection key
    multiple: 'ctrlKey',
    // Buffer selection width (10px)
    buffer: 10,
    showBuffer: false,
    showBufferDelay: 250,
    boxSelection: true,
    clusterSelection: false
  }, options))
  // Track options in store if not already done
  if (!has('options')) set('options', options)
  // Retrieve activity
  const { kActivity } = composables.useCurrentActivity()
  // Avoid using .value everywhere
  let activity = unref(kActivity)

  // Functions
  function setCurrentActivity (newActivity) {
    // Avoid multiple updates
    if (activity === newActivity) return
    // Remove listeners on previous activity and set it on new one
    if (activity && activity.$engineEvents) {
      unlistenToFeaturesServiceEventsForLayers()
      selection.setSelectionEnabled()
      selection.clearSelection()
      activity.$engineEvents.off('click', onClicked)
      if (options.boxSelection) activity.$engineEvents.off('boxselectionend', onBoxSelection)
      if (options.clusterSelection) activity.$engineEvents.off('spiderfied', onClusterSelection)
      activity.$engineEvents.off('layer-added', listenToFeaturesServiceEventsForLayer)
      activity.$engineEvents.off('layer-removed', unlistenToFeaturesServiceEventsForLayer)
      activity.$engineEvents.off('layer-hidden', onSelectedLayerHidden)
    }
    activity = newActivity
    if (activity && activity.$engineEvents) {
      listenToFeaturesServiceEventsForLayers()
      activity.$engineEvents.on('click', onClicked)
      if (options.boxSelection) activity.$engineEvents.on('boxselectionend', onBoxSelection)
      if (options.clusterSelection) activity.$engineEvents.on('spiderfied', onClusterSelection)
      activity.$engineEvents.on('layer-added', listenToFeaturesServiceEventsForLayer)
      activity.$engineEvents.on('layer-removed', unlistenToFeaturesServiceEventsForLayer)
      activity.$engineEvents.on('layer-hidden', onSelectedLayerHidden)
    }
  }
  function setBoxSelectionEnabled (enabled) {
    if (options.boxSelection === enabled) return
    options.boxSelection = enabled
    if (!activity) return
    if (enabled) {
      activity.$engineEvents.on('boxselectionend', onBoxSelection)
      activity.map.boxSelection.enable()
    } else {
      activity.$engineEvents.off('boxselectionend', onBoxSelection)
      activity.map.boxSelection.disable()
    }
  }
  function setClusterSelectionEnabled (enabled) {
    if (options.clusterSelection === enabled) return
    options.clusterSelection = enabled
    if (!activity) return
    if (enabled) {
      activity.$engineEvents.on('spiderfied', onClusterSelection)
    } else {
      activity.$engineEvents.off('spiderfied', onClusterSelection)
    }
  }
  function setBufferWidth (width) {
    options.buffer = width
  }
  // Single selection will rely on the lastly selected item only
  function hasSelectedFeature () {
    return selection.hasSelectedItem() && selection.getSelectedItem().feature
  }
  function getSelectedFeature () {
    return selection.getSelectedItem().feature
  }
  function getSelectedFeatures () {
    return selection.getSelectedItems().filter(item => item.feature).map(item => item.feature)
  }
  function getSelectedFeatureCollection () {
    return { type: 'FeatureCollection', features: selection.getSelectedItems().filter(item => item.feature).map(item => item.feature) }
  }
  function getSelectedFeaturesByLayer () {
    const featuresByLayer = {}
    const items = selection.getSelectedItems().filter(item => item.feature && item.layer)
    items.forEach(item => {
      const key = item.layer._id || item.layer.name
      if (!featuresByLayer[key]) featuresByLayer[key] = { layer: item.layer, features: [] }
      featuresByLayer[key].features.push(item.feature)
    })
    return _.values(featuresByLayer)
  }
  function hasSelectedLayer () {
    return selection.hasSelectedItem() && selection.getSelectedItem().layer
  }
  function getSelectedLayer () {
    return selection.getSelectedItem().layer
  }
  function getSelectedLayers () {
    return selection.getSelectedItem().filter(item => item.layer).map(item => item.layer)
  }
  function hasSelectedLocation () {
    return selection.hasSelectedItem() && selection.getSelectedItem().location
  }
  function getSelectedLocation () {
    return selection.getSelectedItem().location
  }
  function findSelectedFeature (feature, layer) {
    const items = selection.getSelectedItems()
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.feature && item.layer && (item.layer.name === layer.name)) {
        const selectedId = getFeatureId(item.feature, item.layer)
        const featureId = getFeatureId(feature, layer)
        if (featureId === selectedId) return item
      }
    }
    return null
  }
  function isFeatureSelected (feature, layer) {
    return findSelectedFeature(feature, layer) !== null
  }
  function getWidgetForSelection () {
    let widget
    if (hasSelectedLayer()) {
      const layer = getSelectedLayer()
      widget = _.get(layer, 'widget')
      if (widget) {
        if (typeof widget !== 'string') {
          // expect an object with at least a 'type' property
          widget = _.get(widget, 'type', 'information-box')
        }
      } else {
        // fallback to old widget selection logic
        if (_.has(layer, 'probe') || // Static probe on pre-defined sites
            _.has(layer, 'variables')) { // Measurement history
          widget = 'time-series'
        } else if (_.get(layer, 'leaflet.type') === 'mapillary') {
          widget = 'mapillary-viewer'
        } else {
          widget = 'information-box'
        }
      }
    }
    return widget
  }
  function centerOnSelection () {
    if (hasSelectedFeature()) {
      activity.center(..._.get(centroid(getSelectedFeature()), 'geometry.coordinates'))
    } else if (hasSelectedLocation()) {
      activity.center(getSelectedLocation().lng, getSelectedLocation().lat)
    }
  }

  // Default selection handler
  function handleSelection (items, clearSelection) {
    // Ensure we always work on array
    if (!Array.isArray(items)) items = [items]
    const selectedItems = []
    const unselectedItems = []
    items.forEach(item => {
      const { location, feature, layer } = item
      if (feature && layer) {
        // If clicked on the same object unselect otherwise select new one
        if (isFeatureSelected(feature, layer)) {
          unselectedItems.push(item)
        } else {
          selectedItems.push(item)
        }
      } else if (location && layer) {
        // Select location on a layer
        selectedItems.push(item)
      }
    })
    // Clear before selecting new items if required
    // or when clicking somewhere on the map, ie nothign get selected/unselected
    if (clearSelection || (_.isEmpty(selectedItems) && _.isEmpty(unselectedItems))) selection.clearSelection()
    // Then update selection
    unselectedItems.forEach(item => selection.unselectItem(item))
    selectedItems.forEach(item => selection.selectItem(item))
  }

  function getIntersectedItems (polygon) {
    const items = []
    // Retrieve GeoJson layers to perform intersection with polygon
    const layers = _.values(activity.layers).filter(sift({
      scope: { $ne: 'system' },
      'leaflet.type': 'geoJson',
      isVisible: true
    }))
    layers.forEach(layer => {
      if (!activity.isLayerSelectable(layer)) return
      // Retrieve the features of the layer
      const geoJson = activity.toGeoJson(layer.name)
      // Then intersect with bounds
      featureEach(geoJson, (feature) => {
        if (intersects(feature, polygon)) {
          const location = centroid(feature)
          const lng = _.get(location, 'geometry.coordinates[0]')
          const lat = _.get(location, 'geometry.coordinates[1]')
          items.push({ feature, layer, location: { lng, lat } })
        }
      })
    })
    return items
  }

  let lastClickedPosition, lastBoxSelectionPosition
  function onClicked (layer, event) {
    if (!selection.isSelectionEnabled()) return

    // FIXME: For some layers, eg based on path, we get a first click with the layer as target
    // then a second click with the map as target, we need to filter the later for selection
    // Similarly we get a click when performing a box selection
    const containerPosition = _.get(event, 'containerPoint')
    if (lastClickedPosition && containerPosition.equals(lastClickedPosition)) {
      // Cleanup last click so that if the user click on the same feature again it will work as usual
      lastClickedPosition = null
      return
    }
    if (lastBoxSelectionPosition && containerPosition.equals(lastBoxSelectionPosition)) {
      // Cleanup last box selection so that if the user select the same zone again it will work as usual
      lastBoxSelectionPosition = null
      return
    }
    lastClickedPosition = containerPosition
    // Check if the multiple selection modifier is active, eg ctrlKey, in order to add/remove to/from current selection,
    // otherwise we should clear the current selection to start a new one
    const multiple = (options.multiple ? _.get(event, `originalEvent.${options.multiple}`) : false)
    let items
    // Retrieve the location
    const location = _.get(event, 'latlng')
    if (selection.getSelectionMode() === 'buffer') {
      if (activity.is2D() && options.showBuffer) {
        const highlightStyle = _.get(config, `engines.${activity.engine}.style.selection.polygon`, {})
        const marker = L.circleMarker(location, Object.assign({ radius: options.buffer }, convertPolygonStyleToLeafletPath(highlightStyle))).addTo(activity.map)
        setTimeout(() => marker.removeFrom(activity.map), options.showBufferDelay)
      }
      const center = activity.getCenter()
      // https://wiki.openstreetmap.org/wiki/Zoom_levels
      const metresPerPixel = 40075016.686 * Math.abs(Math.cos(location.lat * Math.PI / 180)) / Math.pow(2, center.zoomLevel + 8)
      items = getIntersectedItems(circle([location.lng, location.lat], options.buffer * metresPerPixel, { steps: 100, units: 'meters' }))
    } else {
      // Retrieve the feature
      let feature
      // Check the target layer
      if (layer && layer.name) {
        // FIXME: need to retrieve original layer options as here we get processed options by the underlying engine
        layer = activity.getLayerByName(layer.name)
        // Check if selectable
        if (layer && activity.isLayerSelectable(layer)) {
          // Retrieve the feature and manage 2D/3D entity
          feature = _.get(event, 'target.feature')
        } else {
          // Otherwise this is a position selection only
          layer = undefined
        }
      } else {
        // Otherwise this is a position selection only
        layer = undefined
      }
      items = [{ location, feature, layer }]
    }

    // Clear selection in single selection mode, otherwise clear only if not using a multiple selection modifier
    const clearSelection = selection.isSingleSelectionMode() || !multiple
    // Update the selection using custom or built-in handler
    if (options.handler) options.handler(items, clearSelection)
    else handleSelection(items, clearSelection)
  }
  function onBoxSelection (map, event) {
    if (!selection.isSelectionEnabled()) return

    lastBoxSelectionPosition = _.get(event, 'containerPoint')
    const { bounds } = event
    let items = getIntersectedItems(bboxPolygon([
      bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()
    ]))
    // FIXME: in single selection mode we simply keep the last selected item
    // but we might disable box selection instead, harder as it is managed by a Leaflet handler
    if (!_.isEmpty(items) && selection.isSingleSelectionMode()) items = _.last(items)
    // Update the selection using custom or built-in handler
    // Always start a new selection in this case
    if (options.handler) options.handler(items, true)
    else handleSelection(items, true)
  }
  function onClusterSelection (layer, event) {
    if (!selection.isSelectionEnabled()) return

    // Not relevent in this case
    if (selection.isSingleSelectionMode()) return
    const items = _.get(event, 'markers', []).map(marker => {
      const feature = marker.feature
      const location = centroid(feature)
      const lng = _.get(location, 'geometry.coordinates[0]')
      const lat = _.get(location, 'geometry.coordinates[1]')
      return { feature, layer, location: { lng, lat } }
    })
    // Update the selection using custom or built-in handler
    // Always start a new selection in this case
    if (options.handler) options.handler(items, true)
    else handleSelection(items, true)
  }

  function onSelectedLayerHidden (layer) {
    const hiddenFeatures = selection.getSelectedItems().filter(item => layer.name === _.get(item, 'layer.name'))
    hiddenFeatures.forEach((item) => selection.unselectItem(item))
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
    const item = findSelectedFeature(feature, layer)
    if (item) Object.assign(item.feature, feature)
  }
  function onFeatureRemoved (feature, layer) {
    // Find related layer, either directly given in feature if coming from user-defined features service
    // otherwise bound to the listener for features services attached to a built-in layer
    if (!layer && feature.layer) layer = activity.getLayerById(feature.layer)
    if (!layer) return
    const item = findSelectedFeature(feature, layer)
    if (item) selection.unselectItem(item)
  }

  // Expose
  return {
    ...selection,
    getSelectionOptions: () => get('options'),
    setCurrentActivity,
    hasSelectedFeature,
    getSelectedFeature,
    getSelectedFeatures,
    getSelectedFeatureCollection,
    getSelectedFeaturesByLayer,
    hasSelectedLayer,
    getSelectedLayer,
    getSelectedLayers,
    hasSelectedLocation,
    getSelectedLocation,
    getWidgetForSelection,
    centerOnSelection,
    setBoxSelectionEnabled,
    setClusterSelectionEnabled,
    setBufferWidth
  }
}
