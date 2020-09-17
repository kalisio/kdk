import mongoManager from 'feathers-mongodb-management'

export default function (name, app, options) {
  return mongoManager.database({ adminDb: app.db.instance.admin(), client: app.db.client })
}
