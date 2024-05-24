import _ from 'lodash'
import makeDebug from 'debug'
const debug = makeDebug('kdk:core:offline')

export async function makeServiceSnapshot (service, options) {
  let { baseQuery, baseQueries, offlineService, dataPath = 'data' } = options
  let items = []
  // We can used a combination of queries to get data
  if (!baseQueries) baseQueries = [baseQuery]
  for (let i = 0; i < baseQueries.length; i++) {
    const query = Object.assign({ $skip: 0 }, baseQueries[i])
    debug(`[KDK] making service snapshot with query ${JSON.stringify(query)}`)
    // Clear offline service first if required
    if (offlineService && _.get(options, 'clear', true)) await offlineService.remove(null, { query: _.omit(baseQueries[i], ['$limit']) })
    let result = await service.find({ query })
    let data = result[dataPath] || result
    // No pagination or first page
    if (offlineService) await offlineService.create(data)
    items = items.concat(data)
    // No pagination => stop here
    if (!result[dataPath]) return items

    const { total, limit } = result
    // Remaining pages to process ?
    while (query.$skip + data.length < total) {
      query.$skip += limit
      debug(`[KDK] getting service ${service.name} next page with query ${JSON.stringify(query)}`)
      result = await service.find({ query })
      data = result[dataPath]
      if (offlineService) {
        await offlineService.create(data)
      } else {
        items = items.concat(data)
      }
    }
  }
  return items
}
