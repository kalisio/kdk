module.exports = function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection(options.collection)
  options.Model.createIndex({ geometry: '2dsphere' })
  options.Model.createIndex({ layer: 1 })
  if (options.featureId) {
    options.Model.createIndex({ ['properties.' + options.featureId]: 1 })
  }
  if (options.expireAfter || options.ttl) {
    options.Model.createIndex({ time: 1 }, { expireAfterSeconds: options.expireAfter || options.ttl })
  }
}
