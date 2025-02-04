export default function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('styles')
  // Collation provided in query ensure sorting to be case insensitive w.r.t. user's language
  // We built indices with collation to cover the most used languages, it requires different naming...
  options.Model.createIndex({ name: 1 }, { name: 'name-en', collation: { locale: 'en', strength: 1 } })
  options.Model.createIndex({ name: 1 }, { name: 'name-fr', collation: { locale: 'fr', strength: 1 } })
}
