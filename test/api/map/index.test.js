import utility from 'util'
import chai from 'chai'
import chailint from 'chai-lint'
import _ from 'lodash'
import moment from 'moment'
import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import core, { kdk, hooks, permissions } from '../../../core/api/index.js'
import map, {
  permissions as mapPermissions, createFeaturesService, createCatalogService
} from '../../../map/api/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { util, expect } = chai

describe('map:services', () => {
  let app, server, port, // baseUrl,
    userService, userObject, catalogService, defaultLayers,
    zones, zonesService, vigicruesStationsService, nbStations, vigicruesObsService,
    adsbObsService, items, eventListeners, eventCount, eventData

  function eventsOn (service) {
    eventListeners = {}
    eventCount = {
      created: 0,
      updated: 0,
      patched: 0,
      removed: 0
    }
    eventData = {}
    _.forOwn(eventCount, (value, key) => {
      eventListeners[key] = countEvents(key)
      service.on(key, eventListeners[key])
    })
  }
  function eventsOff (service) {
    _.forOwn(eventCount, (value, key) => {
      service.off(key, eventListeners[key])
    })
  }
  function countEvents (event) {
    return function (data) {
      eventCount[event]++
      eventData[event] = data
    }
  }
  function getEventCount (event) {
    return eventCount[event]
  }
  function getEventData (event) {
    return eventData[event]
  }

  before(() => {
    chailint(chai, util)

    // Register all default hooks for authorisation
    // Default rules for all users
    permissions.defineAbilities.registerHook(permissions.defineUserAbilities)
    // Then rules for maps
    permissions.defineAbilities.registerHook(mapPermissions.defineUserAbilities)

    app = kdk()
    // Register authorisation/log hook
    app.hooks({
      before: { all: [hooks.authorise] },
      error: { all: hooks.log }
    })
    port = app.get('port')
    // baseUrl = `http://localhost:${port}${app.get('apiPath')}`
    return app.db.connect()
  })

  it('is ES module compatible', () => {
    expect(typeof map).to.equal('function')
  })

  it('registers the services', async () => {
    await app.configure(core)
    userService = app.getService('users')
    expect(userService).toExist()
    await app.configure(map)
    // Create a global catalog service
    await createCatalogService.call(app)
    catalogService = app.getService('catalog')
    expect(catalogService).toExist()
    // Now app is configured launch the server
    server = await app.listen(port)
    await new Promise(resolve => server.once('listening', () => resolve()))
  })
  // Let enough time to process
    .timeout(5000)

  it('creates a test user', async () => {
    userObject = await userService.create({ email: 'test-user@test.org', name: 'test-user' }, { checkAuthorisation: true })
    const users = await userService.find({ query: { 'profile.name': 'test-user' }, user: userObject, checkAuthorisation: true })
    expect(users.data.length > 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('registers the default layer catalog', async () => {
    const layers = await fs.readJson(path.join(__dirname, 'config/layers.json'))
    expect(layers.length > 0)
    // Create a global catalog service
    defaultLayers = await catalogService.create(layers)
    expect(defaultLayers.length > 0)
  })

  it('create and feed the zones service', async () => {
    // Create the service
    const zonesLayer = _.find(defaultLayers, { name: 'zones' })
    expect(zonesLayer).toExist()
    expect(zonesLayer.service === 'zones').beTrue()
    await createFeaturesService.call(app, {
      collection: zonesLayer.service,
      featureId: zonesLayer.featureId
    })
    zonesService = app.getService(zonesLayer.service)
    expect(zonesService).toExist()
    // Ensure the spatial index
    const indexes = await zonesService.Model.indexes()
    expect(indexes.find(index => index.key.geometry)).toExist()
    // Check for events
    eventsOn(zonesService)
    // Feed the collection
    zones = fs.readJsonSync(path.join(__dirname, 'data/zones.json')).features
    items = await zonesService.create(zones)
  })
  // Let enough time to process
    .timeout(5000)

  it('upsert data in zones service', async () => {
    const result = await zonesService.patch(null, {
      type: 'Feature',
      id: 100,
      geometry: zones[0].geometry,
      properties: {
        'OBJECTID': 100
      }
    }, { query: { id: 100, upsert: true } })
    const feature = result[0]
    expect(feature._id).toExist()
    expect(feature.geometry).toExist()
    expect(feature.properties).toExist()
    expect(feature.properties.OBJECTID).to.equal(100)
  })
  // Let enough time to process
    .timeout(5000)

  it('the zones service should skip events and siplify result', async () => {
    // By default multi events are skipped and result simplified
    eventsOff(zonesService)
    expect(getEventCount('created')).to.equal(0)
    items.forEach(item => {
      expect(item._id).toExist()
      expect(item.geometry).beUndefined()
      expect(item.properties).beUndefined()
    })
    // But not on single item
    expect(getEventCount('patched')).to.equal(1)
    const payload = getEventData('patched')
    expect(payload._id).toExist()
    expect(payload.geometry).toExist()
    expect(payload.properties).toExist()
    expect(payload.properties.OBJECTID).to.equal(100)
  })

  it('performs spatial filtering on zones service', async () => {
    let result = await zonesService.find({
      query: { longitude: 3.56, latitude: 48.53 },
      paginate: false
    })
    expect(result.features.length).to.equal(1)
    result = await zonesService.find({
      query: { longitude: 3.50, latitude: 48.54 },
      paginate: false
    })
    expect(result.features.length).to.equal(0)
    result = await zonesService.find({
      query: { south: 44, north: 44.9, east: 4.7, west: 1.66 },
      paginate: false
    })
    expect(result.features.length).to.equal(2)
    result = await zonesService.find({
      query: { south: 44, north: 44.9, east: 4, west: 2 },
      paginate: false
    })
    expect(result.features.length).to.equal(0)
  })
  // Let enough time to process
    .timeout(5000)

  it('create and feed the vigicrues stations service', async () => {
    // Create the service
    const vigicruesStationsLayer = _.find(defaultLayers, { name: 'vigicrues-stations' })
    expect(vigicruesStationsLayer).toExist()
    expect(vigicruesStationsLayer.service === 'vigicrues-stations').beTrue()
    await createFeaturesService.call(app, {
      collection: vigicruesStationsLayer.service,
      featureId: vigicruesStationsLayer.featureId,
      featureLabel: vigicruesStationsLayer.featureLabel
    })
    vigicruesStationsService = app.getService(vigicruesStationsLayer.service)
    expect(vigicruesStationsService).toExist()
    // Feed the collection
    const stations = fs.readJsonSync(path.join(__dirname, 'data/vigicrues.stations.json')).features
    nbStations = stations.length
    await vigicruesStationsService.create(stations)
  })
  // Let enough time to process
    .timeout(5000)

  it('create and feed the vigicrues observations service', async () => {
    // Create the service
    const vigicruesObsLayer = _.find(defaultLayers, { name: 'vigicrues-observations' })
    expect(vigicruesObsLayer).toExist()
    expect(vigicruesObsLayer.service === 'vigicrues-observations').beTrue()
    await createFeaturesService.call(app, {
      collection: vigicruesObsLayer.service,
      featureId: vigicruesObsLayer.featureId,
      featureLabel: vigicruesObsLayer.featureLabel,
      variables: vigicruesObsLayer.variables,
      // Raise simplified events
      skipEvents: ['updated'],
      simplifyEvents: ['created', 'patched', 'removed']
    })
    vigicruesObsService = app.getService(vigicruesObsLayer.service)
    expect(vigicruesObsService).toExist()
    // Check for events
    eventsOn(vigicruesObsService)
    // Feed the collection
    const observations = fs.readJsonSync(path.join(__dirname, 'data/vigicrues.observations.json'))
    await vigicruesObsService.create(observations)
  })
  // Let enough time to process
    .timeout(5000)

  it('search on the vigicrues stations service', async () => {
    // Fuzzy search
    let result = await vigicruesStationsService.find({ query: { 'properties.LbStationH': { $search: 'Châtel' } }, paginate: false })
    expect(result.features).toExist()
    expect(result.features.length).to.equal(2)
    // Diacritic search
    result = await vigicruesStationsService.find({ query: { 'properties.LbStationH': { $search: 'Chatel' } }, paginate: false })
    expect(result.features.length).to.equal(2)
    // Distinct search
    result = await vigicruesStationsService.find({ query: { $distinct: 'properties.LbStationH' } })
    expect(result.length).to.equal(nbStations)
  })
  // Let enough time to process
    .timeout(5000)

  it('the vigicrues observations should send simplified events', async () => {
    const min = moment.utc('2018-10-22T22:00:00.000Z')
    const max = moment.utc('2018-11-23T08:06:00.000Z')
    const start = min
    const end = moment.utc('2018-10-23T00:00:00.000Z')
    await vigicruesObsService.patch(null, { 'properties.ProjCoord': 27 }, { query: { time: { $gte: start, $lte: end } } })
    await vigicruesObsService.remove(null, { query: { 'properties.ProjCoord': 27 } })
    // Check for simplified events
    eventsOff(vigicruesObsService)
    expect(getEventCount('created')).to.equal(1)
    let payload = getEventData('created')
    expect(payload.data).beUndefined()
    expect(payload.total).to.equal(1344)
    expect(payload.query).to.deep.equal({})
    expect(payload.startTime).toExist()
    expect(payload.endTime).toExist()
    expect(payload.startTime.format()).to.equal(start.format())
    expect(payload.endTime.format()).to.equal(max.format())
    expect(payload.bbox).to.deep.equal([7.426402, 48.633727, 7.426402, 48.633727])
    expect(payload.layers).to.deep.equal([])
    expect(getEventCount('patched')).to.equal(1)
    payload = getEventData('patched')
    expect(payload.data).to.deep.equal({ 'properties.ProjCoord': 27 })
    expect(payload.total).to.equal(3)
    const gte = _.get(payload, 'query.time.$gte')
    expect(gte).toExist()
    expect(gte.format()).to.equal(start.format())
    const lte = _.get(payload, 'query.time.$lte')
    expect(lte).toExist()
    expect(lte.format()).to.equal(end.format())
    expect(payload.startTime).toExist()
    expect(payload.endTime).toExist()
    expect(payload.startTime.format()).to.equal(start.format())
    expect(payload.endTime.format()).to.equal(end.format())
    expect(payload.bbox).to.deep.equal([7.426402, 48.633727, 7.426402, 48.633727])
    expect(payload.layers).to.deep.equal([])
    expect(getEventCount('removed')).to.equal(1)
    payload = getEventData('removed')
    expect(payload.data).beUndefined()
    expect(payload.total).to.equal(3)
    expect(payload.query).to.deep.equal({ 'properties.ProjCoord': 27 })
    expect(payload.startTime).toExist()
    expect(payload.endTime).toExist()
    expect(payload.startTime.format()).to.equal(start.format())
    expect(payload.endTime.format()).to.equal(end.format())
    expect(payload.bbox).to.deep.equal([7.426402, 48.633727, 7.426402, 48.633727])
    expect(payload.layers).to.deep.equal([])
  })

  it('create and feed the ADS-B observations service', async () => {
    // Create the service
    const adsbObsLayer = _.find(defaultLayers, { name: 'adsb-observations' })
    expect(adsbObsLayer).toExist()
    expect(adsbObsLayer.service === 'adsb-observations').beTrue()
    await createFeaturesService.call(app, {
      collection: adsbObsLayer.service,
      featureId: adsbObsLayer.featureId,
      variables: adsbObsLayer.variables
    })
    adsbObsService = app.getService(adsbObsLayer.service)
    expect(adsbObsService).toExist()
    // Feed the collection
    const observations = fs.readJsonSync(path.join(__dirname, 'data/adsb.observations.json'))
    await adsbObsService.create(observations)
  })
  // Let enough time to process
    .timeout(5000)

  it('performs spatial filtering on vigicrues stations service', async () => {
    let result = await vigicruesStationsService.find({
      query: { south: -90, north: 90, east: 180, west: -180 },
      paginate: false
    })
    expect(result.features.length).to.equal(nbStations)
    result = await vigicruesStationsService.find({
      query: { south: 80, north: 85, east: 180, west: -180 },
      paginate: false
    })
    expect(result.features.length).to.equal(0)
    result = await vigicruesStationsService.find({
      query: { south: -85, north: -80, east: 180, west: -180 },
      paginate: false
    })
    expect(result.features.length).to.equal(0)
    result = await vigicruesStationsService.find({
      query: { south: -20, north: 20, east: 100, west: -100 },
      paginate: false
    })
    expect(result.features.length).to.equal(0)
    result = await vigicruesStationsService.find({
      query: {
        geometry: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [6.39, 48.31]
            },
            $maxDistance: 100000 // 100 Kms around
          }
        }
      },
      paginate: false
    })
    expect(result.features.length > 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('performs value filtering on vigicrues observations service', async () => {
    const result = await vigicruesObsService.find({
      query: {
        'properties.H': { $gt: 0.33, $lt: 0.5 }
      }
    })
    expect(result.features.length > 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('performs temporal filtering on vigicrues observations service', async () => {
    const result = await vigicruesObsService.find({
      query: {
        time: {
          $gte: new Date('2018-11-08T18:00:00').toISOString(),
          $lte: new Date('2018-11-08T22:00:00').toISOString()
        }
      }
    })
    expect(result.features.length > 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  const aggregationQuery = {
    time: {
      $gte: new Date('2018-11-08T18:00:00Z').toISOString(),
      $lte: new Date('2018-11-08T22:00:00Z').toISOString()
    },
    'properties.CdStationH': 'A282000101',
    $groupBy: 'CdStationH',
    $aggregate: ['H']
  }

  it('performs element aggregation on vigicrues observations service', async () => {
    const result = await vigicruesObsService.find({
      query: Object.assign({}, aggregationQuery)
    })
    expect(result.features.length).to.equal(1)
    const feature = result.features[0]
    expect(feature.time).toExist()
    expect(feature.time.H).toExist()
    expect(feature.time.H.length === 5).beTrue()
    expect(feature.time.H[0].isBefore(feature.time.H[1])).beTrue()
    expect(feature.properties.H.length === 5).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('performs sorted element aggregation on vigicrues observations service', async () => {
    const result = await vigicruesObsService.find({
      query: Object.assign({ $sort: { time: -1 } }, aggregationQuery)
    })
    expect(result.features.length).to.equal(1)
    const feature = result.features[0]
    expect(feature.time).toExist()
    expect(feature.time.H).toExist()
    expect(feature.time.H.length === 5).beTrue()
    expect(feature.time.H[0].isAfter(feature.time.H[1])).beTrue()
    expect(feature.properties.H.length === 5).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('performs sorted single element aggregation on vigicrues observations service', async () => {
    const result = await vigicruesObsService.find({
      query: Object.assign({ $sort: { time: -1 }, $limit: 1 }, aggregationQuery)
    })
    expect(result.features.length).to.equal(1)
    const feature = result.features[0]
    expect(feature.time).toExist()
    expect(feature.time.H).toExist()
    expect(feature.time.H.isValid()).beTrue()
    expect(feature.properties.H).toExist()
    expect(typeof feature.properties.H).to.equal('number')
    expect(feature.properties.H).to.equal(0.38)
  })
  // Let enough time to process
    .timeout(5000)

  it('performs custom element aggregation on vigicrues observations service', async () => {
    const result = await vigicruesObsService.find({
      query: Object.assign({ $sort: { time: -1 }, $limit: 1, $group: { maxH: { $max: '$properties.H' } } }, aggregationQuery)
    })
    expect(result.features.length).to.equal(1)
    const feature = result.features[0]
    expect(feature.time).toExist()
    expect(feature.time.H).toExist()
    expect(feature.time.H.isValid()).beTrue()
    expect(feature.properties.H).toExist()
    expect(typeof feature.properties.H).to.equal('number')
    expect(feature.properties.H).to.equal(0.38)
    expect(feature.properties.maxH).toExist()
    expect(typeof feature.properties.maxH).to.equal('number')
    expect(feature.properties.maxH).to.equal(0.39)
  })
  // Let enough time to process
    .timeout(5000)

  it('performs geometry aggregation on ADS-B observations service', async () => {
    const aggregationQuery = {
      time: {
        $lte: new Date('2019-01-04T13:58:54.767Z').toISOString()
      },
      'properties.icao': '885102',
      $groupBy: 'icao',
      $aggregate: ['geometry']
    }
    // Aggregation requires feature ID index to be built so we add some time to do so
    await utility.promisify(setTimeout)(5000)
    const result = await adsbObsService.find({ query: Object.assign({}, aggregationQuery) })
    expect(result.features.length).to.equal(1)
    const feature = result.features[0]
    expect(feature.time).toExist()
    expect(feature.time.geometry).toExist()
    expect(feature.time.geometry.length === 4).beTrue()
    expect(feature.time.geometry[0].isBefore(feature.time.geometry[1])).beTrue()
    expect(feature.geometry.type).to.equal('GeometryCollection')
    expect(feature.geometry.geometries).toExist()
    expect(feature.geometry.geometries.length === 4).beTrue()
  })
  // Let enough time to process
    .timeout(10000)

  it('performs heatmap on ADS-B observations service', async () => {
    let results = await adsbObsService.heatmap({
      query: {
        time: {
          $gte: new Date('2019-01-04T13:00:00.000Z').toISOString(),
          $lte: new Date('2019-01-04T14:00:00.000Z').toISOString()
        }
      },
      count: 'hour'
    })
    expect(results.length === 1)
    expect(results[0]).to.deep.equal({ hour: 13, count: 4 })
    results = await adsbObsService.heatmap({
      query: {
        time: {
          $gte: new Date('2019-01-04T13:00:00.000Z').toISOString(),
          $lte: new Date('2019-01-04T14:00:00.000Z').toISOString()
        }
      },
      count: 'hour',
      timezone: '+02:00'
    })
    expect(results.length === 1)
    expect(results[0]).to.deep.equal({ hour: 15, count: 4 })
    results = await adsbObsService.heatmap({
      query: {
        time: {
          $gte: new Date('2019-01-03T00:00:00.000Z').toISOString(),
          $lte: new Date('2019-01-05T00:00:00.000Z').toISOString()
        }
      },
      count: 'dayOfYear'
    })
    expect(results.length === 1)
    expect(results[0]).to.deep.equal({ dayOfYear: 4, count: 5 })
    results = await adsbObsService.heatmap({
      query: {
        time: {
          $gte: new Date('2019-01-03T00:00:00.000Z').toISOString(),
          $lte: new Date('2019-01-05T00:00:00.000Z').toISOString()
        }
      },
      count: ['hour', 'dayOfWeek']
    })
    expect(results.length === 2)
    results.forEach(result => {
      if (result.hour === 13) expect(result).to.deep.equal({ hour: 13, dayOfWeek: 6, count: 4 })
      else expect(result).to.deep.equal({ hour: 14, dayOfWeek: 6, count: 1 })
    })
  })
  // Let enough time to process
    .timeout(10000)

  it('clears the layers', async () => {
    for (let i = 0; i < defaultLayers.length; ++i) {
      await catalogService.remove(defaultLayers[i]._id)
    }
    defaultLayers = await catalogService.find()
    expect(defaultLayers.length === 0)
  })

  it('removes the test user', async () => {
    await userService.remove(userObject._id, {
      user: userObject,
      checkAuthorisation: true
    })
    const users = await userService.find({ query: { name: 'test-user' } })
    expect(users.data.length === 0).beTrue()
  })

  // Cleanup
  after(async () => {
    if (server) await server.close()
    await zonesService.Model.drop()
    await vigicruesStationsService.Model.drop()
    await vigicruesObsService.Model.drop()
    await adsbObsService.Model.drop()
    await catalogService.Model.drop()
    await userService.Model.drop()
    await app.db.disconnect()
  })
})
