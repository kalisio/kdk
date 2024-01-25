import _ from 'lodash'
import { utils as kdkCoreUtils } from '../../../../core/client/index.js'

export function getTextTable (properties) {
  properties = kdkCoreUtils.dotify(properties)
  properties = _.pickBy(properties, value => !_.isNil(value))
  const keys = _.keys(properties)
  let text
  if (keys.length === 0) return null
  else if (keys.length === 1) text = _.get(properties, keys[0])
  else {
    text = keys
      .map(key => key + ': ' + _.get(properties, key))
      .join('\n')
  }
  return text
}