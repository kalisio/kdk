import _ from 'lodash'
import sift from 'sift'
import common from 'feathers-hooks-common'
import makeDebug from 'debug'

const { getItems, replaceItems } = common
const debug = makeDebug('kdk:map:catalog:hooks')

// By default we only return layers and not other objects in catalog
export function getDefaultCategories (hook) {
  const query = _.get(hook, 'params.query', {})
  if (query.type === 'Category') {
    const catalog = hook.app.get('catalog')
    let defaultCategories = catalog ? catalog.categories || [] : []
    // Add implicit type
    defaultCategories = defaultCategories.map(category => Object.assign(category, { type: 'Category' }))
    // Then filter according to query
    defaultCategories = defaultCategories.filter(sift(_.omit(query, ['$sort', '$limit', '$skip'])))
    const item = getItems(hook)
    replaceItems(hook, item.concat(defaultCategories.map(category => Object.assign(category, { type: 'Category' }))))
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
