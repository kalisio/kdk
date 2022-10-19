import _ from 'lodash'
import siftModule from 'sift'
import common from 'feathers-hooks-common'
import makeDebug from 'debug'

const { getItems, replaceItems } = common
const sift = siftModule.default
const debug = makeDebug('kdk:map:catalog:hooks')

// By default we only return default categories
export function getDefaultCategories (hook) {
  const query = _.get(hook, 'params.query', {})
  if (query.type === 'Category') {
    const service = hook.service
    // Read default category config
    const catalogConfig = hook.app.get('catalog') || { categories: [] }
    // Check for specific service override (e.g. contextual catalog different from global catalog)
    let defaultCategories = _.get(service, 'options.categories', catalogConfig.categories)
    // Add implicit type
    defaultCategories = defaultCategories.map(category => Object.assign(category, { type: 'Category' }))
    // Then filter according to query
    defaultCategories = defaultCategories.filter(sift(_.omit(query, ['$sort', '$limit', '$skip'])))
    const item = getItems(hook)
    replaceItems(hook, item.concat(defaultCategories.map(category => Object.assign(category, { type: 'Category' }))))
  }
}

// By default we only return default legends
export function getDefaultLegends (hook) {
  const query = _.get(hook, 'params.query', {})
  if (query.type === 'Legend') {
    const service = hook.service
    // Read default legends config
    const catalogConfig = hook.app.get('catalog') || { legends: [] }
    // Check for specific service override (e.g. contextual catalog different from global catalog)
    let defaultLegends = _.get(service, 'options.legends', catalogConfig.legends)
    // Add implicit type
    defaultLegends = defaultLegends.map(legend => Object.assign(legend, { type: 'Legend' }))
    // Then filter according to query
    defaultLegends = defaultLegends.filter(sift(_.omit(query, ['$sort', '$limit', '$skip'])))
    const item = getItems(hook)
    replaceItems(hook, item.concat(defaultLegends.map(legend => Object.assign(legend, { type: 'Legend' }))))
  }
}

// By default we only return layers and not other objects in catalog
export function filterLayers (hook) {
  const query = _.get(hook, 'params.query', {})
  if (!query.type) query.type = { $nin: ['Context', 'Service', 'Category'] }
  _.set(hook, 'params.query', query)
}

// Update layer name in all contexts, categories, etc. when renamed/removed
export async function updateLayerReferences (hook) {
  // Check if it's a layer renaming first
  const type = _.get(hook.params, 'previousItem.type', '')
  if (!type.endsWith('Layer')) return hook
  const previousLayer = _.get(hook.params, 'previousItem')
  const layer = getItems(hook)

  // Retrieve the list of all contexts, categories, etc. involving the layer
  const contexts = await hook.service.find({
    query: { type: { $in: ['Context', 'Category'] }, layers: previousLayer.name },
    paginate: false
  })
  // Stop when non found
  if (contexts.length === 0) {
    debug(`No context or category to update after renaming or removing layer ${layer.name} `)
    return hook
  }
  // Update each context otherwise
  await Promise.all(contexts.map(context => {
    // Update/Remove layer name in layer list
    let layers = context.layers
    if (hook.method === 'remove') {
      _.remove(layers, layerName => layerName === previousLayer.name)
    } else {
      layers = layers.map(layerName => (layerName === previousLayer.name ? layer.name : layerName))
    }
    return hook.service.patch(context._id, { layers })
  }))

  debug(`Updated ${contexts.length} contexts and categories after renaming or removing layer ${layer.name} `)
  return hook
}
