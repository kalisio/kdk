import _ from 'lodash'
import logger from 'loglevel'
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
  'mi/h': {
    symbol: 'units.MILES_PER_HOUR_SYMBOL',
    label: 'units.MILES_PER_HOUR_LABEL'
  },
  kt: {
    symbol: 'units.KNOT_SYMBOL',
    label: 'units.KNOT_LABEL',
    definition: '0.514444 m/s',
    override: true // because kt can be kilo ton :(
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
const fraction = {
  ppm: {
    symbol: 'units.PPM_SYMBOL',
    label: 'units.PPM_LABEL'
  }
}
const density = {
  'ug/m^3': {
    symbol: 'units.MICROGRAM_PER_M3_SYMBOL',
    label: 'units.MICROGRAM_PER_M3_LABEL'
  }
}
const volumeVelocity = {
  'm^3/s': {
    symbol: 'units.CUBIC_METER_PER_SECOND_SYMBOL',
    label: 'units.CUBIC_METER_PER_SECOND_LABEL'
  }
}
const radioactivity = {
  bq: {
    symbol: 'units.BEQUEREL_SYMBOL',
    label: 'units.BEQUEREL_LABEL',
    baseName: 'radioactivity'
  }
}
const radioactivityDensity = {
  'bq/m^2': {
    symbol: 'units.BEQUEREL_PER_M2_SYMBOL',
    label: 'units.BEQUEREL_PER_M2_LABEL'
  },
  'bq/m^3': {
    symbol: 'units.BEQUEREL_PER_M3_SYMBOL',
    label: 'units.BEQUEREL_PER_M3_LABEL'
  }
}
const equivalentDose = {
  sv: {
    symbol: 'units.SIEVERT_SYMBOL',
    label: 'units.SIEVERT_LABEL',
    baseName: 'equivalentDose',
    aliases: ['sievert']
  },
  msv: {
    symbol: 'units.MILLISIEVERT_SYMBOL',
    label: 'units.MILLISIEVERT_LABEL',
    definition: '0.001 sv'
  },
  usv: {
    symbol: 'units.MICROSIEVERT_SYMBOL',
    label: 'units.MICROSIEVERT_LABEL',
    definition: '0.000001 sv'
  },
  nsv: {
    symbol: 'units.NANOSIEVERT_SYMBOL',
    label: 'units.NANOSIEVERT_LABEL',
    definition: '0.000000001 sv'
  }
}
const equivalentDoseRate = {
  svs: {
    symbol: 'units.SIEVERT_PER_SECOND_SYMBOL',
    label: 'units.SIEVERT_PER_SECOND_LABEL',
    baseName: 'equivalentDoseRate'
  },
  msvs: {
    symbol: 'units.MILLISIEVERT_PER_SECOND_SYMBOL',
    label: 'units.MILLISIEVERT_PER_SECOND_LABEL',
    definition: '0.001 svs'
  },
  usvs: {
    symbol: 'units.MICROSIEVERT_PER_SECOND_SYMBOL',
    label: 'units.MICROSIEVERT_PER_SECOND_LABEL',
    definition: '0.000001 svs'
  },
  nsvs: {
    symbol: 'units.NANOSIEVERT_PER_SECOND_SYMBOL',
    label: 'units.NANOSIEVERT_PER_SECOND_LABEL',
    definition: '0.000000001 svs'
  },
  svh: {
    symbol: 'units.SIEVERT_PER_HOUR_SYMBOL',
    label: 'units.SIEVERT_PER_HOUR_LABEL',
    definition: '0.000277778 svs'
  },
  msvh: {
    symbol: 'units.MILLISIEVERT_PER_HOUR_SYMBOL',
    label: 'units.MILLISIEVERT_PER_HOUR_LABEL',
    definition: '0.000000277778 svs'
  },
  usvh: {
    symbol: 'units.MICROSIEVERT_PER_HOUR_SYMBOL',
    label: 'units.MICROSIEVERT_PER_HOUR_LABEL',
    definition: '0.000000000277778 svs'
  },
  nsvh: {
    symbol: 'units.NANOSIEVERT_PER_HOUR_SYMBOL',
    label: 'units.NANOSIEVERT_PER_HOUR_LABEL',
    definition: '0.000000000000277778 svs'
  }
}

const quantities = {
  length,
  altitude,
  area,
  velocity,
  temperature,
  angle,
  fraction,
  density,
  volumeVelocity,
  radioactivity,
  radioactivityDensity,
  equivalentDose,
  equivalentDoseRate
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
          radioactivity: 'bq',
          equivalentDose: 'usv',
          equivalentDoseRate: 'usvh',
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
      if (math.Unit.isValuelessUnit(unit.name)) {
        // Maybe we'd like to override it
        if (!unit.override) return
      }
      // If it has any option required by mathjs to create a new unit then proceed
      if (unit.definition || unit.baseName) {
        math.createUnit(unit.name, _.omit(unit, ['label', 'override']), { override: _.get(unit, 'override', false) })
      }
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
  // Get unit definition by name
  getUnit (unit) {
    return _.find(this.getUnits(), { name: unit })
  },
  // Get unit symbol by unit name
  getUnitSymbol (unit) {
    const definition = this.getUnit(unit)
    return (definition ? i18n.tie(definition.symbol) : unit)
  },
  // Get default unit definition (if any) for a given quantity/unit name
  getDefaultUnit (quantityOrUnit) {
    // Check for quantity first
    let defaultUnit = Store.get(`units.default.${quantityOrUnit}`)
    // If not check by matching quantity based on given unit
    if (!defaultUnit) {
      const baseUnit = this.getUnit(quantityOrUnit)
      // Get default unit for this quantity instead
      if (baseUnit) defaultUnit = this.getDefaultUnit(baseUnit.quantity)
    }
    return defaultUnit
  },
  setDefaultUnit (quantity, unit) {
    Store.set(`units.default.${quantity}`, unit)
  },
  // Get symbol of default unit (if any) for a given quantity/unit name
  getDefaultUnitSymbol (quantityOrUnit) {
    return this.getUnitSymbol(this.getDefaultUnit(quantityOrUnit))
  },
  // Get target unit for a source unit, will be default unit (if any) or source unit
  getTargetUnit (sourceUnit) {
    return this.getDefaultUnit(sourceUnit) || sourceUnit
  },
  // Get target unit symbol for a source unit, will be default unit symbol (if any) or source unit symbol
  getTargetUnitSymbol (sourceUnit) {
    return this.getUnitSymbol(this.getTargetUnit(sourceUnit))
  },
  // Convert between units by names
  // If target unit is not specified will use default unit (if any) for source unit
  convert (value, sourceUnit, targetUnit) {
    if (_.isNil(value)) {
      logger.warn('[KDK] cannont convert a nil value')
      return
    } 
    if (value === Number.MIN_VALUE || value === Number.MAX_VALUE) return value
    // If target unit is same as source unit does nothing
    if (targetUnit === sourceUnit) return value
    // If target unit is not given use default one
    if (!targetUnit) targetUnit = this.getDefaultUnit(sourceUnit)
    // Check if the target unit does exist
    if (!targetUnit) return value
    // Check if the source unit does exist
    if (!math.Unit.isValuelessUnit(sourceUnit)) return value
    let n = math.unit(value, sourceUnit)
    n = n.toNumber(targetUnit)
    // Remap from [-180,+180[ to [0,360[ for angles
    n = (targetUnit === 'deg' ? (n < 0.0 ? n + 360.0 : n) : n)
    return n
  },
  // Format display of source value in target unit, converting from source unit
  // If target unit is not specified will use default unit (if any) for source unit
  // options are mathjs format options
  format (value, sourceUnit, targetUnit, options) {
    if (_.isNil(value)) {
      logger.warn('[KDK] cannot format a nil value')
      return
    }
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
