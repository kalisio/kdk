import makeDebug from 'debug'

const debug = makeDebug('kdk:core:tags:hooks')

export async function reflectTagUpdate (hook) {
  const { app, result, params, method } = hook

  const { service: targetService, property, name, description, color } = result

  if (!targetService) return hook

  const service = app.getService(targetService)
  if (!service) {
    debug('Service not found: ', targetService)
    return hook
  }

  const previousItem = params.previousItem || {}

  const records = await service.find({
    query: {
      [property]: {
        $elemMatch: {
          name: previousItem.name,
          color: previousItem.color
        }
      },

      $select: ['_id', property]
    },
    paginate: false
  })

  for (const record of records) {
    const updatedTags = record[property].map(tag => {
      if (tag.name === previousItem.name && tag.color === previousItem.color) {
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
