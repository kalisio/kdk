import _ from 'lodash'
import { uid } from 'quasar'

export function removeServerSideParameters(context) {
  const params = context.params
  _.unset(params, 'query.$locale')
  _.unset(params, 'query.$collation')
  _.unset(params, 'query.populate')
  if (_.has(params, 'query.upsert')) {
    _.set(params, 'upsert', _.get(params, 'query.upsert'))
    _.unset(params, 'query.upsert')
  }
}

export function generateId(context) {
  const params = context.params
  // Generate ID only when not doing a snapshot because it should keep data as it is on the server side
  // Typically some services like the catalog deliver objects without any IDs (as directly coming from the configuration not the database)
  // and this property is used to make some difference in the way the GUI interpret this objects
  if (params.snapshot) return
  const data = (Array.isArray(context.data) ? context.data : [context.data])
  // Update only items without any ID
  data.filter(item => !item._id).forEach(item => {
    item._id = uid().toString()
  })
}

export function ensureSerializable(context) {
  // Serialization in localforage will raise error with structures that are not raw JSON:
  // JS proxy objects, function properties, etc.
  if (context.data) context.data = _.cloneDeep(context.data)
}