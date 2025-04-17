import _ from 'lodash'
import siftModule from 'sift'
import common from 'feathers-hooks-common'
import makeDebug from 'debug'
import { toString, toJson } from '../../../core/api/hooks/index.js'

const { getItems, replaceItems } = common
const sift = siftModule.default
const debug = makeDebug('kdk:map:catalog:hooks')

function isQueryForType(query, type) {
  // Use sift to support MongoDB operators like $in, $nin, etc.
  const filter = [{ type }].filter(sift(_.pick(query, ['type'])))
  return !_.isEmpty(filter)
}

function addDefaultItems(query, type, items, defaultItems) {
  // Add implicit type as not provided in default items config
  defaultItems = _.map(defaultItems, item => Object.assign(item, { type }))
  // Then filter according to query
  defaultItems = defaultItems.filter(sift(_.omit(query, ['$sort', '$limit', '$skip'])))
  return items.concat(defaultItems.map(item => Object.assign(item, { type })))
}

// By default we only return default categories
export function getDefaultCategories (hook) {
  const query = _.get(hook, 'params.query', {})
  const type = 'Category'
  if ((query.$limit !== 0) && isQueryForType(query, type)) {
    const service = hook.service
    // Check for default categories config
    const defaultCategories = _.get(service, 'options.categories', [])
    replaceItems(hook, addDefaultItems(query, type, getItems(hook), defaultCategories))
  }
}

// By default we only return default sublegends
export function getDefaultSublegends (hook) {
  const query = _.get(hook, 'params.query', {})
  const type = 'Sublegend'
  if ((query.$limit !== 0) && isQueryForType(query, type)) {
    const service = hook.service
    // Check for default sublegends config
    const defaultSublegends = _.get(service, 'options.sublegends', [])
    replaceItems(hook, addDefaultItems(query, type, getItems(hook), defaultSublegends))
  }
}

// By default we only return layers and not other objects in catalog
export function filterLayers (hook) {
  const query = _.get(hook, 'params.query', {})
  if (!query.type) query.type = { $nin: ['Context', 'Service', 'Category', 'Sublegend'] }
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
  if (!projectsService) return hook
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

export function convertFilterQueriesToString (hook) {
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])
  items.forEach(item => {
    const filters = _.get(item, 'filters', [])
    _.forEach(filters, filter => {
      toString(filter, ['active', 'inactive'])
    })
  })
  replaceItems(hook, isArray ? items : items[0])

  return hook
}

export function convertFilterQueriesToObject (hook) {
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])
  items.forEach(item => {
    const filters = _.get(item, 'filters', [])
    _.forEach(filters, filter => {
      toJson(filter, ['active', 'inactive'])
    })
  })
  replaceItems(hook, isArray ? items : items[0])

  return hook
}