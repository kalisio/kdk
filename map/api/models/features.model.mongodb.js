export default function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection(options.collection)
  options.Model.createIndex({ geometry: '2dsphere' })
  options.Model.createIndex({ layer: 1 })
  let baseIndex
  if (options.featureId) {
    // Support compound index
    const featureId = (Array.isArray(options.featureId) ? options.featureId : [options.featureId])
    baseIndex = featureId.reduce((result, id) => Object.assign(result, { ['properties.' + id]: 1 }), {})
    options.Model.createIndex(baseIndex)
    // Create index notably used for time-based geometry aggregation if variables are defined
    const index = Object.assign({}, baseIndex, {
      geometry: 1, time: 1
    })
    options.Model.createIndex(index)
  }
  // Create index notably used for timeseries aggregation if variables are defined
  if (options.variables) {
    options.variables.forEach(variable => {
      const index = Object.assign({}, baseIndex, {
        ['properties.' + (variable.name ? variable.name : variable)]: 1, time: 1
      })
      options.Model.createIndex(index)
    })
  }
  try {
    options.Model.createIndex({ 'properties.$**': 1 })
  } catch (_) {
    // Fail silently as it might not be supported under v4
  }
  if (options.expireAfter || options.ttl) {
    options.Model.createIndex({ time: 1 }, { expireAfterSeconds: options.expireAfter || options.ttl })
  }
}
