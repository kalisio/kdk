import _ from 'lodash'
import sift from 'sift'
import { api, i18n, Store } from '../../../core/client/index.js'
import { buildUrl } from '../../../core/common/index.js'

// Helper to set a JWT as query param in a target URL
export function setUrlJwt (item, path, baseUrl, jwtField, jwt) {
  const url = _.get(item, path)
  if (!url) return
  // Check it conforms to required base URL
  if (!url.startsWith(baseUrl)) return
  // FIXME: specific case of Cesium OpenStreetMap provider
  // Because Cesium generates the final url as base url + tile scheme + extension
  // updating the base url property breaks it, for now we modify the extension
  if ((path === 'cesium.url') && _.get(item, 'cesium.type') === 'OpenStreetMap') {
    const ext = _.get(item, 'cesium.fileExtension', 'png')
    _.set(item, 'cesium.fileExtension', ext + `?${jwtField}=${jwt}`)
  } else {
    _.set(item, path, buildUrl(url, { [jwtField]: jwt }))
  }
}

// Helper to set required JWT as query param in a given set of layers for underlying engine
export async function setEngineJwt (layers, planetApi) {
  // Backward compatibility when we previously used a single API
  if (!planetApi) planetApi = api
  // If we need to use API gateway forward token as query parameter
  // (Leaflet does not support anything else by default as it mainly uses raw <img> tags)
  let jwt = (planetApi.hasConfig('gatewayJwt') ? await planetApi.get('storage').getItem(planetApi.getConfig('gatewayJwt')) : null)
  let jwtField = planetApi.getConfig('gatewayJwtField')
  // Check both the default built-in config or the server provided one if any
  const gatewayUrl = (planetApi.hasConfig('gateway') ? planetApi.getConfig('gateway') : Store.get('capabilities.api.gateway'))
  if (jwt) {
    layers.forEach(layer => {
      setUrlJwt(layer, 'iconUrl', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'leaflet.source', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'leaflet.url', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'opendap.url', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'geotiff.url', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'wfs.url', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'wcs.url', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'cesium.url', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'cesium.source', gatewayUrl, jwtField, jwt)
    })
  }
  // We might also proxy some data directly from the app when using object storage
  // This is only for raw raster data not OGC protocols
  jwt = (planetApi.hasConfig('apiJwt') ? await planetApi.get('storage').getItem(planetApi.getConfig('apiJwt')) : null)
  jwtField = 'jwt'
  const apiUrl = planetApi.getConfig('domain')
  if (jwt) {
    layers.forEach(layer => {
      setUrlJwt(layer, 'geotiff.url', apiUrl, jwtField, jwt)
    })
    // We also allow absolute URLs for app like /api/storage/xxx
    layers.forEach(layer => {
      setUrlJwt(layer, 'geotiff.url', '/', jwtField, jwt)
    })
  }
  return layers
}

export function getLayersByCategory (layers, categories) {
  const categorizedLayers = _.clone(layers)
  const layersByCategory = {}
  _.forEach(categories, category => {
    // Built-in categories use filtering while user-defined ones use layers list
    let filter = null
    if (_.has(category, 'options.filter')) {
      filter = _.get(category, 'options.filter')
    } else if (_.has(category, 'layers')) {
      filter = { name: { $in: _.get(category, 'layers') } }
    }
    // If the list of layers in category is empty we can have a null filter
    layersByCategory[category.name] = filter ? _.remove(categorizedLayers, sift(filter)) : []
    // Order by
    layersByCategory[category.name] = _.orderBy(layersByCategory[category.name],
      [(layer) => _.get(layer, _.get(category, 'options.orderBy', '_id'))],
      [_.get(category, 'options.order', 'asc')])
  })
  return layersByCategory
}

export function getOrphanLayers (layers, layersByCategory) {
  const categories = _.flatten(_.values(layersByCategory))
  const orphanLayers = _.difference(layers, categories)
  // Order by
  return _.orderBy(orphanLayers, [(layer) => _.get(layer, '_id')], ['asc'])
}

function processTranslations (item) {
  if (item.i18n) i18n.registerTranslation(item.i18n)
  if (!_.has(item, 'label')) item.label = i18n.tie(item.name)
  if (_.has(item, 'description')) item.description = i18n.tie(item.description)
}

export async function getLayers (options = {}) {
  _.defaults(options, {
    query: {},
    context: '',
    planetApi: api
  })

  let layers = []
  const catalogService = options.planetApi.getService('catalog', options.context)
  if (catalogService) {
    const response = await catalogService.find({ query: options.query })
    _.forEach(response.data, processTranslations)
    // Set which API to use to retrieve layer data
    layers = layers.concat(response.data.map(layer => Object.assign(layer, { getPlanetApi: () => options.planetApi })))
  }
  // Do we need to inject a token ?
  await setEngineJwt(layers, options.planetApi)
  return layers
}

export async function getCategories (options = {}) {
  _.defaults(options, {
    query: {},
    context: '',
    planetApi: api
  })

  let categories = []
  const catalogService = options.planetApi.getService('catalog', options.context)
  if (catalogService) {
    const response = await catalogService.find({ query: Object.assign({ type: 'Category' }, options.query) })
    _.forEach(response.data, processTranslations)
    categories = categories.concat(response.data)
  }
  return categories
}

export async function updateCategory (id, data, options = {}) {
  _.defaults(options, {
    context: '',
    planetApi: api
  })

  const catalogService = options.planetApi.getService('catalog', options.context)
  if (catalogService && id && data) {
    const response = await catalogService.patch(id, data)
    return response
  }
}

export async function getSublegends (options = {}) {
  _.defaults(options, {
    query: {},
    context: '',
    planetApi: api
  })

  let sublegends = []
  const catalogService = options.planetApi.getService('catalog', options.context)
  if (catalogService) {
    const response = await catalogService.find({ query: Object.assign({ type: 'Sublegend' }, options.query) })
    _.forEach(response.data, processTranslations)
    sublegends = sublegends.concat(response.data)
  }
  return sublegends
}

export function getLayersBySublegend (layers, sublegends) {
  const categorizedLayers = _.clone(layers)
  const layersBySublegend = {}
  _.forEach(sublegends, sublegend => {
    // Built-in legends use filtering
    let filter = null
    if (_.has(sublegend, 'options.filter')) {
      filter = _.get(sublegend, 'options.filter')
    }
    // If the list of layers in a sublegend is empty we can have a null filter
    layersBySublegend[sublegend.name] = filter ? _.remove(categorizedLayers, sift(filter)) : []
  })
  return layersBySublegend
}

export async function getViews (options = {}) {
  _.defaults(options, {
    query: {},
    context: '',
    planetApi: api
  })

  let views = []
  const catalogService = options.planetApi.getService('catalog', options.context)
  if (catalogService) {
    const response = await catalogService.find({ query: Object.assign({ type: 'Context' }, options.query) })
    _.forEach(response.data, processTranslations)
    views = views.concat(response.data)
  }
  return views
}
