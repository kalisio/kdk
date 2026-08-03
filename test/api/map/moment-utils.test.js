/* eslint-disable no-unused-expressions */
import chai from 'chai'
import chailint from 'chai-lint'
import moment from 'moment'
import { getLayerMaxTime, getMeteoModelMaxTime } from '../../../map/common/moment-utils.js'

const { util, expect } = chai

describe('map:moment-utils', () => {
  before(() => {
    chailint(chai, util)
  })

  const now = moment.utc('2026-07-31T12:00:00Z')

  it('returns null when the layer declares no time bound', () => {
    expect(getLayerMaxTime({}, { now })).to.be.null
    expect(getLayerMaxTime({ name: 'forecast-layer' }, { now })).to.be.null
  })

  it('resolves a root-level "to" duration relative to now', () => {
    const maxTime = getLayerMaxTime({ to: 'PT-10M' }, { now })
    expect(maxTime.isSame(now.clone().subtract(10, 'minutes'))).to.be.true
  })

  it('resolves the max "to" across multiple time_based sources', () => {
    const layer = {
      time_based: {
        sources: [
          { to: 'PT-1H' },
          { to: 'PT-10M' }
        ]
      }
    }
    const maxTime = getLayerMaxTime(layer, { now })
    expect(maxTime.isSame(now.clone().subtract(10, 'minutes'))).to.be.true
  })

  it('is unbounded as soon as one time_based source has no "to"', () => {
    const layer = {
      time_based: {
        sources: [
          { to: 'PT-1H' },
          { from: 'P-1D' } // no 'to' => open-ended into the future
        ]
      }
    }
    expect(getLayerMaxTime(layer, { now })).to.be.null
  })

  it('combines a root "to" with time_based sources', () => {
    const layer = {
      to: 'PT-5M',
      time_based: { sources: [{ to: 'PT-1H' }] }
    }
    const maxTime = getLayerMaxTime(layer, { now })
    expect(maxTime.isSame(now.clone().subtract(5, 'minutes'))).to.be.true
  })

  it('treats an absolute ISO time as-is (not relative to now)', () => {
    const maxTime = getLayerMaxTime({ to: '2026-01-01T00:00:00Z' }, { now })
    expect(maxTime.isSame(moment.utc('2026-01-01T00:00:00Z'))).to.be.true
  })

  // Complex use case: an archive candidate bounded in the past and a live
  // weacast candidate extending the forecast horizon into the future, both scoped per model
  const meteoModelLayer = {
    meteo_model: {
      sources: [
        { model: 'gfs-world', from: 'P-10Y', to: 'PT-61M', geotiff: {} },
        { model: 'gfs-world', from: 'PT-1H', to: 'PT+864000S', weacast: {} }, // 10 day horizon
        { model: 'arome-france-high', from: 'PT-1H', to: 'PT+151200S', weacast: {} } // ~1.75 day horizon
      ]
    }
  }

  it('getMeteoModelMaxTime resolves the max "to" among sources matching the given model', () => {
    const maxTime = getMeteoModelMaxTime(meteoModelLayer, { now, model: { name: 'gfs-world' } })
    expect(maxTime.isSame(now.clone().add(864000, 'seconds'))).to.be.true
  })

  it('getMeteoModelMaxTime resolves a shorter horizon for a different model', () => {
    const maxTime = getMeteoModelMaxTime(meteoModelLayer, { now, model: { name: 'arome-france-high' } })
    expect(maxTime.isSame(now.clone().add(151200, 'seconds'))).to.be.true
  })

  it('getMeteoModelMaxTime returns null when no model is given or no source matches it', () => {
    expect(getMeteoModelMaxTime(meteoModelLayer, { now })).to.be.null
    expect(getMeteoModelMaxTime(meteoModelLayer, { now, model: { name: 'arpege-world' } })).to.be.null
  })

  it('getLayerMaxTime is unbounded for a meteo_model layer until a model is resolved', () => {
    expect(getLayerMaxTime(meteoModelLayer, { now })).to.be.null
  })

  it('getLayerMaxTime resolves the meteo_model bound once a model is given', () => {
    const maxTime = getLayerMaxTime(meteoModelLayer, { now, model: { name: 'gfs-world' } })
    expect(maxTime.isSame(now.clone().add(864000, 'seconds'))).to.be.true
  })

  it('getLayerMaxTime combines a meteo_model bound with a root/time_based bound, keeping the furthest one', () => {
    const layer = {
      to: 'PT-5M', // eg. an archive/measured fallback bound, well in the past
      meteo_model: meteoModelLayer.meteo_model
    }
    const maxTime = getLayerMaxTime(layer, { now, model: { name: 'gfs-world' } })
    expect(maxTime.isSame(now.clone().add(864000, 'seconds'))).to.be.true
  })

  // Sensor observations use case: 'to' only reflects typical/expected staleness, but 'queryFrom'
  // makes the actual query search backward from now for the latest available data,
  // so the layer should be treated as having data up to now, not just up to 'to'
  it('a "queryFrom" layer is treated as bounded by now rather than by its (more conservative) "to"', () => {
    const layer = { to: 'PT-10M', queryFrom: 'PT-1H' }
    const maxTime = getLayerMaxTime(layer, { now })
    expect(maxTime.isSame(now)).to.be.true
  })

  it('a "queryFrom" layer with no "to" at all is still treated as bounded by now', () => {
    const layer = { queryFrom: 'PT-1H' }
    const maxTime = getLayerMaxTime(layer, { now })
    expect(maxTime.isSame(now)).to.be.true
  })

  it('a "queryFrom" layer is still disabled once the selected time goes beyond now', () => {
    const layer = { to: 'PT-10M', queryFrom: 'PT-1H' }
    const maxTime = getLayerMaxTime(layer, { now })
    expect(now.clone().add(1, 'minute').isAfter(maxTime)).to.be.true
  })
})
