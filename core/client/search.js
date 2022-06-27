import _ from 'lodash'
import { api } from './api.js'
import { getIconName, processIcon } from './utils.js'

// Export singleton
export const Search = {
  async query (services, pattern) {
    // Perform request for partial match to all registered services
    const requests = _.map(services, serviceDescriptor => {
      const service = api.getService(serviceDescriptor.service)
      // build the query using given templet if any
      const query = Object.assign({}, serviceDescriptor.baseQuery)
      // Then add partial match
      // We don't use set by dot here because Mongo queries on nested fields
      // require the key to contain the path and not nested objects
      query[serviceDescriptor.field] = { $search: pattern }
      return service.find({ query })
    })
    const responses = await Promise.all(requests)
    const results = []
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i]
      const serviceDescriptor = services[i]
      if (response.total > 0) {
        response.data.forEach(data => {
          data.service = serviceDescriptor.service
          data.field = serviceDescriptor.field
          const icon = getIconName(data)
          if (_.isEmpty(icon)) {
            data.icon = serviceDescriptor.icon
            processIcon(data)
          }
          results.push(data)
        })
      }
    }
    return results
  }
}
