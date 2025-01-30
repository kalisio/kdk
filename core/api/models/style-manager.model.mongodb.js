export default function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('style-manager')
  // Use compound index to have unique pairs scope/value
  options.Model.createIndex({ scope: 1, value: 1 }, { unique: true })
  // Collation provided in query ensure sorting to be case insensitive w.r.t. user's language
  // We built indices with collation to cover the most used languages, it requires different naming...
  options.Model.createIndex({ value: 1 }, { name: 'value-en', collation: { locale: 'en', strength: 1 } })
  options.Model.createIndex({ value: 1 }, { name: 'value-fr', collation: { locale: 'fr', strength: 1 } })
}
