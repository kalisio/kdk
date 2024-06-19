import _ from 'lodash'
import { Units } from '../units.js'

export function convertData (data, valuePaths, sourceUnit, targetUnit) {
  if (!Array.isArray(valuePaths)) valuePaths = [valuePaths]
  _.forEach(data, document => {
    _.forEach(valuePaths, valuePath => {
      const value = _.get(document, valuePath)
      if (value) _.set(document, valuePath, Units.convert(value, sourceUnit, targetUnit))
    })
  })
}

export function convertTimeSerie (data, variable, valuePaths) {
  if (!Array.isArray(valuePaths)) valuePaths = [valuePaths]
  const unit = variable.unit
  if (unit) {
    const targetUnit = Units.getDefaultUnit(unit)
    convertData(data, valuePaths, unit, targetUnit)
    variable.unit = targetUnit
  }
}