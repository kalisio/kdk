module.exports = function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('catalog')
  // We previously had a unique constraint on name but we now have
  // different object types stored and we'd like a unique constraint per type
  options.Model.indexExists('name_1').then(() => options.Model.dropIndex('name_1')).catch(() => {})
  options.Model.indexExists('type_1').then(() => options.Model.dropIndex('type_1')).catch(() => {})
  options.Model.createIndex({ name: 1, type: 1 }, { unique: true })
}
