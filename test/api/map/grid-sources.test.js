/* eslint-disable no-unused-expressions */
import chai from 'chai'
import chailint from 'chai-lint'
import _ from 'lodash'
import fs from 'fs'
import path, { dirname } from 'path'
import nock from 'nock'
import siftModule from 'sift'
import moment from 'moment'
import { memory } from '@feathersjs/memory'
import intersect from '@turf/intersect'
import { weacast } from '@weacast/core'
import { makeGridSource, extractGridSourceConfig } from '../../.././map/common/grid.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai
const sift = siftModule.default

// returns the required byte range of the given file
// range is the raw value of the 'range' http header
// the returned object contains the data, and the value
// for the 'content-range' response header
function readRange (file, range) {
  const [unit, value] = range.split('=')
  if (unit !== 'bytes') { return null }

  const [start, end] = value.split('-')
  const offset = parseInt(start)
  const size = parseInt(end) - offset
  const data = Buffer.alloc(size)
  const fd = fs.openSync(file, 'r')
  fs.readSync(fd, data, 0, size, offset)
  fs.closeSync(fd)
  return { data, range: `bytes ${offset}-${offset + size}/${size}` }
}

// checks that bboxa constains bboxb
// where bbox = [minLat, minLon, maxLat, maxLon]
function contains (bboxa, bboxb) {
  return bboxa[0] <= bboxb[0] && bboxa[1] <= bboxb[1] && bboxa[2] >= bboxb[2] && bboxa[3] >= bboxb[3]
}

describe('map:grid-source', () => {
  let source
  let sourceConfig

  before(() => {
    chailint(chai, util)
  })

  describe('wcs', () => {
    const wcsOptions = {
      wcs: {
        url: 'http://kMap.test/wcs',
        version: '1.0.0',
        coverage: 'dummy'
      }
    }

    it('is possible to create a WCS source from makeGridSource', () => {
      const [key, conf] = extractGridSourceConfig(wcsOptions)
      source = makeGridSource(key)
      expect(source).to.exist
      expect(conf).to.deep.equal(wcsOptions.wcs)
      sourceConfig = conf
    })

    it('setup correctly', async () => {
      nock('http://kMap.test')
        .get('/wcs')
        .query({ SERVICE: 'WCS', VERSION: '1.0.0', REQUEST: 'DescribeCoverage', COVERAGE: wcsOptions.wcs.coverage })
        .replyWithFile(200, path.join(__dirname, '/data/DescribeCoverage.xml'))

      await source.setup(sourceConfig)
      const bbox = source.getBBox()
      expect(bbox[0]).to.be.closeTo(-60.009, 0.001)
      expect(bbox[1]).to.be.closeTo(-180.009, 0.001)
      expect(bbox[2]).to.be.closeTo(60.009, 0.01)
      expect(bbox[3]).to.be.closeTo(180.009, 0.01)
    })

    it('returns an appropriate grid when requesting data', async () => {
      nock('http://kMap.test')
        .get('/wcs')
        .query(true)
        .replyWithFile(200, path.join(__dirname, '/data/GetCoverage.tif'), { 'Content-Type': 'image/tiff' })

      const fetchBBox = [-10, -10, 10, 10]
      const fetchRes = [0.15, 0.15]
      const grid = await source.fetch(null, fetchBBox, fetchRes)
      const bbox = grid.getBBox()
      expect(bbox).to.satisfy((bbox) => contains(bbox, fetchBBox))
    })
  })

  describe('opendap', () => {
    const opendapOptions = {
      opendap: {
        url: 'http://kMap.test/dataset.grb',
        variable: 'Temperature_height_above_ground',
        dimensionsAsIndices: { time: 0, height_above_ground: 0 },
        latitude: 'lat',
        longitude: 'lon'
      }
    }

    it('is possible to create an OPeNDAP source from makeGridSource', () => {
      const [key, conf] = extractGridSourceConfig(opendapOptions)
      source = makeGridSource(key)
      expect(source).to.exist
      expect(conf).to.deep.equal(opendapOptions.opendap)
      sourceConfig = conf
    })

    it('setup correctly', async () => {
      nock('http://kMap.test')
      // whole dataset dds
        .get('/dataset.grb.dds')
        .replyWithFile(200, path.join(__dirname, '/data/dataset.grb.dds'))
      // whole dataset das
        .get('/dataset.grb.das')
        .replyWithFile(200, path.join(__dirname, '/data/dataset.grb.das'))
      // request made to fetch min/max lat/lon
        .get(uri => uri.includes('?lat'))
        .replyWithFile(200, path.join(__dirname, '/data/lat_lon_bounds.grb.dods'))
      // fetching data
        .get('/dataset.grb.dods')
        .query(true)
        .replyWithFile(200, path.join(__dirname, '/data/dataset.grb.dods'))

      await source.setup(sourceConfig)
      const bbox = source.getBBox()
      expect(bbox[0]).to.be.closeTo(-90, 0.001)
      expect(bbox[1]).to.be.closeTo(-180, 0.001)
      expect(bbox[2]).to.be.closeTo(90, 0.001)
      expect(bbox[3]).to.be.closeTo(180, 0.001)
    })

    it('returns an appropriate grid when requesting data', async () => {
      nock('http://kMap.test')
        .get('/dataset.grb.dods')
        .query(true)
        .replyWithFile(200, path.join(__dirname, '/data/subdataset.grb.dods'))

      const fetchBBox = [-10, -10, 10, 10]
      const fetchRes = [0.15, 0.15]
      const grid = await source.fetch(null, fetchBBox, fetchRes)
      const bbox = grid.getBBox()
      expect(bbox).to.satisfy((bbox) => contains(bbox, fetchBBox))
    })
  })

  describe('geotiff', () => {
    const geotiffOptions = {
      geotiff: {
        url: 'http://kMap.test/data.tif',
      }
    }

    it('is possible to create a GeoTiff source from makeGridSource', () => {
      const [key, conf] = extractGridSourceConfig(geotiffOptions)
      source = makeGridSource(key)
      expect(source).to.exist
      expect(conf).to.deep.equal(geotiffOptions.geotiff)
      sourceConfig = conf
    })

    it('setup correctly', async () => {
      nock('http://kMap.test')
        .get('/data.tif')
        .reply(function (uri, requestBody) {
          const res = readRange(path.join(__dirname, '/data/GetCoverage.tif'), this.req.headers.range)
          if (res.data) return [206, res.data, { 'content-range': res.range }]
          return [404]
        })

      await source.setup(sourceConfig)
      const bbox = source.getBBox()
      expect(bbox[0]).to.be.closeTo(-10, 0.001)
      expect(bbox[1]).to.be.closeTo(-10, 0.001)
      expect(bbox[2]).to.be.closeTo(10, 0.001)
      expect(bbox[3]).to.be.closeTo(10, 0.001)
    })

    it('returns an appropriate grid when requesting data', async () => {
      nock('http://kMap.test')
        .get('/data.tif')
        .reply(function (uri, requestBody) {
          const res = readRange(path.join(__dirname, '/data/GetCoverage.tif', this.req.headers.range))
          if (res.data) return [206, res.data, { 'content-range': res.range }]
          return [404]
        })

      const fetchBBox = [-5, -5, 5, 5]
      const fetchRes = [0.15, 0.15]
      const grid = await source.fetch(null, fetchBBox, fetchRes)
      const bbox = grid.getBBox()
      expect(bbox).to.satisfy((bbox) => contains(bbox, fetchBBox))
    })
  })

  describe('weacast', () => {
    const model = { name: 'gfs-world', interval: 3 * 3600, bounds: [0, -90, 360, 90], origin: [0, 90], tileResolution: [20, 20] }
    const element = { name: 'gust' }
    const service = `${model.name}/${element.name}`
    const weacastOptions = {
      weacast: {
        element: element.name,
        model: model.name,
        forecastTime: '2019-01-04T01:25:00.000Z',
        useCache: false
      }
    }

    const store = {
      // Raw data
      0: {
        forecastTime: moment.utc('2019-01-04T00:00:00.000Z').toDate(),
        minValue: -20,
        maxValue: 20,
        data: new Array(720 * 361).fill(0)
      },
      // Tiles
      1: {
        forecastTime: moment.utc('2019-01-04T00:00:00.000Z').toDate(),
        minValue: -5,
        maxValue: 20,
        data: new Array(40 * 40).fill(0),
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 70], [20, 70], [20, 90], [0, 90], [0, 70]]]
        },
        x: 0,
        y: 0,
        bounds: [0, 70, 20, 90],
        size: [40, 40]
      },
      2: {
        forecastTime: moment.utc('2019-01-04T00:00:00.000Z').toDate(),
        minValue: -20,
        maxValue: 5,
        data: new Array(40 * 40).fill(1),
        geometry: {
          type: 'Polygon',
          coordinates: [[[20, 70], [40, 70], [40, 90], [20, 90], [20, 70]]]
        },
        x: 0,
        y: 0,
        bounds: [20, 70, 40, 90],
        size: [40, 40]
      }
    }

    it('initialize Weacast API mock', async () => {
      // Add geospatial operator to sift
      const matcher = (query) => sift(query, {
        expressions: {
          $geoIntersects: function (query, value) {
            const polygon1 = _.get(query, '$geometry')
            const polygon2 = value
            if (!polygon1 || !polygon2) return false
            return intersect(polygon1, polygon2)
          }
        }
      })
      const weacastApi = weacast()
      weacastApi.models = [model]
      await weacastApi.createElementService(model, element,
        memory({ store, matcher, multi: true, operators: ['$exists', '$geoIntersects', '$geometry'] }))
      const elementService = weacastApi.getService(service)
      expect(elementService).toExist()
      weacastOptions.weacastApi = weacastApi
    })

    it('is possible to create a Weacast source from makeGridSource', () => {
      const [key, conf] = extractGridSourceConfig(weacastOptions)
      source = makeGridSource(key, { weacastApi: weacastOptions.weacastApi })
      expect(source).to.exist
      expect(conf).to.deep.equal(weacastOptions.weacast)
      sourceConfig = conf
    })

    it('setup correctly', async () => {
      await source.setup(sourceConfig)
      const bbox = source.getBBox()
      expect(bbox[0]).to.be.equal(-90.0)
      expect(bbox[1]).to.be.equal(-180.0)
      expect(bbox[2]).to.be.equal(90.0)
      expect(bbox[3]).to.be.equal(180.0)
      const minmax = source.getDataBounds()
      expect(minmax).to.deep.equal([-20, 20])
    })

    it('returns an appropriate grid when requesting data', async () => {
      const fetchBBox = [80, 10, 85, 30]
      const fetchRes = [0.5, 0.5]
      const grid = await source.fetch(null, fetchBBox, fetchRes)
      const bbox = grid.getBBox()
      expect(bbox).to.satisfy((bbox) => contains(bbox, fetchBBox))
      // Check tiles are correctly managed
      let value = grid.getValue(20, 20)
      expect(value).to.be.equal(0)
      value = grid.getValue(20, 60)
      expect(value).to.be.equal(1)
    })
  })

  after(() => {
    // Nothing to clean up
  })
})
