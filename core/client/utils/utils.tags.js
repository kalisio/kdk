import logger from 'loglevel'
import { api } from '../api.js'

export async function getTagsFilterOptions (service) {
  const tagsService = api.getService('tags')
  if (!tagsService) {
    logger.warn('[KDK] Tags service not found')
    return []
  }

  const tags = (await tagsService.find({ service })).data
  for (const tag of tags) {
    tag.label = tag.name
  }

  return tags
}
