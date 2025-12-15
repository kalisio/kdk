import _ from 'lodash'

export function getCatalogProjectQuery (project) {
  // As we keep track of ID/name depending on if a layer is a user-defined one or not we need to process both
  const idQuery = { _id: { $in: _.map(_.filter(project.layers, '_id'), '_id') } }
  const nameQuery = { name: { $in: _.map(_.filter(project.layers, 'name'), 'name') } }
  return { $or: [idQuery, nameQuery] }
}

export function getViewsProjectQuery (project) {
  return { _id: { $in: _.map(project.views, '_id') } }
}
