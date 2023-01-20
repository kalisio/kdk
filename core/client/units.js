import _ from 'lodash'
import * as math from 'mathjs'
import config from 'config'
import { i18n } from './i18n.js'
import { Store } from './store.js'

// Default units organised by physical quantity
// Each key is the internal mathjs "identifier" of the unit
const length = {
  m: {
    symbol: 'units.METER_SYMBOL',
    label: 'units.METER_LABEL'
  },
  mi: {
    symbol: 'units.MILE_SYMBOL',
    label: 'units.MILE_LABEL'
  },
  NM: {
    symbol: 'units.NAUTICAL_MILE_SYMBOL',
    label: 'units.NAUTICAL_MILE_LABEL',
    definition: '1852 m'
  }
}
const altitude = {
  m: {
    symbol: 'units.METER_SYMBOL',
    label: 'units.METER_LABEL'
  },
  ft: {
    symbol: 'units.FEET_SYMBOL',
    label: 'units.FEET_LABEL'
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
  acre: {
    symbol: 'units.ACRE_SYMBOL',
    label: 'units.ACRE_LABEL'
  },
  hectare: {
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
  kt: {
    symbol: 'units.KNOT_SYMBOL',
    label: 'units.KNOT_LABEL',
    definition: '0.514444 m/s'
  }
}
const temperature = {
  degC: {
    symbol: 'units.CELSIUS_SYMBOL',
    label: 'units.CELSIUS_LABEL'
  },
  degF: {
    symbol: 'units.FAHRENHEIT_SYMBOL',
    label: 'units.FAHRENHEIT_LABEL'
  },
  K: {
    symbol: 'units.KELVIN_SYMBOL',
    label: 'units.KELVIN_LABEL'
  }
}
const angle = {
  deg: {
    symbol: 'units.DEGREE_SYMBOL',
    label: 'units.DEGREE_LABEL'
  },
  rad: {
    symbol: 'units.RADIAN_SYMBOL',
    label: 'units.RADIAN_LABEL'
  }
}

const quantities = {
  length,
  altitude,
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
          altitude: 'm',
          area: 'm^2',
          velocity: 'm/s',
          temperature: 'degC',
          angle: 'deg',
          notation: 'auto',
          precision: 3
        }
      }))
    // Create units not defined by default in mathjs
    this.getQuantities().forEach(quantity => {
      this.createUnits(quantity)
    })
  },
  createUnits (quantity) {
    // Some units are defined according to existing base units
    // So that we need to create the later ones first
    const units = _.sortBy(this.getUnits(quantity), [(unit) => (unit.baseName ? 0 : 1)])
    // Create units not defined by default in mathjs
    units.forEach(unit => {
      // Check if already exist first
      if (math.Unit.isValuelessUnit(unit.name)) return
      // If it has any option required by mathjs to create a new unit then proceed
      if (unit.definition || unit.baseName) math.createUnit(unit.name, _.omit(unit, ['label']))
    })
  },
  get () {
    return Store.get('units')
  },
  getDefaultNotation () {
    return Store.get('units.default.notation', 'auto')
  },
  getDefaultPrecision () {
    return Store.get('units.default.precision', 3)
  },
  getQuantities () {
    return _.keys(_.omit(this.get(), ['default']))
  },
  setUnits (quantity, units) {
    Store.set(`units.${quantity}`, units)
    this.createUnits(quantity)
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
    return (definition ? i18n.t(definition.symbol) : unit)
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
  format (value, sourceUnit, targetUnit, options) {
    // If target unit is not given use default one
    if (!targetUnit) targetUnit = this.getDefaultUnit(sourceUnit)
    const n = (targetUnit ? this.convert(value, sourceUnit, targetUnit) : value)
    // Let options overrides defaults
    options = Object.assign({
      symbol: true,
      notation: this.getDefaultNotation(),
      precision: this.getDefaultPrecision(),
      lowerExp: -this.getDefaultPrecision(),
      upperExp: this.getDefaultPrecision()
    }, options)
    let output = math.format(n, options)
    if (options.symbol) {
      output += ` ${targetUnit ? this.getUnitSymbol(targetUnit) : this.getUnitSymbol(sourceUnit)}`
    }
    return output
  }
}
