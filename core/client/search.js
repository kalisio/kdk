import _ from 'lodash'
import { api } from './api.js'
import { getLocale } from './utils/utils.locale.js'
import { getIconName, processIcon } from './utils/index.js'

// Export singleton
export const Search = {
  async query (services, pattern) {
    const results = []
    // Ensure the services are of type of array
    if (!Array.isArray(services)) services = [services]
    // Perform request for partial match to all registered services
    const requests = _.map(services, serviceDescriptor => {
      // Retrieve the service using the service or name key
      const service = api.getService(serviceDescriptor.service, serviceDescriptor.context)
      // Build the query using given template if any
      const query = Object.assign({ $locale: getLocale() }, serviceDescriptor.baseQuery)
      // Then add partial match
      // We don't use set by dot here because Mongo queries on nested fields
      // require the key to contain the path and not nested objects
      query[serviceDescriptor.field] = { $search: pattern }
      return service.find({ query })
    })
    // Execute the search
    const responses = await Promise.all(requests)
    // Buld the result
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i]
      const serviceDescriptor = services[i]
      // Process the response
      if (response.total > 0) {
        // Format the result
        response.data.forEach(data => {
          data.service = serviceDescriptor.service
          data.context = serviceDescriptor.context
          data.field = serviceDescriptor.field
          const icon = getIconName(data)
          if (_.isEmpty(icon) && _.has(serviceDescriptor, 'icon')) {
            data.icon = serviceDescriptor.icon
            processIcon(data)
          }
          // And store it
          results.push(data)
        })
      }
    }
    return results
  }
}
