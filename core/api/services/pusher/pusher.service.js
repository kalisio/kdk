import _ from 'lodash'
import moment from 'moment'
import errors from '@feathersjs/errors'
import SNS from 'sns-mobile'
import makeDebug from 'debug'

const debug = makeDebug('kdk:core:pusher:service')
const defaultTopicField = 'topics'
const { GeneralError } = errors

export default function (name, app, options) {
  // Keep track of config
  const config = Object.assign({}, app.get('pusher'), options)
  function generateTopicName (object, application) {
    if (config.topicName && (typeof config.topicName === 'function')) return config.topicName(object, application)
    else return object._id.toString()
  }
  // Instanciate a SNS interface for each platform found in config
  const snsApplications = []
  _.forOwn(config.platforms, (platformArn, platform) => {
    const snsConfig = Object.assign({
      platform,
      platformApplicationArn: platformArn
    }, _.omit(config, ['platforms']))
    const snsApplication = new SNS(snsConfig)
    debug('SNS application created with config ', snsConfig)
    snsApplications.push(snsApplication)
  })
  return {
    // Used to retrieve the underlying interface for a platform
    getSnsApplication (platform) {
      return _.find(snsApplications, application => application.platform === platform.toUpperCase())
    },
    // Generate the SNS payload for given message and target platform
    // If platform is not provided it generates a multi-platform payload
    getMessagePayload (message, platform) {
      // Transform in internal data structure if only a string is given
      if (typeof message === 'string') {
        message = { title: message, body: message }
      }
      const jsonMessage = { default: message.title }
      // For stacking we need a unique increasing ID per notification on Android
      let notId = 1
      if (message.createdAt && message.updatedAt) {
        // Use the difference in seconds between creation/update time
        if (moment.isMoment(message.createdAt) && moment.isMoment(message.updatedAt)) {
          notId = (message.updatedAt.valueOf() - message.createdAt.valueOf())
        } else if (message.createdAt instanceof Date && message.updatedAt instanceof Date) {
          notId = (message.updatedAt.getTime() - message.createdAt.getTime())
        } else {
          // Assume strings
          notId = (new Date(message.updatedAt).getTime() - new Date(message.createdAt).getTime())
        }
      }
      if (_.isNil(platform) || (platform === SNS.SUPPORTED_PLATFORMS.SMS)) {
        jsonMessage.sms = message.body
      }
      if (_.isNil(platform) || (platform === SNS.SUPPORTED_PLATFORMS.EMAIL)) {
        jsonMessage.subject = message.title
        jsonMessage.email = message.body
      }
      if (_.isNil(platform) || (platform === SNS.SUPPORTED_PLATFORMS.IOS)) {
        // iOS
        const aps = {
          alert: message.title,
          'thread-id': notId.toString()
        }
        if (message.sound) aps.sound = message.sound
        jsonMessage.APNS = JSON.stringify({ aps })
      }
      if (_.isNil(platform) || (platform === SNS.SUPPORTED_PLATFORMS.ANDROID)) {
        // ANDROID
        const data = {
          title: message.title,
          notId
        }
        if (message.body) data.message = message.body
        if (message.sound) data.soundname = message.sound
        if (message.vibration) data.vibrationPattern = message.vibration
        jsonMessage.GCM = JSON.stringify({ data })
      }
      return jsonMessage
    },
    getDevices (user) {
      let devices = []
      if (user.devices) devices = user.devices
      else if (user.phone && this.getSnsApplication('SMS')) {
        // Specific case of SMS, in this case the number replace the device registration ID/arn ARN
        devices.push({
          registrationId: user.phone, arn: user.phone, platform: 'SMS'
        })
      } else if (user.email && this.getSnsApplication('EMAIL')) {
        // Specific case of Email, in this case the address replace the device registration ID/arn ARN
        devices.push({
          registrationId: user.email, arn: user.email, platform: 'EMAIL'
        })
      }
      return devices
    },
    createDevice (device, user) {
      return new Promise((resolve, reject) => {
        const application = this.getSnsApplication(device.platform)
        if (!application) {
          reject(new Error('Cannot register device with token ' + device.registrationId + ' because there is no platform application for ' + device.platform))
          return
        }
        // Check if already registered
        const devices = this.getDevices(user)
        const previousDevice = _.find(devices, userDevice => userDevice.registrationId === device.registrationId)
        if (previousDevice) {
          debug('Already registered device with token ' + previousDevice.registrationId + ' and ARN ' + previousDevice.arn + ' for user ' + user._id.toString())
          resolve(device.arn)
          return
        }
        application.addUser(device.registrationId, '', (err, endpointArn) => {
          if (err) reject(err)
          else {
            debug('Registered device with token ' + device.registrationId + ' and ARN ' + endpointArn + ' for user ' + user._id.toString())
            resolve(endpointArn)
          }
        })
      })
    },
    updateDevice (registrationId, device, user) {
      return new Promise((resolve, reject) => {
        // Check if already registered
        const devices = this.getDevices(user)
        const previousDevice = _.find(devices, userDevice => userDevice.registrationId === device.registrationId)
        if (!previousDevice) {
          reject(new Error('Cannot find device with token ' + device.registrationId + ' and ARN ' + device.arn + ' for user ' + user._id.toString()))
          return
        }
        const application = this.getSnsApplication(device.platform)
        if (!application) {
          reject(new Error('Cannot update device with token ' + device.registrationId + ' because there is no platform application for ' + device.platform))
          return
        }
        // First check if device do exists
        application.getUser(device.arn, (err, attributes) => {
          if (err) reject(err)
          else if ((attributes.Token !== registrationId) || (attributes.Enabled === 'false')) {
            // Update token and ensure device is enabled
            debug('Updating device with token ' + device.registrationId + ' and ARN ' + device.arn + ' to ' + registrationId + ' for user ' + user._id.toString())
            application.setAttributes(device.arn, { Token: registrationId, Enabled: 'true' }, (err, attributes) => {
              if (err) reject(err)
              else {
                device.registrationId = registrationId
                resolve(device)
              }
            })
          } else {
            resolve(device)
          }
        })
      })
    },
    removeDevice (registrationId, user) {
      return new Promise((resolve, reject) => {
        // Check if already registered
        const devices = this.getDevices(user)
        const device = _.find(devices, device => device.registrationId === registrationId)
        if (!device) {
          debug('Cannot find device with token ' + registrationId + ' for user ' + user._id.toString())
          resolve()
          return
        }
        const application = this.getSnsApplication(device.platform)
        if (!application) {
          reject(new Error('Cannot unbind device with token ' + device.registrationId + ' because there is no platform application for ' + device.platform))
          return
        }
        application.deleteUser(device.arn, (err) => {
          if (err) reject(err)
          else {
            debug('Unregistered device with token ' + device.registrationId + ' and ARN ' + device.arn + ' for user ' + user._id.toString())
            resolve(device)
          }
        })
      })
    },
    publishToDevices (user, message) {
      // Process with each registered platform
      const messagePromises = []
      const devices = this.getDevices(user)
      devices.forEach(device => {
        const application = this.getSnsApplication(device.platform)
        messagePromises.push(new Promise((resolve, reject) => {
          if (!application) {
            reject(new Error('Cannot send message to device with token ' + device.registrationId + ' because there is no platform application for ' + device.platform))
            return
          }
          const jsonMessage = this.getMessagePayload(message, application.platform)
          application.sendMessage(device.arn, jsonMessage, (err, messageId) => {
            if (err) {
              // Be tolerant to SNS errors because some endpoints might have been revoked
              // reject(err)
              debug('Unable to publish message to device with token ' + device.registrationId + ' and ARN ' + device.arn + ' for platform ' + application.platform, jsonMessage, err)
              resolve({ [application.platform]: null })
            } else {
              debug('Published message ' + messageId + ' to device with token ' + device.registrationId + ' and ARN ' + device.arn + ' for platform ' + application.platform, jsonMessage)
              resolve({ [application.platform]: messageId })
            }
          })
        }))
      })
      return Promise.all(messagePromises)
        .then(results => results.reduce((messageIds, messageId) => Object.assign(messageIds, messageId), {}))
    },
    async createPlatformTopics (object, service, topicField, patch = true) {
      // Process with each registered platform
      const topicPromises = []
      snsApplications.forEach(application => {
        topicPromises.push(new Promise((resolve, reject) => {
          // The topic name will be the object ID
          application.createTopic(generateTopicName(object, application), (err, topicArn) => {
            if (err) {
              reject(err)
            } else {
              debug('Created topic ' + object._id.toString() + ' with ARN ' + topicArn + ' for platform ' + application.platform)
              resolve({ [application.platform]: topicArn })
            }
          })
        }))
      })
      const results = await Promise.all(topicPromises)
      const topics = results.reduce((topics, topic) => Object.assign(topics, topic), {})
      if (patch) {
        return service.patch(object._id, { [topicField]: topics })
      } else {
        return topics
      }
    },
    publishToPlatformTopics (object, message, topicField) {
      // Check if the same topic is shared accross platforms to avoid publishing multiple times
      // (see https://github.com/kalisio/kdk/issues/557)
      const topics = _.uniq(snsApplications.map(application => _.get(object, topicField + '.' + application.platform)))
      if (topics.length === 1) {
        const topicArn = topics[0]
        const application = snsApplications[0]
        const jsonMessage = this.getMessagePayload(message)
        return new Promise((resolve, reject) => {
          application.publishToTopic(topicArn, jsonMessage, (err, messageId) => {
            if (err) {
              reject(err)
            } else {
              debug('Published message ' + messageId + ' to topic ' + object._id.toString() + ' with ARN ' + topicArn + ' for all platforms', jsonMessage)
              resolve({ messageId })
            }
          })
        })
      } else {
        // Process with each registered platform
        const messagePromises = []
        snsApplications.forEach(application => {
          messagePromises.push(new Promise((resolve, reject) => {
            const topicArn = _.get(object, topicField + '.' + application.platform)
            const jsonMessage = this.getMessagePayload(message, application.platform)
            application.publishToTopic(topicArn, jsonMessage, (err, messageId) => {
              if (err) {
                reject(err)
              } else {
                debug('Published message ' + messageId + ' to topic ' + object._id.toString() + ' with ARN ' + topicArn + ' for platform ' + application.platform, jsonMessage)
                resolve({ [application.platform]: messageId })
              }
            })
          }))
        })
        return Promise.all(messagePromises)
          .then(results => results.reduce((messageIds, messageId) => Object.assign(messageIds, messageId), {}))
      }
    },
    async removePlatformTopics (object, service, topicField, patch = true) {
      // First get all subscribers of the topic because we do not store them
      // Process with each registered platform
      const platformSubscriptions = await this.getPlatformSubscriptions(object, topicField)
      // Process with each registered platform
      const unsubscriptionPromises = []
      const topicPromises = []
      snsApplications.forEach((application, i) => {
        const topicArn = _.get(object, topicField + '.' + application.platform)
        // Unsubscribe all users
        platformSubscriptions[i].forEach(subscription => {
          unsubscriptionPromises.push(new Promise((resolve, reject) => {
            application.unsubscribe(subscription.SubscriptionArn, (err) => {
              if (err) {
                reject(new GeneralError(err, { arn: subscription.SubscriptionArn }))
              } else {
                debug('Unsubscribed device with ARN ' + subscription.SubscriptionArn + ' from topic with ARN ' + topicArn)
                resolve({ arn: subscription.SubscriptionArn })
              }
            })
          }))
        })
        // Then delete topic
        topicPromises.push(new Promise((resolve, reject) => {
          application.deleteTopic(topicArn, (err) => {
            if (err) {
              reject(err)
            } else {
              debug('Removed topic ' + object._id.toString() + ' with ARN ' + topicArn + ' for platform ' + application.platform)
              resolve(topicArn)
            }
          })
        }))
      })
      await Promise.all(unsubscriptionPromises)
      const topicArns = await Promise.all(topicPromises)
      if (patch) {
        return service.patch(object._id, { [topicField]: null })
      } else {
        return topicArns
      }
    },
    createPlatformSubscriptions (object, users, topicField) {
      // Process with each registered platform
      const subscriptionPromises = []
      snsApplications.forEach(application => {
        // Then each target user
        users.forEach(user => {
          const devices = this.getDevices(user)
          // Then each target device
          devices.forEach(device => {
            if (device.platform.toUpperCase() === application.platform) {
              subscriptionPromises.push(new Promise((resolve, reject) => {
                const topicArn = _.get(object, topicField + '.' + application.platform)
                application.subscribe(device.arn, topicArn, (err, subscriptionArn) => {
                  if (err) {
                    // Be tolerant to SNS errors because some endpoints might have been revoked
                    // reject(new GeneralError(err, { [device.registrationId]: { user: user._id } }))
                    debug('Unable to subscribe device with token ' + device.registrationId + ' and ARN ' + device.arn + ' to application topic with ARN ' + topicArn, err)
                    resolve({ [device.registrationId]: { user: user._id, arn: null } })
                  } else {
                    debug('Subscribed device with token ' + device.registrationId + ' and ARN ' + device.arn + ' to application topic with ARN ' + topicArn)
                    resolve({ [device.registrationId]: { user: user._id, arn: subscriptionArn } })
                  }
                })
              }))
            }
          })
        })
      })
      return Promise.all(subscriptionPromises)
    },
    getPlatformSubscriptions (object, topicField) {
      const subscriptionPromises = []
      snsApplications.forEach(application => {
        subscriptionPromises.push(new Promise((resolve, reject) => {
          const topicArn = _.get(object, topicField + '.' + application.platform)
          application.getSubscriptions(topicArn, (err, subscriptions) => {
            if (err) {
              // Be tolerant to SNS errors because some topics might have been deleted
              // reject(err)
              debug('Unable to retrieve subscriptions for topic ' + object._id.toString() + ' with ARN ' + topicArn + ' for platform ' + application.platform, err)
              resolve([])
            } else {
              debug('Retrieved ' + subscriptions.length + ' subscriptions for topic ' + object._id.toString() + ' with ARN ' + topicArn + ' for platform ' + application.platform)
              resolve(subscriptions)
            }
          })
        }))
      })
      return Promise.all(subscriptionPromises)
    },
    removePlatformSubscriptions (object, users, topicField) {
      // First get all subscribers of the topic because we do not store them
      // Process with each registered platform
      return this.getPlatformSubscriptions(object, topicField)
        .then(platformSubscriptions => {
          const unsubscriptionPromises = []
          // Process with each registered platform
          platformSubscriptions.forEach(subscriptions => {
          // Remove the given subscribers from the topic
            subscriptions.forEach(subscription => {
              users.forEach(user => {
                const devices = this.getDevices(user)
                devices.forEach(device => {
                  if (device.arn === subscription.Endpoint) {
                    unsubscriptionPromises.push(new Promise((resolve, reject) => {
                      const application = this.getSnsApplication(device.platform)
                      const topicArn = _.get(object, topicField + '.' + application.platform)
                      application.unsubscribe(subscription.SubscriptionArn, (err) => {
                        if (err) {
                        // Be tolerant to SNS errors because some endpoints might have been revoked
                        // reject(new GeneralError(err, { [device.registrationId]: { user: user._id } }))
                          debug('Unable to unsubscribe device with token ' + device.registrationId + ' and ARN ' + device.arn + ' from topic with ARN ' + topicArn, err)
                          resolve({ [device.registrationId]: { user: user._id, arn: null } })
                        } else {
                          debug('Unsubscribed device with token ' + device.registrationId + ' and ARN ' + device.arn + ' from topic with ARN ' + topicArn)
                          resolve({ [device.registrationId]: { user: user._id, arn: subscription.SubscriptionArn } })
                        }
                      })
                    }))
                  }
                })
              })
            })
          })
          return Promise.all(unsubscriptionPromises)
        })
    },
    // Used to perform service actions such as create a user, a push notification, a topic, etc.
    create (data, params) {
      debug(`pusher service called for create action=${data.action}`)

      switch (data.action) {
        case 'device':
          // return this.registerDevice(data.device, params.user, params.patch)
          return this.createDevice(data.device, params.user)
        case 'topic':
          return this.createPlatformTopics(params.pushObject, params.pushObjectService, data.topicField || defaultTopicField, params.patch)
        case 'subscriptions':
          return this.createPlatformSubscriptions(params.pushObject, params.users, data.topicField || defaultTopicField)
        case 'message': {
          const topicField = data.topicField || defaultTopicField
          // If no topic we assume we want to publish on specific devices
          return _.get(params.pushObject, topicField)
            ? this.publishToPlatformTopics(params.pushObject, data.message, topicField)
            : this.publishToDevices(params.pushObject, data.message)
        }
      }
    },
    // Used to perform service actions such as update a user
    update (id, data, params) {
      debug(`pusher service called for update action=${data.action}`)

      switch (data.action) {
        case 'device':
          return this.updateDevice(id, data.device, params.user)
      }
    },
    // Used to perform service actions such as remove a user, a topic, etc.
    remove (id, params) {
      const query = params.query
      debug(`pusher service called for remove action=${query.action}`)

      switch (query.action) {
        case 'device':
          // return this.unregisterDevice(id, params.user, params.patch)
          return this.removeDevice(id, params.user)
        case 'topic':
          return this.removePlatformTopics(params.pushObject, params.pushObjectService, query.topicField || defaultTopicField, params.patch)
        case 'subscriptions':
          return this.removePlatformSubscriptions(params.pushObject, params.users, query.topicField || defaultTopicField)
      }
    }
  }
}
