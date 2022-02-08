import _ from 'lodash'
import i18next from 'i18next'
import * as math from 'mathjs'
import config from 'config'
import { Store } from './store'

// Default units organised by physical quantity
// Each key is the internal mathjs "identifier" of the unit
const length = {
  'm': {
    symbol: 'units.METER_SYMBOL',
    label: 'units.METER_LABEL'
  },
  'mi': {
    symbol: 'units.MILE_SYMBOL',
    label: 'units.MILE_LABEL'
  },
  'NM': {
    symbol: 'units.NAUTICAL_MILE_SYMBOL',
    label: 'units.NAUTICAL_MILE_LABEL',
    definition: '1852 m'
  }
}
const area = {
  'm^2': {
    symbol: 'units.SQUARED_METER_SYMBOL',
    label: 'units.SQUARED_METER_LABEL'
  },
  'km^2': {
    symbol: 'units.SQUARED_KILOMETER_SYMBOL',
    label: 'units.SQUARED_KILOMETER_LABEL'
  },
  'acre': {
    symbol: 'units.ACRE_SYMBOL',
    label: 'units.ACRE_LABEL'
  },
  'hectare': {
    symbol: 'units.HECTARE_SYMBOL',
    label: 'units.HECTARE_LABEL'
  }
}
const velocity = {
  'm/s': {
    symbol: 'units.METER_PER_SECOND_SYMBOL',
    label: 'units.METER_PER_SECOND_LABEL'
  },
  'km/h': {
    symbol: 'units.KILOMETER_PER_HOUR_SYMBOL',
    label: 'units.KILOMETER_PER_HOUR_LABEL'
  }, 
  'kt':{
    symbol: 'units.KNOT_SYMBOL',
    label: 'units.KNOT_LABEL',
    definition: '0.514444 m/s'
  }
}
const temperature = {
  'degC': {
    symbol: 'units.CELSIUS_SYMBOL',
    label: 'units.CELSIUS_LABEL'
  },
  'degF': {
    symbol: 'units.FAHRENHEIT_SYMBOL',
    label: 'units.FAHRENHEIT_LABEL'
  },
  'K': {
    symbol: 'units.KELVIN_SYMBOL',
    label: 'units.KELVIN_LABEL'
  }
}
const angle = {
  'deg': {
    symbol: 'units.DEGREE_SYMBOL',
    label: 'units.DEGREE_LABEL'
  },
  'rad': {
    symbol: 'units.RADIAN_SYMBOL',
    label: 'units.RADIAN_LABEL'
  }
}

const quantities = {
  length,
  area,
  velocity,
  temperature,
  angle
}

// Export singleton
export const Units = {
  
  initialize () {
    // Set the units object within the store
    Store.set('units', _.merge(config.units || {},
      quantities, {
      default: {
        length: 'm',
        area: 'm^2',
        velocity: 'm/s',
        temperature: 'degC',
        angle: 'deg',
        precision: 1
      }
    }))
    // Create units not defined by default in mathjs
    this.getQuantities().forEach(quantity => {
      const units = this.getUnits(quantity)
      units.forEach(unit => {
        if (unit.definition) math.createUnit(unit.name, _.omit(unit, ['label']))
      })
    })
  },
  get () {
    return Store.get('units')
  },
  getDefaultPrecision () {
    return Store.get('units.default.precision', 1)
  },
  getQuantities () {
    return _.keys(_.omit(this.get(), ['default']))
  },
  getUnits (quantity) {
    // Get units for a given quantity
    if (quantity) {
      const units = Store.get(`units.${quantity}`, {})
      return _.values(_.mapValues(units, (value, key) => Object.assign({ name: key, quantity }, value)))
    } else { // Or all units
      let units = []
      this.getQuantities().forEach(quantity => {
        units = units.concat(this.getUnits(quantity))
      })
      return units
    }
  },
  getUnit (unit) {
    return _.find(this.getUnits(), { name: unit })
  },
  getUnitSymbol (unit) {
    const definition = this.getUnit(unit)
    return (definition ? i18next.t(definition.symbol) : unit)
  },
  getDefaultUnit (quantityOrUnit) {
    // Check for quantity first
    let defaultUnit = Store.get(`units.default.${quantityOrUnit}`)
    // If not check by matching quantity based on given unit
    if (!defaultUnit) {
      const baseUnit = Units.getUnit(quantityOrUnit)
      // Get default unit for this quantity instead
      if (baseUnit) defaultUnit = Units.getDefaultUnit(baseUnit.quantity)
    }
    return defaultUnit
  },
  convert (value, sourceUnit, targetUnit) {
    if (sourceUnit === targetUnit) return value
    let n = math.unit(value, sourceUnit)
    n = n.toNumber(targetUnit)
    // Remap from [-180,+180[ to [0,360[ for angles
    n = (targetUnit === 'deg' ? (n < 0.0 ? n + 360.0 : n) : n)
    return n
  },
  format (value, sourceUnit, targetUnit, options = { symbol: true }) {
    // If target unit is not given use default one
    if (!targetUnit) targetUnit = this.getDefaultUnit(sourceUnit)
    const n = (targetUnit ? this.convert(value, sourceUnit, targetUnit) : value)
    let output = n.toFixed(options.precision || this.getDefaultPrecision())
    if (options.symbol) {
      output += ` ${targetUnit ? this.getUnitSymbol(targetUnit) : this.getUnitSymbol(sourceUnit)}`
    }
    return output
  }
}
