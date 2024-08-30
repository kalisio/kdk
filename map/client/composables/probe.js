import _ from 'lodash'
import { unref } from 'vue'
import * as composables from '../../../core/client/composables/index.js'

export function useProbe (name, options = {}) {
  // retrieve activity
  const { kActivity } = composables.useCurrentActivity()
  // Avoid using .value everywhere
  let activity = unref(kActivity)

  // data
  // probes store
  const { store, set, get, has } = composables.useStore(`probes.${name}`)

  // functions
  function setCurrentActivity (newActivity) {
    // Avoid multiple updates
    if (activity === newActivity) return
    // Remove listeners on previous activity and set it on new one
    if (activity && activity.$engineEvents) {
      activity.$engineEvents.off('click', onClicked)
    }
    activity = newActivity
    if (newActivity && newActivity.$engineEvents) {
      newActivity.$engineEvents.on('click', onClicked)
    }
  }
  function clearProbe () {
    set('item', null)
  }
  function setProbe (probe) {
    set('item', probe)
  }
  function isProbing () {
    return activity && activity.isCursor('probe-cursor')
  }
  function hasProbedLayer () {
    return get('item') && get('item').layer
  }
  function getProbedLayer () {
    return get('item').layer
  }
  function hasProbedLocation () {
    return get('item') && get('item').location
  }
  function getProbedLocation () {
    return get('item').location
  }
  function getWidgetForProbe () {
    let widget
    if (hasProbedLocation()) {
      widget = 'time-series'
    }
    return widget
  }
  function centerOnProbe () {
    if (hasProbedLocation()) {
      activity.center(getProbedLocation().lng, getProbedLocation().lat)
    }
  }

  // Default probe handler
  function handleProbe (probe) {
    // Simply set the item
    setProbe(probe)
  }

  let lastClickedPosition
  function onClicked (layer, event) {
    if (!isProbing()) {
      if (get('item')) clearProbe()
      return
    }
    // FIXME: For some layers, eg based on path, we get a first click with the layer as target
    // then a second click with the map as target, we need to filter the later for selection
    const containerPosition = _.get(event, 'containerPoint')
    if (lastClickedPosition && containerPosition.equals(lastClickedPosition)) {
      // Cleanup last click so that if the user click on the same feature again it will work as usual
      lastClickedPosition = null
      return
    }
    lastClickedPosition = containerPosition
    // Retrieve the location
    const location = _.get(event, 'latlng')
    let feature
    // Check the target layer
    if (layer && layer.name) {
      // FIXME: need to retrieve original layer options as here we get processed options by the underlying engine
      layer = activity.getLayerByName(layer.name)
      // Check if probable
      if (layer && activity.isLayerProbable(layer)) {
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
    // Update the probe using custom or built-in handler
    if (options.handler) options.handler({ location, feature, layer })
    else handleProbe({ location, feature, layer })
  }

  function probeAtLocation () {
    activity.setCursor('probe-cursor')
    activity.$engineEvents.once('click', () => {
      // As some other listener might be register on click and want to make use of this state debounce
      setTimeout(() => {
        activity.unsetCursor('probe-cursor')
      }, options.timeout || 500)
    })
  }

  // Initialize on first call
  if (!has('item')) {
    clearProbe()
  }

  // expose
  return {
    setCurrentActivity,
    probe: store,
    clearProbe,
    setProbe,
    hasProbedLayer,
    getProbedLayer,
    hasProbedLocation,
    getProbedLocation,
    probeAtLocation,
    getWidgetForProbe,
    centerOnProbe
  }
}
