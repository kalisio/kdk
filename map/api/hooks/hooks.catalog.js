import _ from 'lodash'
import { getItems, replaceItems } from 'feathers-hooks-common'
import makeDebug from 'debug'

const debug = makeDebug('kdk:map:catalog:hooks')

// By default we only return layers and not contexts in catalog
export function filterContexts (hook) {
  const query = _.get(hook, 'params.query', {})
  if (!query.type) query.type = { $nin: ['Context', 'Category'] }
  _.set(hook, 'params.query', query)
}

// Update layer name in all contexts when renamed/removed
export async function updateContexts (hook) {
  // Check if it's a layer renaming first
  const type = _.get(hook.params, 'previousItem.type', '')
  if (!type.endsWith('Layer')) return hook
  const previousLayer = _.get(hook.params, 'previousItem')
  const layer = getItems(hook)
  
  // Retrieve the list of all contexts involving the layer
  const contexts = await hook.service.find({
    query: { type: 'Context', layers: previousLayer.name },
    paginate: false
  })
  // Stop when non found
  if (contexts.length === 0) {
    debug(`No context to update after renaming or removing layer ${layer.name} `)
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

  debug(`Updated ${contexts.length} contexts after renaming or removing layer ${layer.name} `)
  return hook
}
