import _ from 'lodash'
import logger from 'loglevel'
import { Notify, Loading } from 'quasar'
import explode from '@turf/explode'
import { i18n, api, LocalCache, utils as kCoreUtils } from '../../../core/client/index.js'
import { checkFeatures, createFeatures, removeFeatures } from './utils.features.js'

export const InternalLayerProperties = ['actions', 'label', 'isVisible', 'isDisabled']

export function isInMemoryLayer (layer) {
  return layer._id === undefined
}

export function isUserLayer (layer) {
  return (_.get(layer, 'scope') === 'user')
}

export function isFeatureLayer (layer) {
  return (_.get(layer, 'service') === 'features')
}

export function hasFeatureSchema (layer) {
  return _.has(layer, 'schema')
}

export function isLayerSelectable (layer) {
  return _.get(layer, 'isSelectable', true)
}

export function isLayerProbable (layer) {
  return _.get(layer, 'isProbable', false)
}

export function isLayerStorable (layer) {
  // Only possible when not saved by default
  if (layer._id) return false
  return _.get(layer, 'isStorable', isUserLayer(layer))
}

export function isLayerEditable (layer) {
  // Only possible when saved by default
  if (!layer._id) return false
  return _.get(layer, 'isEditable', isUserLayer(layer))
}

export function isLayerCachable (layer) {
  return _.get(layer, 'isCachable', _.has(layer, 'leaflet.source'))
}

export function isLayerCached (layer) {
  return _.get(layer, 'isCached')
}

export async function setLayerCached (layer, cached) {
  const url = _.get(layer, 'leaflet.source')
  if (cached) {
    await LocalCache.clear('layers', url)
    _.set(layer, 'isCached', false)
  } else {
    await LocalCache.set('layers', url)
    _.set(layer, 'isCached', true)
  }
}

export async function toggleLayerCache (layer) {
  setLayerCached (layer, isLayerCached(layer))
}

export function isLayerRemovable (layer) {
  return _.get(layer, 'isRemovable', isUserLayer(layer))
}

export function isLayerStyleEditable (layer) {
  return _.get(layer, 'isStyleEditable', isUserLayer(layer))
}

export function isLayerDataEditable (layer) {
  return _.get(layer, 'isDataEditable', isUserLayer(layer) && isFeatureLayer(layer))
}

export function isTerrainLayer (layer) {
  if (layer.type === 'TerrainLayer') return true
  const cesiumOptions = layer.cesium || layer
  return (cesiumOptions.type === 'Cesium') || (cesiumOptions.type === 'Ellipsoid')
}

export async function saveGeoJsonLayer (layer, geoJson, chunkSize = 5000) {
  // Check for invalid features first
  const check = checkFeatures(geoJson)
  if (check.kinks.length > 0) {
    const result = await kCoreUtils.dialog({
      title: i18n.t('utils.layers.INVALID_FEATURES_DIALOG_TITLE', { total: check.kinks.length }),
      message: i18n.t('utils.layers.INVALID_FEATURES_DIALOG_MESSAGE', { total: check.kinks.length }),
      options: {
        type: 'toggle',
        model: [],
        items: [
          { label: i18n.t('utils.layers.DOWNLOAD_INVALID_FEATURES_LABEL'), value: 'download' }
        ]
      },
      html: true,
      ok: {
        label: i18n.t('OK'),
        flat: true
      },
      cancel: {
        label: i18n.t('CANCEL'),
        flat: true
      }
    })
    if (!result.ok) return
    // Export invalid features if required
    if (_.get(result, 'data', []).includes('download')) {
      kCoreUtils.downloadAsBlob(JSON.stringify({ type: 'FeatureCollection', features: check.kinks }),
        i18n.t('utils.layers.INVALID_FEATURES_FILE'), 'application/json;charset=utf-8;')
    }
  }
  // Change data source from in-memory to features service
  _.set(layer, 'service', 'features')
  if (_.has(layer, 'leaflet')) _.set(layer, 'leaflet.source', '/api/features')
  if (_.has(layer, 'cesium')) _.set(layer, 'cesium.source', '/api/features')
  const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
  // If too much data use tiling
  // The threshold is based on the number of points and not features.
  // Indeed otherwise the complexity will be different depending on the geometry type
  // (eg a bucket of 1000 polygons can actually contains a lot of points).
  let nbPoints = 0
  features.forEach(feature => {
    nbPoints += explode(feature).features.length
  })
  if (nbPoints > 5000) {
    _.set(layer, 'leaflet.tiled', true)
    _.set(layer, 'leaflet.minZoom', 15)
  }
  Loading.show({ message: i18n.t('utils.layers.SAVING_LABEL', { processed: 0, total: features.length }), html: true })
  let createdLayer
  try {
    createdLayer = await api.getService('catalog')
      .create(_.omit(layer, InternalLayerProperties))
    let nbFeatures = 0
    // We use the generated DB ID as layer ID on features
    await createFeatures(geoJson, createdLayer._id, chunkSize, (i, chunk) => {
      // Update saving message according to new chunk data
      nbFeatures += chunk.length
      Loading.show({
        message: i18n.t('utils.layers.SAVING_LABEL', { processed: nbFeatures, total: features.length }),
        html: true
      })
    })
    // Because we save all features in a single service use filtering to separate layers
    createdLayer = await api.getService('catalog').patch(createdLayer._id, { baseQuery: { layer: createdLayer._id } })
    if (_.get(layer, 'leaflet.tiled')) {
      Notify.create({ type: 'positive', message: i18n.t('utils.layers.SAVE_DIALOG_MESSAGE'), timeout: 10000, html: true })
    }
  } catch (error) {
    // User error message on operation should be raised by error hook, otherwise this is more a coding error
    logger.error(`[KDK] ${error}`)
  }
  Loading.hide()
  return createdLayer
}

export async function saveLayer (layer) {
  await api.getService('catalog').create(_.omit(layer, InternalLayerProperties))
}

export async function removeLayer (layer) {
  const result = await kCoreUtils.dialog({
    title: i18n.t('utils.layers.REMOVE_DIALOG_TITLE', { layer: layer.label || layer.name }),
    message: i18n.t('utils.layers.REMOVE_DIALOG_MESSAGE', { layer: layer.label || layer.name }),
    html: true,
    ok: {
      label: i18n.t('OK'),
      flat: true
    },
    cancel: {
      label: i18n.t('CANCEL'),
      flat: true
    }
  })
  if (!result.ok) return false
  Loading.show({ message: i18n.t('utils.layers.REMOVING_LABEL'), html: true })
  try {
    if (layer._id) {
      // If persistent feature layer remove features as well
      if (isFeatureLayer(layer)) {
        await removeFeatures(layer._id)
      }
      await api.getService('catalog').remove(layer._id)
    }
  } catch (error) {
    // User error message on operation should be raised by error hook, otherwise this is more a coding error
    logger.error(`[KDK] ${error}`)
  }
  Loading.hide()
  return true
}
