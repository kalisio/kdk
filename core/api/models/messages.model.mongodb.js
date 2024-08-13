export default function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('messages')
  // Collation provided in query ensure sorting to be case insensitive w.r.t. user's language
  // We built indices with collation to cover the most used languages, it requires different naming...
  options.Model.createIndex({ createdAt: -1 })
  options.Model.createIndex({ body: 1 }, { name: 'body-en', collation: { locale: 'en', strength: 1 } })
  options.Model.createIndex({ body: 1 }, { name: 'body-fr', collation: { locale: 'fr', strength: 1 } })
}