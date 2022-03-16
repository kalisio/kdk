module.exports = function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('catalog')
  // We previously had a unique constraint on name but we now have
  // different object types stored and we'd like a unique constraint per type
  options.Model.indexExists('name_1').then(() => options.Model.dropIndex('name_1')).catch(() => {})
  options.Model.indexExists('type_1').then(() => options.Model.dropIndex('type_1')).catch(() => {})
  // We also previously not take collation into account
  options.Model.indexExists('name_1_type_1').then(() => options.Model.dropIndex('name_1_type_1')).catch(() => {})
  // Collation provided in query ensure sorting to be case insensitive w.r.t. user's language
  // We built indices with collation to cover the most used languages, it requires different naming...
  options.Model.createIndex({ name: 1, type: 1 }, { unique: true, name: 'name-type-en', collation: { locale: 'en', strength: 1 } })
  options.Model.createIndex({ name: 1, type: 1 }, { unique: true, name: 'name-type-fr', collation: { locale: 'fr', strength: 1 } })
}
