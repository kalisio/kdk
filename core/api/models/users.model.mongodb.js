export default function (app, options) {
  options.Model = app.db.collection('users')
  options.Model.createIndex({ email: 1 }, { unique: true })
  // Collation provided in query ensure sorting to be case insensitive w.r.t. user's language
  // We built indices with collation to cover the most used languages, it requires different naming...
  options.Model.createIndex({ 'profile.name': 1 }, { name: 'name-en', collation: { locale: 'en', strength: 1 } })
  options.Model.createIndex({ 'profile.name': 1 }, { name: 'name-fr', collation: { locale: 'fr', strength: 1 } })
  // Inactive user account might expire at a given date
  options.Model.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 })
}
