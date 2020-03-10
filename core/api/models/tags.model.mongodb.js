module.exports = function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('tags')
  // Use compound index to have unique pairs scope/value
  options.Model.createIndex({ scope: 1, value: 1 }, { unique: true })
}
