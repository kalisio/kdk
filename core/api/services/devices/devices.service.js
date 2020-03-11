import makeDebug from 'debug'
import _ from 'lodash'

const debug = makeDebug('kalisio:kNotify:devices:service')

export default function (name, app, options) {
  // Keep track of config
  Object.assign(options, app.get('devices'))
  debug('devices service created with config ', options)
  return {
    findDeviceByUuid (device, user) {
      const devices = user.devices || []
      // Input could be a device object or an ID
      const uuid = (typeof device === 'string' ? device : device.uuid)
      return _.find(devices, { uuid })
    },
    findDeviceByRegistrationId (device, user) {
      const devices = user.devices || []
      // Input could be a device object or an ID
      const registrationId = (typeof device === 'string' ? device : device.registrationId)
      return _.find(devices, { registrationId })
    },
    isDeviceRegistered (device, user) {
      // Find existing device if any
      const previousDevice = this.findDeviceByUuid(device, user)
      if (previousDevice) {
        return (previousDevice.registrationId === device.registrationId)
      } else {
        return false
      }
    },
    async update (id, data, params) {
      // id: registrationId
      // data: device
      debug('Updating device', id, data)
      const usersService = app.getService('users')
      const pusherService = app.getService('pusher')

      // Retrieve the user's devices
      const user = params.user
      const devices = user.devices || []

      // Check whether we need to update or to register the device
      // according to https://docs.aws.amazon.com/sns/latest/dg/mobile-platform-endpoint.html
      let device = this.findDeviceByUuid(data, user)
      let createDevice = true
      if (device) {
        debug('Device already stored for user ', user._id)
        // Check if registration is ok
        try {
          device = await pusherService.update(id, { action: 'device', device }, { user })
          createDevice = false
        } catch (error) {
          debug(error)
          // Device is not registered anymore, remove it from user list
          _.remove(devices, userDevice => userDevice.uuid === device.uuid)
          // Then we will try to register it again
        }
      }
      if (createDevice) {
        device = Object.assign({}, data)
        // Bind the device
        device = await this.create(device, { user })
        // Store new device
        devices.push(device)
        debug('Storing new device for user ', user)
      } else {
        debug('Updating device for user ', user)
      }
      device.lastActivity = new Date()
      await usersService.patch(user._id, { devices }, { user, checkAuthorisation: true })
      return device
    },
    async create (data, params) {
      // data: device
      const user = params.user
      const pusherService = app.getService('pusher')
      // Bind the device
      debug('Binding new device', data)
      data.arn = await pusherService.create({ action: 'device', device: data }, { user })
      return data
    },
    async remove (id, params) {
      // id: registrationId
      debug('Unbinding old device', id)
      const usersService = app.getService('users')
      const pusherService = app.getService('pusher')
      // Retrieve the user's devices
      const user = params.user
      const devices = user.devices || []

      await pusherService.remove(id, { query: { action: 'device' }, user })
      const device = this.findDeviceByRegistrationId(id, user)
      _.remove(devices, userDevice => userDevice.registrationId === id)
      await usersService.patch(user._id, { devices }, { user, checkAuthorisation: true })
      return device
    }
  }
}
