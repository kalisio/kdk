import _ from 'lodash'
import logger from 'loglevel'
import intersect from '@turf/intersect'
import { featureCollection } from '@turf/helpers'

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

async function updateReferenceCount(service, id, increment) {
    const feature = await service._get(id)
    const count = _.get(feature, 'referenceCount', 0) + increment
    const data = await service._patch(id, { referenceCount: count })
    return data
}
export async function referenceCountCreateHook(context) {
    const service = context.service
    const features = (Array.isArray(context.data) ? context.data : [context.data])
    for (let i = 0; i < features.length; i++) {
        const feature = features[i]
        try {
            // This will raise if feature does not exist
            await updateReferenceCount(service, feature._id, +1)
        } catch (error) {
            feature.referenceCount = 1
            await service._create(feature)
        }
    }
    context.result = context.data
}

export async function referenceCountRemoveHook(context) {
    const service = context.service
    // By ID or by query ?
    if (!context.id) {
        context.result = await service._find(Object.assign(context.params, { paginate: false }))
        for (let i = 0; i < context.result.length; i++) {
            const feature = context.result[i]
            try {
                const { referenceCount } = await updateReferenceCount(service, feature._id, -1)
                // Skip removing if still used
                if (referenceCount <= 0) await service._remove(feature._id)
            } catch (error) {
                logger.debug('[KDK] reference count update failed: ', error)
            }
        }
    } else {
        const feature = await updateReferenceCount(service, context.id, -1)
        // Skip removing if still used
        if (feature.referenceCount <= 0) await service._remove(context.id)
        context.result = feature
    }
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

export async function intersectBBoxHook(context) {
    const params = context.params
    if (!_.has(params, 'east') || !_.has(params, 'west') || !_.has(params, 'north') || !_.has(params, 'south')) return context
    const service = context.service
    const query = await service._find(_.omit(params, ['east', 'west', 'north', 'south']))
    const features = query.data
    const bbox = [params.east, params.west, params.north, params.south]
    let result = []
    for (let feature of features) {
        const featurePolygon = _.get(feature, 'geometry.coordinates')
        var intersection = intersect(featureCollection([bbox, featurePolygon]));
        if (intersection) {
            result.push(feature)
        }
    }
    _.set(context, 'result.data', result)
}
