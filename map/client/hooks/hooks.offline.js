import _ from 'lodash'
import intersect from '@turf/intersect'
import { featureCollection } from '@turf/helpers'

export function removeServerSideParameters(context) {
    _.set(context, 'params.east', _.get(context, 'params.query.east'))
    _.set(context, 'params.west', _.get(context, 'params.query.west'))
    _.set(context, 'params.north', _.get(context, 'params.query.north'))
    _.set(context, 'params.south', _.get(context, 'params.query.south'))
    _.unset(context, 'params.query.east')
    _.unset(context, 'params.query.west')
    _.unset(context, 'params.query.north')
    _.unset(context, 'params.query.south')
}

export async function referenceCountCreateHook(context) {
    const service = context.service
    for (let feature of context.data) {
        const request = await service._find({
            query : {
                _id : feature._id
            }
        })
        if (_.get(request, 'data.length') !== 0)  {
            const count = _.get(request, 'data[0].referenceCount') + 1
            feature.referenceCount = count
            service._update(feature._id, feature)
        } else {
            feature.referenceCount = 1
            service._create(feature)
        }
    }
    context.result = context.data
}

export function referenceCountRemoveHook(context) {
    const service = context.service
    for (let feature of context.arguments[0]) {
        feature.referenceCount--
        if (feature.referenceCount !== 0) {
            service._update(feature._id, feature)
        } else {
            service._remove(feature._id)
        }
    }
    context.result = context.data
}

export function geoJsonPaginationHook(context) {
    const result = context.result
    const features = result.data
    if (_.get(features, '[0].type') !== 'Feature') return
    context.result = Object.assign({
        type: 'FeatureCollection',
        features: result.data
    }, _.pick(result, ['total', 'skip', 'limit']))
}

export async function tiledLayerHook(context) {
    const service = context.service
    const params = context.params
    const query = await service._find({})
    const features = query.data
    let result = []
    for (let feature of features) {
        const bbox = [params.east, params.west, params.north, params.south]
        const featurePolygon = _.get(feature, 'geometry.coordinates')
        var intersection = intersect(featureCollection([bbox, featurePolygon]));
        if (intersection) {
            result.push(feature)
        }
    }
    _.set(context, 'result.data', result)
}