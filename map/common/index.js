// We faced a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
// We tested the workaround given here https://github.com/babel/babel/issues/2877#issuecomment-270700000 with success so far
import * as errors from './errors'
import * as permissions from './permissions'
import { gridSourceFactories, unitConverters } from './grid'
import { OpenDapGridSource } from './opendap-grid-source'
import { WcsGridSource } from './wcs-grid-source'
import { GeoTiffGridSource } from './geotiff-grid-source'
import { WeacastGridSource } from './weacast-grid-source'
import { MeteoModelGridSource } from './meteo-model-grid-source'
import { TimeBasedGridSource } from './time-based-grid-source'

export { errors }
export { permissions }

// register factories for known grid sources
gridSourceFactories[OpenDapGridSource.getKey()] = function (options) { return new OpenDapGridSource(options) }
gridSourceFactories[WcsGridSource.getKey()] = function (options) { return new WcsGridSource(options) }
gridSourceFactories[GeoTiffGridSource.getKey()] = function (options) { return new GeoTiffGridSource(options) }
gridSourceFactories[WeacastGridSource.getKey()] = function (options) { return new WeacastGridSource(options) }
gridSourceFactories[MeteoModelGridSource.getKey()] = function (options) { return new MeteoModelGridSource(options) }
gridSourceFactories[TimeBasedGridSource.getKey()] = function (options) { return new TimeBasedGridSource(options) }

unitConverters.kelvin2celsius = function (kelvin) { return kelvin - 273.15 }
