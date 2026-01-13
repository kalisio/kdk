import _ from 'lodash'
import logger from 'loglevel'
import booleanIntersects from '@turf/boolean-intersects'
import { polygon } from '@turf/helpers'

export function removeServerSideParameters(context) {
  const params = context.params
  if (_.has(params, 'query.east')) {
    _.set(params, 'east', _.get(params, 'query.east'))
    _.unset(params, 'query.east')
  }
  if (_.has(params, 'query.west')) {
    _.set(params, 'west', _.get(params, 'query.west'))
    _.unset(params, 'query.west')
  }
  if (_.has(params, 'query.north')) {
    _.set(params, 'north', _.get(params, 'query.north'))
    _.unset(params, 'query.north')
  }
  if (_.has(params, 'query.south')) {
    _.set(params, 'south', _.get(params, 'query.south'))
    _.unset(params, 'query.south')
  }
}

export function geoJsonPaginationHook(context) {
  const result = context.result
  const features = result.data
  // Not features ?
  if ((features.length > 0) && (_.get(features, '[0].type') !== 'Feature')) return
  context.result = Object.assign({
    type: 'FeatureCollection',
    features: result.data
  }, _.pick(result, ['total', 'skip', 'limit']))
}

export async function intersectBBoxHook(context) {
  const params = context.params
  if (!_.has(params, 'east') || !_.has(params, 'west') || !_.has(params, 'north') || !_.has(params, 'south')) return context
  const result = context.result
  const features = result.data
  const bbox = polygon([[[params.east, params.south], [params.west, params.south], [params.west, params.north], [params.east, params.north], [params.east, params.south]]])
  let featuresInBbox = []
  for (let feature of features) {
    if (booleanIntersects(bbox, feature)) {
      featuresInBbox.push(feature)
    }
  }
  _.set(context, 'result.data', featuresInBbox)
}
