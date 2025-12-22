// We faced a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
// We tested the workaround given here https://github.com/babel/babel/issues/2877#issuecomment-270700000 with success so far
import * as errors from './errors.js'
import * as permissions from './permissions.js'
import * as dap from './opendap-utils.js'
import * as grid from './grid.js'
import { gridSourceFactories, unitConverters } from './grid.js'
import { OpenDapGridSource } from './opendap-grid-source.js'
import { WcsGridSource } from './wcs-grid-source.js'
import { GeoTiffGridSource } from './geotiff-grid-source.js'
import { WeacastGridSource } from './weacast-grid-source.js'
import { MeteoModelGridSource } from './meteo-model-grid-source.js'
import { TimeBasedGridSource } from './time-based-grid-source.js'
import { KazarrGridSource } from './kazarr-grid-source.js'

export { errors }
export { permissions }
export { dap }
export { grid }

// register factories for known grid sources
gridSourceFactories[OpenDapGridSource.getKey()] = function (options) { return new OpenDapGridSource(options) }
gridSourceFactories[WcsGridSource.getKey()] = function (options) { return new WcsGridSource(options) }
gridSourceFactories[GeoTiffGridSource.getKey()] = function (options) { return new GeoTiffGridSource(options) }
gridSourceFactories[WeacastGridSource.getKey()] = function (options) { return new WeacastGridSource(options) }
gridSourceFactories[MeteoModelGridSource.getKey()] = function (options) { return new MeteoModelGridSource(options) }
gridSourceFactories[TimeBasedGridSource.getKey()] = function (options) { return new TimeBasedGridSource(options) }
gridSourceFactories[KazarrGridSource.getKey()] = function (options) { return new KazarrGridSource(options) }

unitConverters.kelvin2celsius = function (kelvin) { return kelvin - 273.15 }
