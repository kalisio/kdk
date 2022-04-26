import _ from 'lodash'
import moment from 'moment'
import siftModule from 'sift'
import request from 'superagent'
import cron from 'cron'
import errors from '@feathersjs/errors'
import makeDebug from 'debug'
const debug = makeDebug('kdk:map:alerts:service')

const { CronJob } = cron
const { Unprocessable } = errors
const sift = siftModule.default

// Alert map
const alerts = {}

export default {
  async registerAlert (alert, check = true) {
    if (alerts[alert._id.toString()]) return
    debug('Registering new alert ', alert)
    const cronJob = new CronJob(alert.cron, () => this.checkAlert(alert))
    alerts[alert._id.toString()] = cronJob
    if (check) await this.checkAlert(alert)
    cronJob.start()
  },

  async unregisterAlert (alert) {
    const id = (typeof alert === 'string' ? alert : alert._id)
    const cronJob = alerts[id.toString()]
    if (!cronJob) return
    debug('Unregistering alert ', alert)
    cronJob.stop()
    delete alerts[id.toString()]
  },

  getConditions (alert) {
    return _.mapKeys(alert.conditions, (value, key) => 'properties.' + key)
  },

  async checkWeatherAlert (alert) {
    const now = moment.utc()
    // Convert conditions to internal data model
    const conditions = this.getConditions(alert)
    const probesService = this.app.getService('probes')
    if (!probesService) {
      throw new Unprocessable('Cannot check alert ' + alert._id.toString() + ' as target probes service is not available', {
        translation: {
          key: 'CANNOT_CHECK_ALERT_MISSING_SERVICE'
        }
      })
    }
    // Perform aggregation over time range
    const query = Object.assign({
      forecastTime: {
        $gte: now.clone().add(_.get(alert, 'period.start', { seconds: 0 })).toDate(),
        $lte: now.clone().add(_.get(alert, 'period.end', { seconds: 24 * 3600 })).toDate()
      },
      geometry: {
        $geoIntersects: {
          $geometry: _.get(alert, 'geometry')
        }
      },
      aggregate: false
    })
    const result = await probesService.create({
      forecast: alert.forecast,
      elements: alert.elements
    }, { query })
    // Check for available data so that we will not close an alert because data is missing
    if (result.features.length === 0) {
      throw new Unprocessable('Cannot check alert ' + alert._id.toString() + ' as no data is available for ' + alert.forecast, {
        translation: {
          key: 'CANNOT_CHECK_ALERT_MISSING_DATA'
        }
      })
    }
    // Let sift performs condition matching as in this case MongoDB cannot
    return result.features.filter(sift(conditions))
  },

  async checkMeasureAlert (alert) {
    const now = moment.utc()
    // Convert conditions to internal data model
    const conditions = this.getConditions(alert)
    const featureService = this.app.getService(_.get(alert, 'layer.service'))
    if (!featureService) {
      throw new Unprocessable('Cannot check alert ' + alert._id.toString() + ' as target features service ' + _.get(alert, 'layer.service') + ' is not available', {
        translation: {
          key: 'CANNOT_CHECK_ALERT_MISSING_SERVICE'
        }
      })
    }
    // Build base query for time range and target feature
    const query = {
      time: {
        $gte: now.clone().add(_.get(alert, 'period.start', { seconds: 0 })).toDate(),
        $lte: now.clone().add(_.get(alert, 'period.end', { seconds: 24 * 3600 })).toDate()
      }
    }
    if (_.has(alert, 'layer.featureId')) {
      query['properties.' + _.get(alert, 'layer.featureId')] = alert.feature
    } else {
      query._id = alert.feature
    }
    // Check for available data so that we will not close an alert because data is missing
    // $limit = 0 performs a simple count query
    let result = await featureService.find({ query: Object.assign({ $limit: 0 }, query) })
    if (result.total === 0) {
      throw new Unprocessable('Cannot check alert ' + alert._id.toString() + ' as no data is available for features service ' + _.get(alert, 'layer.service'), {
        translation: {
          key: 'CANNOT_CHECK_ALERT_MISSING_DATA'
        }
      })
    }
    // Perform aggregation over time range
    result = await featureService.find({ query: Object.assign(query, conditions) })
    return result.features
  },

  async checkAlert (alert, options = { patch: true, callWebhook: true }) {
    const now = moment.utc()
    debug('Checking alert at ' + now.format(), _.omit(alert, ['status', 'webhook']))
    // First check if still valid
    if (now.isAfter(alert.expireAt)) {
      await this.unregisterAlert(alert)
      return
    }
    // Then update alert status starting from previous one (i.e. trigger time stamp, etc.)
    const status = _.get(alert, 'status', {})
    status.checkedAt = now.clone()
    // Clean any error state
    delete status.error
    try {
      const results = (alert.feature ? await this.checkMeasureAlert(alert) : await this.checkWeatherAlert(alert))
      // FIXME: check for a specific duration where conditions are met
      const isActive = (results.length > 0)
      const wasActive = status.active
      status.active = isActive
      if (isActive) {
        // If not previously active and it is now add first time stamp
        if (!wasActive) {
          status.triggeredAt = now.clone()
        }
        // Update triggers
        status.triggers = results
      }
      debug('Alert ' + alert._id.toString() + ' status', status, ' with ' + results.length + ' triggers')
    } catch (error) { // Possible if no data
      this.app.logger.error(error.message)
      status.error = error.toJSON()
    }

    // As we keep in-memory objects avoid them being mutated by hooks processing operation payload
    if (options.patch) {
      await this.patch(alert._id.toString(), { status: Object.assign({}, status) })
      // DEBUG code to simulate alert closing
      /*
      setTimeout(async () => {
        await this.patch(alert._id.toString(), {
          status: { active: false, checkedAt: now.clone() }
        })
      }, 10000)
      */
    }
    // Keep track of changes in memory as well
    Object.assign(alert, { status })
    // If a webhook is configured call it
    const webhook = alert.webhook
    if (options.callWebhook && webhook) {
      const body = Object.assign({ alert: _.omit(alert, ['webhook']) }, _.omit(webhook, ['url']))
      await request.post(webhook.url, body)
    }
    return alert
  }
}
