module.exports = function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('catalog')
  options.Model.createIndex({ name: 1 }, { unique: true })
  options.Model.createIndex({ type: 1 })
}
