import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import _ from 'lodash'
import fs from 'fs-extra'
import core, { kalisio, hooks, permissions } from '../../core/api'
import map, { permissions as mapPermissions, createFeaturesService, createCatalogService } from '../../map/api'

describe('kMap', () => {
  let app, server, port, // baseUrl,
    userService, userObject, geocoderService, catalogService, layersArray,
    vigicruesStationsService, vigicruesObsService, adsbObsService, position

  before(() => {
    chailint(chai, util)

    // Register all default hooks for authorisation
    // Default rules for all users
    permissions.defineAbilities.registerHook(permissions.defineUserAbilities)
    // Then rules for maps
    permissions.defineAbilities.registerHook(mapPermissions.defineUserAbilities)

    app = kalisio()
    // Register authorisation/log hook
    app.hooks({
      before: { all: [hooks.authorise] },
      error: { all: hooks.log }
    })
    port = app.get('port')
    // baseUrl = `http://localhost:${port}${app.get('apiPath')}`
    return app.db.connect()
  })

  it('is ES6 compatible', () => {
    expect(typeof map).to.equal('function')
  })

  it('registers the services', (done) => {
    app.configure(core)
    userService = app.getService('users')
    expect(userService).toExist()
    app.configure(map)
    geocoderService = app.getService('geocoder')
    expect(geocoderService).toExist()
    // Create a global catalog service
    createCatalogService.call(app)
    catalogService = app.getService('catalog')
    expect(catalogService).toExist()
    // Now app is configured launch the server
    server = app.listen(port)
    server.once('listening', _ => done())
  })
  // Let enough time to process
    .timeout(5000)

  it('creates a test user', async () => {
    userObject = await userService.create({ email: 'test-user@test.org', name: 'test-user' }, { checkAuthorisation: true })
    const users = await userService.find({ query: { 'profile.name': 'test-user' }, user: userObject, checkAuthorisation: true })
    expect(users.data.length > 0).beTrue()
  })

  it('registers the default layer catalog', async () => {
    const layers = await fs.readJson('./tests/map/config/layers.json')
    expect(layers.length > 0)
    // Create a global catalog service
    layersArray = await catalogService.create(layers)
    expect(layersArray.length > 0)
  })

  it('create and feed the vigicrues stations service', async () => {
    // Create the service
    const vigicruesStationsLayer = _.find(layersArray, { name: 'vigicrues-stations' })
    expect(vigicruesStationsLayer).toExist()
    expect(vigicruesStationsLayer.service === 'vigicrues-stations').beTrue()
    createFeaturesService.call(app, {
      collection: vigicruesStationsLayer.service,
      featureId: vigicruesStationsLayer.featureId,
      history: vigicruesStationsLayer.history
    })
    vigicruesStationsService = app.getService(vigicruesStationsLayer.service)
    expect(vigicruesStationsService).toExist()
    // Create the spatial index
    vigicruesStationsService.Model.ensureIndex({ geometry: '2dsphere' })
    // Feed the collection
    const stations = require('./data/vigicrues.stations.json').features
    await vigicruesStationsService.create(stations)
  })

  it('create and feed the vigicrues observations service', async () => {
    // Create the service
    const vigicruesObsLayer = _.find(layersArray, { name: 'vigicrues-observations' })
    expect(vigicruesObsLayer).toExist()
    expect(vigicruesObsLayer.service === 'vigicrues-observations').beTrue()
    createFeaturesService.call(app, {
      collection: vigicruesObsLayer.service,
      featureId: vigicruesObsLayer.featureId,
      history: vigicruesObsLayer.history
    })
    vigicruesObsService = app.getService(vigicruesObsLayer.service)
    expect(vigicruesObsService).toExist()
    // Feed the collection
    const observations = require('./data/vigicrues.observations.json')
    await vigicruesObsService.create(observations)
  })

  it('create and feed the ADS-B observations service', async () => {
    // Create the service
    const adsbObsLayer = _.find(layersArray, { name: 'adsb-observations' })
    expect(adsbObsLayer).toExist()
    expect(adsbObsLayer.service === 'adsb-observations').beTrue()
    createFeaturesService.call(app, {
      collection: adsbObsLayer.service,
      featureId: adsbObsLayer.featureId,
      history: adsbObsLayer.history
    })
    adsbObsService = app.getService(adsbObsLayer.service)
    expect(adsbObsService).toExist()
    // Feed the collection
    const observations = require('./data/adsb.observations.json')
    await adsbObsService.create(observations)
  })

  it('performs spatial filtering on vigicrues stations service', async () => {
    const result = await vigicruesStationsService.find({
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
      }
    })
    expect(result.features.length > 0).beTrue()
  })

  it('performs value filtering on vigicrues observations service', async () => {
    const result = await vigicruesObsService.find({
      query: {
        'properties.H': { $gt: 0.33, $lt: 0.5 }
      }
    })
    expect(result.features.length > 0).beTrue()
  })

  it('performs temporal filtering on vigicrues observations service', async () => {
    const result = await vigicruesObsService.find({
      query: {
        time: {
          $gt: new Date('2018-11-08T18:00:00').toISOString(),
          $lt: new Date('2018-11-08T22:00:00').toISOString()
        }
      }
    })
    expect(result.features.length > 0).beTrue()
  })

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
    const result = await vigicruesObsService.find({ query: Object.assign({}, aggregationQuery) })
    expect(result.features.length).to.equal(1)
    const feature = result.features[0]
    expect(feature.time).toExist()
    expect(feature.time.H).toExist()
    expect(feature.time.H.length === 5).beTrue()
    expect(feature.time.H[0].isBefore(feature.time.H[1])).beTrue()
    expect(feature.properties.H.length === 5).beTrue()
  })

  it('performs sorted element aggregation on vigicrues observations service', async () => {
    const result = await vigicruesObsService.find({ query: Object.assign({ $sort: { time: -1 } }, aggregationQuery) })
    expect(result.features.length).to.equal(1)
    const feature = result.features[0]
    expect(feature.time).toExist()
    expect(feature.time.H).toExist()
    expect(feature.time.H.length === 5).beTrue()
    expect(feature.time.H[0].isAfter(feature.time.H[1])).beTrue()
    expect(feature.properties.H.length === 5).beTrue()
  })

  it('performs geometry aggregation on ADS-B observations service', async () => {
    const aggregationQuery = {
      time: {
        $lte: new Date('2019-01-04T13:58:54.767Z').toISOString()
      },
      'properties.icao': '885102',
      $groupBy: 'icao',
      $aggregate: ['geometry']
    }
    const result = await adsbObsService.find({ query: Object.assign({}, aggregationQuery) })
    expect(result.features.length).to.equal(1)
    const feature = result.features[0]
    expect(feature.time).toExist()
    expect(feature.time.geometry).toExist()
    expect(feature.time.geometry.length === 4).beTrue()
    expect(feature.time.geometry[0].isBefore(feature.time.geometry[1])).beTrue()
    expect(feature.geometry.length === 4).beTrue()
  })

  it('geocode an address', async () => {
    const address = '80 chemin des tournesols, 11400 Castelnaudary'
    const response = await geocoderService.create({ address: address }, { user: userObject, checkAuthorisation: true })
    expect(response.length === 1).beTrue()
    position = response[0]
    expect(position.latitude).toExist()
    expect(position.longitude).toExist()
  })
  // Let enough time to process
    .timeout(10000)

  it('reverse geocode a position', async () => {
    const response = await geocoderService.create(position, { user: userObject, checkAuthorisation: true })
    expect(response.length > 0).beTrue()
    expect(response[0].country).toExist()
    expect(response[0].streetName).toExist()
  })
  // Let enough time to process
    .timeout(10000)

  it('clears the layers', async () => {
    for (let i = 0; i < layersArray.length; ++i) {
      await catalogService.remove(layersArray[i]._id)
    }
    layersArray = await catalogService.find()
    expect(layersArray.length === 0)
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
    await vigicruesStationsService.Model.drop()
    await vigicruesObsService.Model.drop()
    await adsbObsService.Model.drop()
    await catalogService.Model.drop()
    await userService.Model.drop()
    await app.db.disconnect()
  })
})
