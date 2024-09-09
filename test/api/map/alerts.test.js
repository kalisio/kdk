/* eslint-disable no-unused-expressions */
import chai from 'chai'
import chailint from 'chai-lint'
import spies from 'chai-spies'
import _ from 'lodash'
import moment from 'moment'
import utility from 'util'
import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import express from 'express'
import request from 'superagent'
import weacastCore, { weacast } from '@weacast/core'
import weacastGfs from '@weacast/gfs'
import weacastProbe from '@weacast/probe'
import distribution, { finalize } from '@kalisio/feathers-distributed'
import core, { kdk, hooks } from '../../../core/api/index.js'
import map, { createFeaturesService, createAlertsService } from '../../../map/api/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { util, expect } = chai

describe('map:alerts', () => {
  let app, weacastApp, server, port, externalApp, externalServer, externalPort,
    alertService, vigicruesObsService, uService, vService, probeService,
    alertObject, spyRegisterAlert, spyUnregisterAlert, spyCheckAlert
  let activeEventCount = 0
  let eventCount = 0
  let activeWebhookCount = 0
  let webhookCount = 0
  let errorCount = 0

  function checkAlertEvent (event) {
    const { status } = event
    eventCount++
    if (_.get(status, 'active')) {
      const triggers = status.triggers
      activeEventCount++
      expect(triggers).toExist()
      expect(triggers.length > 0).beTrue()
      expect(triggers[0].geometry).toExist()
    } else {
      expect(status.triggers).beUndefined()
    }
    if (_.get(status, 'error')) {
      errorCount++
    }
  }
  function checkAlertWebhook (req, res) {
    const { type, alert } = req.body
    webhookCount++
    expect(type === 'event').beTrue()
    if (_.get(alert, 'status.active')) {
      const triggers = _.get(alert, 'status.triggers')
      activeWebhookCount++
      expect(triggers).toExist()
      expect(triggers.length > 0).beTrue()
      expect(triggers[0].geometry).toExist()
    } else {
      expect(_.get(alert, 'status.triggers')).beUndefined()
    }
    res.sendStatus(200)
  }

  function resetAlertEvent () {
    activeEventCount = 0
    eventCount = 0
    errorCount = 0
  }
  function resetAlertWebhook () {
    activeWebhookCount = 0
    webhookCount = 0
  }

  before(async () => {
    chailint(chai, util)
    chai.use(spies)

    app = kdk()
    weacastApp = weacast()
    // Distribute services
    app.configure(distribution(app.get('distribution').app))
    weacastApp.configure(distribution(app.get('distribution').weacast))
    // Register log hook
    app.hooks({
      error: { all: hooks.log }
    })
    port = parseInt(app.get('port'))
    await Promise.all([
      app.db.connect(),
      weacastApp.db.connect()
    ])
  })

  it('launch external webhook app', (done) => {
    externalApp = express()
    externalApp.use(express.json())
    externalPort = port + 1
    // Launch the external server
    externalServer = externalApp.listen(externalPort)
    externalServer.once('listening', _ => {
      // Ensure webhook enpoint responds
      externalApp.post('/webhook', checkAlertWebhook)
      request.post('http://localhost:' + externalPort + '/webhook', { type: 'event' }, (error, res, body) => {
        resetAlertWebhook()
        done(error)
      })
    })
  })
  // Let enough time to process
    .timeout(5000)

  it('registers the weacast services', async () => {
    await weacastApp.configure(weacastCore)
    await weacastApp.configure(weacastGfs)
    await weacastApp.configure(weacastProbe)
    uService = weacastApp.getService('gfs-world/u-wind')
    expect(uService).toExist()
    vService = weacastApp.getService('gfs-world/v-wind')
    expect(vService).toExist()
    probeService = weacastApp.getService('probes')
    expect(probeService).toExist()
  })
  // Let enough time to process
    .timeout(10000)

  it('registers the alert service', async () => {
    await app.configure(core)
    await app.configure(map)
    alertService = await createAlertsService.call(app)
    expect(alertService).toExist()
    alertService.on('patched', checkAlertEvent)
    spyRegisterAlert = chai.spy.on(alertService, 'registerAlert')
    spyUnregisterAlert = chai.spy.on(alertService, 'unregisterAlert')
    spyCheckAlert = chai.spy.on(alertService, 'checkAlert')
    // Now app is configured launch the server
    server = await app.listen(port)
    await new Promise(resolve => server.once('listening', () => resolve()))
  })
  // Let enough time to process
    .timeout(5000)

  it('performs weather element download process', async () => {
    // download both elements in parallel
    await Promise.all([
      uService.updateForecastData(),
      vService.updateForecastData()
    ])
  })
  // Let enough time to download a couple of data
    .timeout(60000)

  it('creates weather active alert at specific location', async () => {
    // Wait long enough to be sure the distribution is effective
    await utility.promisify(setTimeout)(10000)
    const now = moment.utc()
    alertObject = await alertService.create({
      cron: '*/5 * * * * *',
      expireAt: now.clone().add({ days: 1 }),
      period: {
        start: { hours: -6 },
        end: { hours: 6 }
      },
      forecast: 'gfs-world',
      elements: ['u-wind', 'v-wind', 'windSpeed'],
      geometry: {
        type: 'Point',
        coordinates: [144.29091388888889, -5.823011111111111]
      },
      conditions: {
        windSpeed: { $gte: 0 } // Set a large range so that we are sure it will trigger
      },
      webhook: {
        url: 'http://localhost:' + externalPort + '/webhook',
        type: 'event'
      }
    })
    expect(spyRegisterAlert).to.have.been.called.once
    spyRegisterAlert.reset()
    let results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron has been called twice
    await utility.promisify(setTimeout)(10000)
    expect(spyCheckAlert).to.have.been.called.at.least(2)
    spyCheckAlert.reset()
    expect(eventCount).to.be.at.least(2)
    expect(activeEventCount).to.be.at.least(2)
    expect(errorCount).to.equal(0)
    expect(webhookCount).to.be.at.least(2)
    expect(activeWebhookCount).to.be.at.least(2)
    results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    expect(results[0].status).toExist()
    expect(results[0].status.active).beTrue()
    expect(results[0].status.triggeredAt).toExist()
    expect(results[0].status.checkedAt).toExist()
    expect(results[0].status.triggeredAt.isSameOrAfter(now.format())).beTrue() // Registering trigger a check
    expect(results[0].status.checkedAt.isSameOrAfter(results[0].status.triggeredAt.format())).beTrue()
  })
  // Let enough time to process
    .timeout(30000)

  it('removes active weather alert at specific location', async () => {
    await alertService.remove(alertObject._id.toString())
    expect(spyUnregisterAlert).to.have.been.called.once
    spyUnregisterAlert.reset()
    resetAlertEvent()
    resetAlertWebhook()
    const results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(0)
    // Wait long enough to be sure the cron has not been called again (alert unregistered)
    await utility.promisify(setTimeout)(5000)
    expect(spyCheckAlert).to.not.have.been.called()
    spyCheckAlert.reset()
  })
  // Let enough time to process
    .timeout(10000)

  it('creates inactive weather alert at specific location', async () => {
    const now = moment.utc()
    alertObject = await alertService.create({
      cron: '*/5 * * * * *',
      expireAt: now.clone().add({ days: 1 }),
      period: {
        start: { hours: -6 },
        end: { hours: 6 }
      },
      forecast: 'gfs-world',
      elements: ['u-wind', 'v-wind', 'windSpeed'],
      geometry: {
        type: 'Point',
        coordinates: [144.29091388888889, -5.823011111111111]
      },
      conditions: {
        windSpeed: { $lt: -10 } // Set an invalid range so that we are sure it will not trigger
      },
      webhook: {
        url: 'http://localhost:' + externalPort + '/webhook',
        type: 'event'
      }
    })
    expect(spyRegisterAlert).to.have.been.called.once
    spyRegisterAlert.reset()
    let results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron has been called twice
    await utility.promisify(setTimeout)(10000)
    expect(spyCheckAlert).to.have.been.called.at.least(2)
    spyCheckAlert.reset()
    expect(eventCount).to.be.at.least(2)
    expect(activeEventCount).to.equal(0)
    expect(errorCount).to.equal(0)
    expect(webhookCount).to.be.at.least(2)
    expect(activeWebhookCount).to.equal(0)
    results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    expect(results[0].status).toExist()
    expect(results[0].status.active).beFalse()
    expect(results[0].status.triggeredAt).beUndefined()
    expect(results[0].status.checkedAt).toExist()
  })
  // Let enough time to process
    .timeout(15000)

  it('removes inactive weather alert at specific location', async () => {
    await alertService.remove(alertObject._id.toString())
    expect(spyUnregisterAlert).to.have.been.called.once
    spyUnregisterAlert.reset()
    resetAlertEvent()
    resetAlertWebhook()
    const results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(0)
    // Wait long enough to be sure the cron has not been called again (alert unregistered)
    await utility.promisify(setTimeout)(5000)
    expect(spyCheckAlert).to.not.have.been.called()
    spyCheckAlert.reset()
  })
  // Let enough time to process
    .timeout(10000)

  it('ensures weather alert impossible to check due to missing data raises error', async () => {
    const now = moment.utc()
    alertObject = await alertService.create({
      cron: '*/5 * * * * *',
      expireAt: now.clone().add({ days: 1 }),
      period: {
        start: { minutes: -5 },
        end: { minutes: 0 }
      },
      forecast: 'gfs-world',
      elements: ['u-wind', 'v-wind', 'windSpeed'],
      geometry: {
        type: 'Point',
        coordinates: [144.29091388888889, -5.823011111111111]
      },
      conditions: {
        windSpeed: { $gt: 0 }
      },
      webhook: {
        url: 'http://localhost:' + externalPort + '/webhook',
        type: 'event'
      }
    })
    // Check in-memory object
    expect(alertObject.status).toExist()
    expect(alertObject.status.active).beUndefined()
    expect(alertObject.status.checkedAt).toExist()
    expect(alertObject.status.error).toExist()
    expect(alertObject.status.error.code).to.equal(422)
    expect(alertObject.status.error.data).toExist()
    expect(alertObject.status.error.data.translation).toExist()
    expect(alertObject.status.error.data.translation.key).to.equal('CANNOT_CHECK_ALERT_MISSING_DATA')
    const results = await alertService.find({ paginate: false, query: {} })
    await alertService.remove(alertObject._id.toString())
    expect(spyRegisterAlert).to.have.been.called.once
    spyRegisterAlert.reset()
    expect(spyCheckAlert).to.have.been.called.at.least(1)
    spyCheckAlert.reset()
    expect(spyUnregisterAlert).to.have.been.called.once
    spyUnregisterAlert.reset()
    expect(eventCount).to.be.at.least(1)
    expect(activeEventCount).to.equal(0)
    expect(errorCount).to.equal(1)
    expect(webhookCount).to.be.at.least(1)
    expect(activeWebhookCount).to.equal(0)
    resetAlertEvent()
    resetAlertWebhook()
    // Check in-database object
    expect(results.length).to.equal(1)
    expect(results[0].status).toExist()
    expect(results[0].status.active).beUndefined()
    expect(results[0].status.checkedAt).toExist()
    expect(results[0].status.error).toExist()
    expect(results[0].status.error.code).to.equal(422)
    expect(results[0].status.error.data).toExist()
    expect(results[0].status.error.data.translation).toExist()
    expect(results[0].status.error.data.translation.key).to.equal('CANNOT_CHECK_ALERT_MISSING_DATA')
  })
  // Let enough time to process
    .timeout(5000)

  it('create and feed the vigicrues observations service', async () => {
    const tomorrow = moment.utc().add(1, 'days')
    // Create the service
    await createFeaturesService.call(app, {
      collection: 'vigicrues-observations',
      featureId: 'CdStationH',
      history: 604800
    })
    vigicruesObsService = app.getService('vigicrues-observations')
    expect(vigicruesObsService).toExist()
    // Feed the collection
    const observations = fs.readJsonSync(path.join(__dirname, 'data/vigicrues.observations.json'))
    // Update time to tomorrow so that alert will trigger correctly
    await vigicruesObsService.create(observations.map(observation => Object.assign({}, observation, {
      time: moment.utc(observation.time).date(tomorrow.date()).month(tomorrow.month()).year(tomorrow.year())
    })))
  })
  // Let enough time to process
    .timeout(5000)

  it('creates active alert at specific station', async () => {
    const now = moment.utc()
    alertObject = await alertService.create({
      cron: '*/5 * * * * *',
      expireAt: now.clone().add({ days: 1 }),
      period: {
        start: { hours: 0 },
        end: { hours: 48 }
      },
      layer: {
        service: 'vigicrues-observations',
        featureId: 'CdStationH'
      },
      feature: 'A282000101',
      conditions: {
        H: { $gte: 0.6 } // Set a large range so that we are sure it will trigger
      },
      webhook: {
        url: 'http://localhost:' + externalPort + '/webhook',
        type: 'event'
      }
    })
    expect(spyRegisterAlert).to.have.been.called.once
    spyRegisterAlert.reset()
    let results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron has been called twice
    await utility.promisify(setTimeout)(10000)
    expect(spyCheckAlert).to.have.been.called.at.least(2)
    spyCheckAlert.reset()
    expect(eventCount).to.be.at.least(2)
    expect(activeEventCount).to.be.at.least(2)
    expect(errorCount).to.equal(0)
    expect(webhookCount).to.be.at.least(2)
    expect(activeWebhookCount).to.be.at.least(2)
    results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    expect(results[0].status).toExist()
    expect(results[0].status.active).beTrue()
    expect(results[0].status.triggeredAt).toExist()
    expect(results[0].status.checkedAt).toExist()
    expect(results[0].status.triggeredAt.isSameOrAfter(now.format())).beTrue() // Registering trigger a check
    expect(results[0].status.checkedAt.isSameOrAfter(results[0].status.triggeredAt.format())).beTrue()
  })
  // Let enough time to process
    .timeout(15000)

  it('removes active alert at specific station', async () => {
    await alertService.remove(alertObject._id.toString())
    expect(spyUnregisterAlert).to.have.been.called.once
    spyUnregisterAlert.reset()
    resetAlertEvent()
    resetAlertWebhook()
    const results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(0)
    // Wait long enough to be sure the cron has not been called again (alert unregistered)
    await utility.promisify(setTimeout)(5000)
    expect(spyCheckAlert).to.not.have.been.called()
    spyCheckAlert.reset()
  })
  // Let enough time to process
    .timeout(10000)

  it('creates inactive alert at specific station', async () => {
    const now = moment.utc()
    alertObject = await alertService.create({
      cron: '*/5 * * * * *',
      expireAt: now.clone().add({ days: 1 }),
      period: {
        start: { hours: 0 },
        end: { hours: 48 }
      },
      layer: {
        service: 'vigicrues-observations',
        featureId: 'CdStationH'
      },
      feature: 'A282000101',
      conditions: {
        H: { $lt: -10 } // Set an invalid range so that we are sure it will not trigger
      },
      webhook: {
        url: 'http://localhost:' + externalPort + '/webhook',
        type: 'event'
      }
    })
    expect(spyRegisterAlert).to.have.been.called.once
    spyRegisterAlert.reset()
    let results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron has been called twice
    await utility.promisify(setTimeout)(10000)
    expect(spyCheckAlert).to.have.been.called.at.least(2)
    spyCheckAlert.reset()
    expect(eventCount).to.be.at.least(2)
    expect(activeEventCount).to.equal(0)
    expect(errorCount).to.equal(0)
    expect(webhookCount).to.be.at.least(2)
    expect(activeWebhookCount).to.equal(0)
    results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    expect(results[0].status).toExist()
    expect(results[0].status.active).beFalse()
    expect(results[0].status.triggeredAt).beUndefined()
    expect(results[0].status.checkedAt).toExist()
  })
  // Let enough time to process
    .timeout(15000)

  it('removes inactive alert at specific station', async () => {
    await alertService.remove(alertObject._id.toString())
    expect(spyUnregisterAlert).to.have.been.called.once
    spyUnregisterAlert.reset()
    resetAlertEvent()
    resetAlertWebhook()
    const results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(0)
    // Wait long enough to be sure the cron has not been called again (alert unregistered)
    await utility.promisify(setTimeout)(5000)
    expect(spyCheckAlert).to.not.have.been.called()
    spyCheckAlert.reset()
  })
  // Let enough time to process
    .timeout(10000)

  it('ensures station alert impossible to check due to missing data raises error', async () => {
    const now = moment.utc()
    alertObject = await alertService.create({
      cron: '*/5 * * * * *',
      expireAt: now.clone().add({ days: 1 }),
      period: {
        start: { minutes: 0 },
        end: { minutes: 1 }
      },
      layer: {
        service: 'vigicrues-observations',
        featureId: 'CdStationH'
      },
      feature: 'A282000101',
      conditions: {
        H: { $gt: 0 }
      },
      webhook: {
        url: 'http://localhost:' + externalPort + '/webhook',
        type: 'event'
      }
    })
    // Check in-memory object
    expect(alertObject.status).toExist()
    expect(alertObject.status.active).beUndefined()
    expect(alertObject.status.checkedAt).toExist()
    expect(alertObject.status.error).toExist()
    expect(alertObject.status.error.code).to.equal(422)
    expect(alertObject.status.error.data).toExist()
    expect(alertObject.status.error.data.translation).toExist()
    expect(alertObject.status.error.data.translation.key).to.equal('CANNOT_CHECK_ALERT_MISSING_DATA')
    const results = await alertService.find({ paginate: false, query: {} })
    await alertService.remove(alertObject._id.toString())
    expect(spyRegisterAlert).to.have.been.called.once
    spyRegisterAlert.reset()
    expect(spyCheckAlert).to.have.been.called.at.least(1)
    spyCheckAlert.reset()
    expect(spyUnregisterAlert).to.have.been.called.once
    spyUnregisterAlert.reset()
    expect(eventCount).to.be.at.least(1)
    expect(activeEventCount).to.equal(0)
    expect(errorCount).to.equal(1)
    expect(webhookCount).to.be.at.least(1)
    expect(activeWebhookCount).to.equal(0)
    resetAlertEvent()
    resetAlertWebhook()
    // Check in-database object
    expect(results.length).to.equal(1)
    expect(results[0].status).toExist()
    expect(results[0].status.active).beUndefined()
    expect(results[0].status.checkedAt).toExist()
    expect(results[0].status.error).toExist()
    expect(results[0].status.error.code).to.equal(422)
    expect(results[0].status.error.data).toExist()
    expect(results[0].status.error.data.translation).toExist()
    expect(results[0].status.error.data.translation.key).to.equal('CANNOT_CHECK_ALERT_MISSING_DATA')
  })
  // Let enough time to process
    .timeout(5000)

  // Cleanup
  after(async () => {
    if (externalServer) await externalServer.close()
    if (server) await server.close()
    finalize(app)
    finalize(weacastApp)
    await weacastApp.getService('forecasts').Model.drop()
    await uService.Model.drop()
    await vService.Model.drop()
    await weacastApp.db.disconnect()
    fs.removeSync(app.get('forecastPath'))
    await vigicruesObsService.Model.drop()
    alertService.removeAllListeners()
    await alertService.Model.drop()
    await app.db.disconnect()
  })
})
