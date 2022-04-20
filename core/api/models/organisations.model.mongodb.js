export default function (app, options) {
  options.Model = app.db.collection('organisations')
}
