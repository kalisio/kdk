module.exports = function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('alerts')
  options.Model.createIndex({ geometry: '2dsphere' })
  // Expire at a given date
  options.Model.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 })
}
