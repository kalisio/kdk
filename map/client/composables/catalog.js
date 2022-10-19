import { api } from '../../../core/client/index.js'

export function useCatalog (contextOrId) {
  // data
  const service = api.getService('catalog', contextOrId)

  // methods
  async function listLegends () {
    const response = await service.find({ query: { type: 'Legend' }, $limit: 0 })
    return response.data
  }

  // exposed
  return {
    listLegends
  }
}
