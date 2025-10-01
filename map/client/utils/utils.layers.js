import _ from 'lodash'
import logger from 'loglevel'
import { Notify, Loading, uid } from 'quasar'
import explode from '@turf/explode'
import SphericalMercator from '@mapbox/sphericalmercator'
import { i18n, api, LocalCache, utils as kCoreUtils, hooks as kCoreHooks } from '../../../core/client/index.js'
import { cleanFeatures, createFeatures, removeFeatures } from './utils.features.js'
import { PMTiles, findTile, zxyToTileId } from 'pmtiles'
import { sourcesToViews } from 'protomaps-leaflet'
import * as kMapHooks from '../hooks/index.js'
import { generatePropertiesSchema, getGeoJsonFeatures } from '../utils.map.js'
import { generateStyleTemplates, filterQueryToConditions, getDefaultStyleFromTemplates, DefaultStyle, getStyleType } from './utils.style.js'

const InternalLayerProperties = ['actions', 'label', 'isVisible', 'isDisabled']

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
  if (layer.iconUrl) await uncacheLayerTile(layer.iconUrl)
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

export function isLayerFilterEditable (layer) {
  return _.get(layer, 'isFilterEditable', isUserLayer(layer) && isFeatureLayer(layer))
}

export function isTerrainLayer (layer) {
  if (layer.type === 'TerrainLayer') return true
  const cesiumOptions = layer.cesium || layer
  return (cesiumOptions.type === 'Cesium') || (cesiumOptions.type === 'Ellipsoid')
}

export function isMeasureLayer (layer) {
  return layer.variables && layer.service
}

async function parseFiltersFromLayer (layer) {
  const filters = _.get(layer, 'filters', [])
  if (!filters.length) return []
  const styleService = api.getService('styles')
  const styles = []
  for (const filter of filters) {
    if (!filter.style) continue
    styles.push({
      conditions: filterQueryToConditions(filter.active),
      values: _.isObject(filter.style) ? filter.style : await styleService.get(filter.style)
    })
  }
  return styles
}

async function generateStyleFromFilters (layer, defaultStyle) {
  const filters = await parseFiltersFromLayer(layer)
  if (!filters.length) return

  const templates = generateStyleTemplates(defaultStyle, filters)
  const result = Object.assign(
    {},
    _.has(layer, 'leaflet') ? _.mapKeys(templates, (value, key) => `leaflet.${key}`) : {},
    _.has(layer, 'cesium') ? _.mapKeys(templates, (value, key) => `cesium.${key}`) : {}
  )
  return result
}

export async function editLayerStyle (layer, style, ignoreFeatureStyle = false) {
  style = _.pick(style, ['point', 'line', 'polygon'])
  if (layer._id) {
    // Need to regenerate templates to update default style in them
    const result = await generateStyleFromFilters(layer, style)
    if (result) {
      // Update legend
      Object.assign(result, await getLegendForLayer(Object.assign({}, layer, result)))
      if (ignoreFeatureStyle) result.ignoreFeatureStyle = true
      await api.getService('catalog').patch(layer._id, result)
    } else {
      const legend = await getLegendForLayer(Object.assign({}, layer, { 'cesium.style': style, 'leaflet.style': style }))
      const patch = Object.assign(
        {},
        _.has(layer, 'cesium') ? { 'cesium.style': style } : {},
        _.has(layer, 'leaflet') ? { 'leaflet.style': style } : {},
        legend
      )
      if (ignoreFeatureStyle) patch.ignoreFeatureStyle = true
      await api.getService('catalog').patch(layer._id, patch)
    }
  } else {
    if (_.has(layer, 'cesium')) _.set(layer, 'cesium.style', style)
    if (_.has(layer, 'leaflet')) _.set(layer, 'leaflet.style', style)
    Object.assign(layer, await getLegendForLayer(layer))
    if (ignoreFeatureStyle) layer.ignoreFeatureStyle = true
  }
  return layer
}

export async function updateLayerWithFiltersStyle (layer) {
  if (!layer._id) return
  const defaultStyle = getDefaultStyleFromTemplates(_.get(layer, 'leaflet.style', _.get(layer, 'cesium.style', {})))
  const style = await generateStyleFromFilters(layer, defaultStyle)
  if (!style) return

  await api.getService('catalog').patch(layer._id, style)
}

export async function editFilterStyle (layer, filter, engineStyle, style, ignoreFeatureStyle = false) {
  if (!layer._id) return
  const layerDefaultStyle = getDefaultStyleFromTemplates(_.get(layer, 'leaflet.style', _.get(layer, 'cesium.style', {})))

  const filters = await parseFiltersFromLayer(layer)
  const targetFilterCondition = filterQueryToConditions(filter.active)
  // Update filter style
  _.forEach(filters, f => {
    if (_.isEqual(f.conditions, targetFilterCondition)) {
      f.values = style
    }
  })

  // Generate new templates
  const templates = generateStyleTemplates(_.merge({}, DefaultStyle, engineStyle, layerDefaultStyle), filters)
  const layerFilters = _.cloneDeep(_.get(layer, 'filters', []))
  // Update filters in layer
  _.forEach(layerFilters, f => {
    if (_.isEqual(f.label, filter.label) && _.isEqual(f.active, filter.active)) {
      f.style = style._id
    }
  })

  // Patch layer with new templates and filters
  const patch = Object.assign(
    {},
    _.mapKeys(templates, (value, key) => `leaflet.${key}`),
    _.mapKeys(templates, (value, key) => `cesium.${key}`),
    { filters: layerFilters }
  )
  if (ignoreFeatureStyle) patch.ignoreFeatureStyle = true
  // Update legend
  Object.assign(patch, await getLegendForLayer(Object.assign({}, layer, { filters: layerFilters })))
  await api.getService('catalog').patch(layer._id, patch)
}

async function getLayerFiltersWithStyle (layer) {
  const filters = _.get(layer, 'filters', [])
  if (!filters.length) return []
  const styleService = api.getService('styles')
  const filtersWithStyle = []
  for (const filter of filters) {
    const filterWithStyle = _.cloneDeep(filter)
    if (filter.style) {
      filterWithStyle.linkedStyle = _.isObject(filter.style) ? filter.style : await styleService.get(filter.style)
    }
    filtersWithStyle.push(filterWithStyle)
  }
  return filtersWithStyle
}

// Return generic legend or filters for a layer without mutating it
export async function getLegendForLayer (layer) {
  const generateLegendFromStyle = (root, style, layerGeometryTypes) => {
    const layerStyleTypes = _.uniq(_.map(layerGeometryTypes, type => getStyleType(type)))
    const shapes = { point: 'circle', line: 'polyline', polygon: 'rect' }
    const symbols = []
    _.forIn(shapes, (shape, type) => {
      const isInLayerGeometryTypes = (layerStyleTypes.length === 0) || (layerStyleTypes.includes(type))
      if (style[type] && isInLayerGeometryTypes) {
        symbols.push({
          symbol: { 'media/KShape': { options: _.merge({ shape }, _.omit(style[type], ['size'])) } },
          label: _.get(root, 'label', _.get(root, 'name'))
        })
      }
    })
    return {
      type: 'symbols',
      content: {
        symbols
      }
    }
  }

  if (_.has(layer, 'filters') && !_.isEmpty(layer.filters)) {
    const filtersWithStyle = await getLayerFiltersWithStyle(layer)
    let hasFilterWithStyle = false
    _.forEach(filtersWithStyle, filter => {
      if (!_.has(filter, 'linkedStyle')) return
      hasFilterWithStyle = true

      const filterLegend = generateLegendFromStyle(filter, filter.linkedStyle, _.get(layer, 'geometryTypes', []))
      filter.legend = filterLegend
    })
    const legend = {
      legend: { type: 'symbols', label: _.get(layer, 'label', _.get(layer, 'name')), content: {} },
      filters: _.map(filtersWithStyle, filter => _.omit(filter, 'linkedStyle'))
    }
    // For now, only filter with style are displayed in the legend
    // If no filter has style, we want to remove the legend
    if (!hasFilterWithStyle) return { $unset: { legend: '' } }
    return legend
  } else {
    const layerStyle = getDefaultStyleFromTemplates(_.get(layer, 'leaflet.style', _.get(layer, 'cesium.style', {})))
    const legend = generateLegendFromStyle(layer, layerStyle, _.get(layer, 'geometryTypes', []))
    legend.label = _.get(layer, 'label', _.get(layer, 'name'))
    return { legend }
  }
}

export function generateLayerDefinition (layerSpec, geoJson) {
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
  if (geoJson.type === 'FeatureCollection') {
    // Properties of the layer can be specified in the root level of the collection
    _.defaultsDeep(layerSpec, _.omit(geoJson, ['type', 'properties', 'features']))
    // Check for panes to be created if not provided in layer
    if (!_.has(layerSpec, 'leaflet.panes')) {
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
    }
  }

  return true
}

export async function saveGeoJsonLayer (layer, geoJson, chunkSize = 5000) {
  // Check for invalid features first
  const { errors } = cleanFeatures(geoJson)

  if (errors.length > 0) {
    const errorsByKeys = {}
    _.forEach(errors, error => {
      if (!_.has(errorsByKeys, error.error)) errorsByKeys[error.error] = { count: 0, features: [] }
      errorsByKeys[error.error].count++
      if (error.identifier) errorsByKeys[error.error].features.push(error.identifier)
    })
    const errorsList = _.map(errors, error => {
      const hasIdentifiedFeatures = errorsByKeys[error.error].features.length
      const errorString = [
        '<li>',
        i18n.t(error.error, { total: errorsByKeys[error.error].count }),
        hasIdentifiedFeatures ? i18n.t('utils.layers.INVALID_FEATURES_LIST_FEATURES') : '',
        '</li>'
      ].join('')
      const sublist = _.map(errorsByKeys[error.error].features, featureIdentifier => {
        return '<li class="q-ml-lg">' + featureIdentifier + '</li>'
      }).join('')
      return errorString + sublist
    }).join('')

    const result = await kCoreUtils.dialog({
      title: i18n.t('utils.layers.INVALID_FEATURES_DIALOG_TITLE', { total: errors.length }),
      message: [
        i18n.t('utils.layers.INVALID_FEATURES_DIALOG_MESSAGE', { total: errors.length }),
        i18n.t('utils.layers.INVALID_FEATURES_LIST_ERRORS', { errors: errorsList })
      ].join(''),
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
  }
  // Change data source from in-memory to features service
  _.set(layer, 'service', 'features')
  if (_.has(layer, 'leaflet')) _.set(layer, 'leaflet.source', '/api/features')
  if (_.has(layer, 'cesium')) _.set(layer, 'cesium.source', '/api/features')
  const features = getGeoJsonFeatures(geoJson)
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
