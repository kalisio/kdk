import _ from 'lodash'
import logger from 'loglevel'
import { Notify, Loading, uid } from 'quasar'
import explode from '@turf/explode'
import SphericalMercator from '@mapbox/sphericalmercator'
import { i18n, api, LocalCache, utils as kCoreUtils, hooks as kCoreHooks } from '../../../core/client/index.js'
import { checkFeatures, createFeatures, removeFeatures } from './utils.features.js'
import { PMTiles, findTile, zxyToTileId } from 'pmtiles'
import { sourcesToViews } from 'protomaps-leaflet'
import * as kMapHooks from '../hooks/index.js'
import { generatePropertiesSchema } from '../utils.map.js'

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

export function isLayerHighlightable (layer) {
  return _.get(layer, 'isHighlightable', true)
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
  return _.get(layer, 'isCachable', (layer.type === 'BaseLayer') || _.has(layer, 'service') ||
    (_.get(layer, 'leaflet.type') === 'pmtiles') || (_.get(layer, 'leaflet.type') === 'geoJson'))
}

export async function isLayerCached (layer) {
  const isCached = await LocalCache.has(_.get(layer, 'leaflet.source'))
  return isCached
}

export async function setLayerCached (layer, options) {
  if (!isLayerCachable(layer)) return
  if (layer.type === 'BaseLayer') {
    await setBaseLayerCached(layer, options)
  } else if (layer.service) {
    await setServiceLayerCached(layer, options)
  } else if (_.get(layer, 'leaflet.type') === 'geoJson') {
    await setGeojsonLayerCached (layer)
  } else if (_.get(layer, 'leaflet.type') === 'pmtiles') {
    await setPMTilesLayerCached(layer, options)
  }
}

async function cacheLayerTile(urlTemplate, x, y, z) {
  const url = urlTemplate.replace('{z}', z).replace('{x}', x).replace('{y}', y)
  const key = new URL(url)
  key.searchParams.delete('jwt')
  await LocalCache.set('layers', key.href, url)
}

export async function setBaseLayerCached (layer, options) {
  const bounds = options.bounds
  const minZoom = options.minZoom || 3
  const maxZoom = options.maxZoom || _.get(layer, 'leaflet.maxNativeZoom')
  const nbConcurrentRequests = options.nbConcurrentRequests || 10

  const urlTemplate = _.get(layer, 'leaflet.source')
  let promises = []
  for (let z = minZoom; z <= maxZoom; z++) {
    let sm =  new SphericalMercator()
    let tilesBounds = sm.xyz([bounds[0][1], bounds[0][0], bounds[1][1], bounds[1][0]], z, _.get(layer, 'leaflet.tms'))
    for (let y = tilesBounds.minY; y <= tilesBounds.maxY; y++) {
      for (let x = tilesBounds.minX; x <= tilesBounds.maxX; x++) {
        promises.push(cacheLayerTile(urlTemplate, x, y, z))
        if (promises.length === nbConcurrentRequests) {
          await Promise.all(promises)
          promises = []
        }
      }
    }
  }
  // Always download top-level image or icon as we use it as thumbnail
  promises.push(cacheLayerTile(urlTemplate, 0, 0, 0))
  if (layer.iconUrl) promises.push(cacheLayerTile(layer.iconUrl))
  await Promise.all(promises)
}

async function setServiceLayerCached (layer, options) {
  const offlineService = await api.createOfflineFeaturesService(layer.service, {
    baseQuery: {
      south: options.bounds[0][0],
      north: options.bounds[1][0],
      west: options.bounds[0][1],
      east: options.bounds[1][1]
    },
    clear: false
  })
}

export async function setGeojsonLayerCached (layer) {
  const url = _.get(layer, 'leaflet.source')
  let key = new URL(url)
  key.searchParams.delete('jwt')
  await LocalCache.set('layers', key.href, url)
}

async function getPMTileRange(pmtiles, x, y, z, directoryRanges) {
  const tileId = zxyToTileId(z, x, y)
  const header = await pmtiles.getHeader()
  let dO = header.rootDirectoryOffset
  let dL = header.rootDirectoryLength
  for (let depth = 0; depth <= 3; depth++) {
    directoryRanges.add(`${dO}-${dO + dL - 1}`)
    const directory = await pmtiles.cache.getDirectory(pmtiles.source, dO, dL, header)
    const entry = findTile(directory, tileId)
    if (entry) {
      if (entry.runLength > 0) {
        return {
          start: header.tileDataOffset + entry.offset,
          end: header.tileDataOffset + entry.offset + entry.length - 1
        }
      }
      dO = header.leafDirectoryOffset + entry.offset
      dL = entry.length
    } else {
      return
    }
  }
}

async function cacheLayerPMTile(url, pmtiles, x, y, z, directoryRanges) {
  const key = new URL(url)
  key.searchParams.delete('jwt')
  const data = await pmtiles.getZxy(z, x, y)
  if (!data) return
  // Need to take range request into account
  const range = await getPMTileRange(pmtiles, x, y, z, directoryRanges)
  // Actually we can simply store the base URL suffixed by tile to know what has been downloaded
  await LocalCache.set('layers', `${key.href}/${range.start}/${range.end}`, url, { headers: { Range: `bytes=${range.start}-${range.end}`} })
}

async function cachePMTilesHeaderAndDirectory(url, pmtiles, directory) {
  const key = new URL(url)
  key.searchParams.delete('jwt')
  // First cache header
  await LocalCache.set('layers', `${key.href}/0/16383`, url, { headers: { Range: `bytes=0-16383`} })
  // Always download directory as well as used by the underlying library
  directory = Array.from(directory)
  for (let i = 0; i < directory.length; i++) {
    const entry = directory[i]
    await LocalCache.set('layers', `${key.href}/${entry.replace('-', '/')}`, url, { headers: { Range: `bytes=${entry}`} })
  }
}

export async function setPMTilesLayerCached (layer, options) {
  const bounds = options.bounds
  const minZoom = options.minZoom || 3
  const maxZoom = options.maxZoom || _.get(layer, 'leaflet.maxDataZoom')
  const nbConcurrentRequests = options.nbConcurrentRequests || 10

  const url = _.get(layer, 'leaflet.url')
  const pmtiles = new PMTiles(url)
  const directory = new Set()
  const views = sourcesToViews(layer.leaflet)
  let promises = []
  for (let z = minZoom; z <= maxZoom; z++) {
    let sm =  new SphericalMercator()
    let tilesBounds = sm.xyz([bounds[0][1], bounds[0][0], bounds[1][1], bounds[1][0]], z, _.get(layer, 'leaflet.tms'))
    for (let y = tilesBounds.minY; y <= tilesBounds.maxY; y++) {
      for (let x = tilesBounds.minX; x <= tilesBounds.maxX; x++) {
        for (const [k, v] of views) {
          const dt = v.dataTileForDisplayTile({ x, y, z })
          promises.push(cacheLayerPMTile(url, pmtiles, dt.dataTile.x, dt.dataTile.y, dt.dataTile.z, directory))
          if (promises.length === nbConcurrentRequests) {
            await Promise.all(promises)
            promises = []
          }
        }
      }
    }
  }
  // Always download header/directory as used by the underlying library
  await cachePMTilesHeaderAndDirectory(url, pmtiles, directory)
  await Promise.all(promises)
}

export async function setLayerUncached (layer, options) {
  if (!isLayerCachable(layer)) return
  if (layer.type === 'BaseLayer') {
    await setBaseLayerUncached(layer, options)
  } else if (layer.service) {
    await setServiceLayerUncached(layer, options)
  } else if (_.get(layer, 'leaflet.type') === 'geoJson') {
    await setGeojsonLayerUncached (layer)
  } else if (_.get(layer, 'leaflet.type') === 'pmtiles') {
    await setPMTilesLayerUncached(layer, options)
  }
}

async function uncacheLayerTile(urlTemplate, x, y, z) {
  const url = urlTemplate.replace('{z}', z).replace('{x}', x).replace('{y}', y)
  const key = new URL(url)
  key.searchParams.delete('jwt')
  await LocalCache.unset('layers', key.href)
}

async function setBaseLayerUncached (layer, options) {
  const bounds = options.bounds
  const minZoom = options.minZoom || 3
  const maxZoom = options.maxZoom || _.get(layer, 'leaflet.maxNativeZoom')

  const urlTemplate = _.get(layer, 'leaflet.source')
  for (let z = minZoom; z <= maxZoom; z++) {
    let sm =  new SphericalMercator()
    let tilesBounds = sm.xyz([bounds[0][1], bounds[0][0], bounds[1][1], bounds[1][0]], z, _.get(layer, 'leaflet.tms'))
    for (let y = tilesBounds.minY; y <= tilesBounds.maxY; y++) {
      for (let x = tilesBounds.minX; x <= tilesBounds.maxX; x++) {
        await uncacheLayerTile(urlTemplate, x, y, z)
      }
    }
  }
  // Always remove top-level image or icon as we use it as thumbnail
  await uncacheLayerTile(urlTemplate, 0, 0, 0)
  if (layer.iconUrl) promises.push(uncacheLayerTile(layer.iconUrl))
}

async function setServiceLayerUncached (layer, options) {
  const services = await LocalCache.getItem('services') || {}
  const serviceOptions = services[layer.service]
  if (serviceOptions) {
    const offlineService = api.getOfflineService(layer.service, serviceOptions.context)
    await offlineService.remove(null, {
      query: {
        south: options.bounds[0][0],
        north: options.bounds[1][0],
        west: options.bounds[0][1],
        east: options.bounds[1][1]
      }
    })
  }
}

async function setGeojsonLayerUncached (layer) {
  const url = _.get(layer, 'leaflet.source')
  let key = new URL(url)
  key.searchParams.delete('jwt')
  await LocalCache.unset('layers', key.href)
}

async function uncacheLayerPMTile(url, pmtiles, x, y, z, directoryRanges) {
  const key = new URL(url)
  key.searchParams.delete('jwt')
  const data = await pmtiles.getZxy(z, x, y)
  if (!data) return
  // Need to take range request into account
  const range = await getPMTileRange(pmtiles, x, y, z, directoryRanges)
  await LocalCache.unset('layers', `${key.href}/${range.start}/${range.end}`)
}

async function uncachePMTilesHeaderAndDirectory(url, pmtiles, directory) {
  const key = new URL(url)
  key.searchParams.delete('jwt')
  // First cache header
  await LocalCache.unset('layers', `${key.href}/0/16383`)
  // Always download directory as well as used by the underlying library
  directory = Array.from(directory)
  for (let i = 0; i < directory.length; i++) {
    const entry = directory[i]
    await LocalCache.unset('layers', `${key.href}/${entry.replace('-', '/')}`)
  }
}

async function setPMTilesLayerUncached (layer, options) {
  const bounds = options.bounds
  const minZoom = options.minZoom || 3
  const maxZoom = options.maxZoom || _.get(layer, 'leaflet.maxDataZoom')

  const url = _.get(layer, 'leaflet.url')
  const pmtiles = new PMTiles(url)
  const directory = new Set()
  const views = sourcesToViews(layer.leaflet)
  for (let z = minZoom; z <= maxZoom; z++) {
    let sm =  new SphericalMercator()
    let tilesBounds = sm.xyz([bounds[0][1], bounds[0][0], bounds[1][1], bounds[1][0]], z, _.get(layer, 'leaflet.tms'))
    for (let y = tilesBounds.minY; y <= tilesBounds.maxY; y++) {
      for (let x = tilesBounds.minX; x <= tilesBounds.maxX; x++) {
        for (const [k, v] of views) {
          const dt = v.dataTileForDisplayTile({ x, y, z })
          await uncacheLayerPMTile(url, pmtiles, dt.dataTile.x, dt.dataTile.y, dt.dataTile.z, directory)
        }
      }
    }
  }
  // Always remove header/directory as used by the underlying library
  await uncachePMTilesHeaderAndDirectory(url, pmtiles, directory)
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

export function isMeasureLayer (layer) {
  return layer.variables && layer.service
}

export function generateLayerDefinition(layerSpec, geoJson){
  // Check wether the geoJson content is a valid geoJson
  if (geoJson.type !== 'FeatureCollection' && geoJson.type !== 'Feature') {
    logger.error('invalid geoJson content')
    return
  }
  const engine = {
    type: 'geoJson',
    isVisible: true,
    realtime: true
  }
  const defaultLayer = {
    type: 'OverlayLayer',
    scope: 'user',
    isDataEditable: true,
    leaflet: engine,
    // Avoid sharing reference to the same object although options are similar
    // otherwise updating one will automatically update the other one
    cesium: Object.assign({}, engine)
  }
  _.defaults(layerSpec, defaultLayer)
  if (!layerSpec.schema) {
    const schema = generatePropertiesSchema(geoJson, layerSpec.name)
    layerSpec.schema = { name: layerSpec.name, content: schema }
  }
  if (!layerSpec.featureId) {
    if (geoJson.type === 'FeatureCollection') _.forEach(geoJson.features, feature => { feature._id = uid().toString() })
    else geoJson._id = uid().toString()
  }
  // Check for panes to be created
  const panes = []
  _.forEach(geoJson.features, feature => {
    const pane = _.get(feature, 'style.pane')
    if (pane) {
      panes.push({
        name: pane
      })
    }
  })
  if (!_.isEmpty(panes)) _.set(layerSpec, 'leaflet.panes', panes)

  return true
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
    await createFeatures(geoJson, createdLayer, chunkSize, (i, chunk) => {
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
  layer = await api.getService('catalog').create(_.omit(layer, InternalLayerProperties))
  return layer
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
        await removeFeatures(null, layer)
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
