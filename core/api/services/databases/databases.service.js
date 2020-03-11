import mongoManager from 'feathers-mongodb-management'

export default function (name, app, options) {
  return mongoManager.database({ db: app.db.instance })
}
