import _ from 'lodash'
import commonHooks from 'feathers-hooks-common'
//import { hooks as schemaHooks, resolve } from '@feathersjs/schema'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'

const { setNow, discard, getItems, replaceItems, populate } = commonHooks

/* Populate is too much spacialized and does not allow to merge input/output
 but we need the service information on the fronted
export const populateLayers = populate({
  schema: hook => {
    const service = hook.app.getService('catalog')
    return {
      include: [{
        service: service.getPath(true),
        nameAs: 'layers',
        select: (hook, project) => ({ _id: { $in: _.map(project.layers, '_id') } })
      }]
    }
  }
})
*/

/* Can't get resolvers to work
  const layersResolver = resolve({
  layers: async (project, context) => {
    // Populate the layers associated via ids
    const layers = await context.app.getService('catalog').find({ query: { _id: [project.layers] } })
    return layers
  }
})
const contextsResolver = resolve({
  contexts: async (project, context) => {
    // Populate the contexts associated via ids
    const contexts = await context.app.getService('catalog').find({ query: { _id: [project.contexts], type: 'Context' } })
    return contexts
  }
})
*/

/* Can't get this to workd with get, seems to be called twice */
const populateProjects = async (hook) => {
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])
  for (let i = 0; i < items.length; i++) {
    const project = items[i]
    const layers = project.layers || []
    for (let j = 0; j < layers.length; j++) {
      let layer = layers[j]
      // Get only name when listing
      const query = (hook.method === 'find' ? { $select: ['name'] } : {})
      const service = hook.app.getService('catalog', _.has(layer, 'context') ? layer.context : hook.service.context)
      layer = await service.get(layer._id.toString(), { query })
      Object.assign(layers[j], layer)
    }
    const views = project.views || []
    for (let j = 0; j < views.length; j++) {
      let view = views[j]
      // Get only name when listing
      const query = (hook.method === 'find' ? { $select: ['name'], type: 'Context' } : { type: 'Context' })
      const service = hook.app.getService('catalog', _.has(view, 'context') ? view.context : hook.service.context)
      view = await service.get(view._id.toString(), { query })
      Object.assign(views[j], view)
    }
  }
  replaceItems(hook, isArray ? items : items[0])
}

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [coreHooks.convertObjectIDs(['layers', 'views']), setNow('createdAt', 'updatedAt')],
    update: [],
    patch: [coreHooks.convertObjectIDs(['layers', 'views']), discard('createdAt', 'updatedAt'), setNow('updatedAt')],
    remove: []
  },

  after: {
    all: [],
    find: [populateProjects],
    //find: [],
    //get: [populateProjects],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  /* Can't get resolvers to work
  around: {
    all: [schemaHooks.resolveResult(layersResolver), schemaHooks.resolveResult(contextsResolver)]
  },
  */
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [setNow('updatedAt')]
  }
}
