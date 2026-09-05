export default async function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('messages')
  // Collation provided in query ensure sorting to be case insensitive w.r.t. user's language
  // We built indices with collation to cover the most used languages, it requires different naming...
  await options.Model.createIndex({ createdAt: -1 })
  await options.Model.createIndex({ title: 1 }, { name: 'title-en', collation: { locale: 'en', strength: 1 } })
  await options.Model.createIndex({ title: 1 }, { name: 'title-fr', collation: { locale: 'fr', strength: 1 } })
  await options.Model.createIndex({ body: 1 }, { name: 'body-en', collation: { locale: 'en', strength: 1 } })
  await options.Model.createIndex({ body: 1 }, { name: 'body-fr', collation: { locale: 'fr', strength: 1 } })
  await options.Model.createIndex({ author: 1 }, { name: 'author-en', collation: { locale: 'en', strength: 1 } })
  await options.Model.createIndex({ author: 1 }, { name: 'author-fr', collation: { locale: 'fr', strength: 1 } })
}