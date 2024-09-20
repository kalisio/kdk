import _ from 'lodash'

export function removeServerSideParameters(context) {
    _.unset(context, 'params.query.$locale')
    _.unset(context, 'params.query.$collation')
    _.unset(context, 'params.query.populate')
}
