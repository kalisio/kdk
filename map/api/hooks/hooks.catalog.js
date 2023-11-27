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
  if ((query.type === 'Category') && (query.$limit !== 0)) {
    const service = hook.service
    // Read default category config
    const catalogConfig = hook.app.get('catalog') || { categories: [] }
    // Check for specific service override (e.g. contextual catalog different from global catalog)
    let defaultCategories = _.get(service, 'options.categories', catalogConfig.categories)
    // Add implicit type
    defaultCategories = _.map(defaultCategories, category => Object.assign(category, { type: 'Category' }))
    // Then filter according to query
    defaultCategories = defaultCategories.filter(sift(_.omit(query, ['$sort', '$limit', '$skip'])))
    const item = getItems(hook)
    replaceItems(hook, item.concat(defaultCategories.map(category => Object.assign(category, { type: 'Category' }))))
  }
}

// By default we only return default sublegends
export function getDefaultSublegends (hook) {
  const query = _.get(hook, 'params.query', {})
  if ((query.type === 'Sublegend') && (query.$limit !== 0)) {
    const service = hook.service
    // Read default sublegends config
    const catalogConfig = hook.app.get('catalog') || { sublegends: [] }
    // Check for specific service override (e.g. contextual catalog different from global catalog)
    let defaultSublegends = _.get(service, 'options.sublegends', catalogConfig.sublegends)
    // Add implicit type
    defaultSublegends = _.map(defaultSublegends, sublegend => Object.assign(sublegend, { type: 'Sublegend' }))
    // Then filter according to query
    defaultSublegends = defaultSublegends.filter(sift(_.omit(query, ['$sort', '$limit', '$skip'])))
    const item = getItems(hook)
    replaceItems(hook, item.concat(defaultSublegends.map(sublegend => Object.assign(sublegend, { type: 'Sublegend' }))))
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

// Update projects when a layer/view is removed
export async function updateProjects (hook) {
  const app = hook.app
  const context = hook.service.getContextId()
  const projectsService = app.getService('projects', context)
  let removedItems = getItems(hook)
  if (!Array.isArray(removedItems)) removedItems = [removedItems]
  for (let i = 0; i < removedItems.length; i++) {
    const removedItem = removedItems[i]
    const isLayer = removedItem.type !== 'Context'
    const query = {}
    if (isLayer) {
      query.$or = [{ 'layers._id': removedItem._id }, { 'layers.name': removedItem.name }]
    } else {
      query['views._id'] = removedItem._id
    }
    // Retrieve the list of all projects involving the item
    const projects = await projectsService.find({
      query, paginate: false
    })
    // Stop when non found
    if (projects.length === 0) {
      debug(`No project to update after removing item ${removedItem.name} `)
      return hook
    }
    // Update each project otherwise
    await Promise.all(projects.map(project => {
      // Remove item in list
      const items = (isLayer ? project.layers : project.views)
      _.remove(items, item => item._id ? removedItem._id.toString() === item._id.toString() : removedItem.name === item.name)
      return projectsService.patch(project._id.toString(), isLayer ? { layers: items } : { views: items })
    }))

    debug(`Updated ${projects.length} projects after removing item ${removedItem.name} `)
  }
  return hook
}
