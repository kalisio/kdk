export default function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection(options.collection)
  options.Model.createIndex({ geometry: '2dsphere' })
  options.Model.createIndex({ layer: 1 })
  if (options.featureId) {
    // Support compound index
    const featureId = (Array.isArray(options.featureId) ? options.featureId : [options.featureId])
    const index = featureId.reduce((result, id) => Object.assign(result, { ['properties.' + id]: 1 }), {})
    options.Model.createIndex(index)
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
