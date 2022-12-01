import { api } from '../../../core/client/index.js'

export function useCatalog (contextOrId) {
  // data
  const service = api.getService('catalog', contextOrId)

  // methods
  async function listSublegends () {
    const response = await service.find({ query: { type: 'Sublegend' }, $limit: 0 })
    return response.data
  }

  // exposed
  return {
    listSublegends
  }
}
