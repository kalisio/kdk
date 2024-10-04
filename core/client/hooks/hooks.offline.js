import _ from 'lodash'

export function removeServerSideParameters(context) {
    const params = context.params
    _.unset(params, 'query.$locale')
    _.unset(params, 'query.$collation')
    _.unset(params, 'query.populate')
    if (_.has(params, 'query.upsert')) {
        _.set(params, 'upsert', _.get(params, 'query.upsert'))
        _.unset(params, 'query.upsert')
    }
}
