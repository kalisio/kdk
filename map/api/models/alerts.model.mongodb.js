export default async function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('alerts')
  await options.Model.createIndex({ geometry: '2dsphere' })
  // Expire at a given date
  await options.Model.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 })
}
