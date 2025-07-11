import makeDebug from 'debug'

const debug = makeDebug('kdk:core:tags:hooks')

export async function cacheTagBeforeUpdate (hook) {
  const { app, id, params } = hook

  const tag = await app.getService('tags').get(id)
  params.beforeUpdateTag = tag

  return hook
}

export async function reflectTagUpdate (hook) {
  const { app, result, params, method } = hook

  const { service: targetService, property, name, description, color } = result

  if (!targetService) return hook

  const service = app.getService(targetService)
  if (!service) {
    debug('Service not found: ', targetService)
    return hook
  }

  const beforeUpdateTag = params.beforeUpdateTag || {}

  const records = await service.find({
    query: {
      [property]: {
        $elemMatch: {
          name: beforeUpdateTag.name,
          color: beforeUpdateTag.color
        }
      },

      $select: ['_id', property]
    },
    paginate: false
  })

  for (const record of records) {
    const updatedTags = record[property].map(tag => {
      if (tag.name === beforeUpdateTag.name && tag.color === beforeUpdateTag.color) {
        if (method === 'remove') {
          // If the tag is being removed, we return null to filter it out
          return null
        }
        return {
          ...tag,
          name,
          description,
          color
        }
      }
      return tag
    }).filter(Boolean)
    await service.patch(record._id, {
      [property]: updatedTags
    })
  }

  return hook
}
